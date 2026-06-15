import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

// GET all bundles
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM bundles ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET one bundle + timeline + breakdown + reviews
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const bundle = await db.query("SELECT * FROM bundles WHERE id = $1", [id]);
    if (bundle.rows.length === 0)
      return res.status(404).json({ message: "Bundle not found" });

    const timeline = await db.query(
      "SELECT * FROM bundle_timeline WHERE bundle_id = $1 ORDER BY step_order",
      [id],
    );
    const breakdown = await db.query(
      "SELECT * FROM bundle_breakdown WHERE bundle_id = $1 ORDER BY id",
      [id],
    );
    const reviews = await db.query(
      "SELECT * FROM reviews WHERE type = 'bundle' AND item_id = $1 ORDER BY id",
      [id],
    );

    res.json({
      ...bundle.rows[0],
      timeline: timeline.rows,
      breakdown: breakdown.rows,
      reviews: reviews.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper: build timeline from flight + hotel info
function buildTimeline(b) {
  return [
    {
      step_order: 0,
      time: b.depart,
      label: `Depart ${b.origin}`,
      type: "flight",
      icon: "✈",
    },
    {
      step_order: 1,
      time: b.arrive,
      label: `Arrive ${b.dest_code}`,
      type: "flight",
      icon: "🛬",
    },
    {
      step_order: 2,
      time: "Check-in",
      label: `Check-in: ${b.hotel_name}`,
      type: "hotel",
      icon: "🏨",
    },
    {
      step_order: 3,
      time: "Check-out",
      label: "Check-out from hotel",
      type: "hotel",
      icon: "🔑",
    },
    {
      step_order: 4,
      time: b.arrive,
      label: `Depart ${b.dest_code}`,
      type: "flight",
      icon: "✈",
    },
    {
      step_order: 5,
      time: b.depart,
      label: `Arrive ${b.origin}`,
      type: "flight",
      icon: "🛬",
    },
  ];
}

// Helper: build breakdown from prices
function buildBreakdown(b) {
  const flightCost = Math.round(b.price * 0.4);
  const hotelCost = Math.round(b.price * 0.7);
  const discount = b.original ? -(b.original - b.price) : 0;
  const fee = Math.round(b.price * 0.05);
  return [
    {
      item: `Return flights (${b.travelers || "2 adults"})`,
      price: flightCost,
    },
    { item: `${b.hotel_name} · ${b.nights} nights`, price: hotelCost },
    { item: "Bundle discount", price: discount },
    { item: "Skyora service fee", price: fee },
  ];
}

// localhost:5000/api/bundles
// POST
router.post("/", adminAuth, async (req, res) => {
  try {
    const b = req.body;

    const result = await db.query(
      `INSERT INTO bundles (title, destination, travelers, airline, flight_no, flight_label, origin, dest_code, depart, arrive, duration, hotel_id, hotel_name, hotel_rating, hotel_reviews, room_type, nights, price, original, img_seed, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) RETURNING *`,
      [
        b.title,
        b.destination,
        b.travelers,
        b.airline,
        b.flight_no,
        b.flight_label,
        b.origin,
        b.dest_code,
        b.depart,
        b.arrive,
        b.duration,
        b.hotel_id,
        b.hotel_name,
        b.hotel_rating,
        b.hotel_reviews,
        b.room_type,
        b.nights,
        b.price,
        b.original,
        b.img_seed,
        b.status,
      ],
    );
    const bundle = result.rows[0];

    // Auto-generate timeline
    const timeline = buildTimeline(bundle);
    for (const t of timeline) {
      await db.query(
        "INSERT INTO bundle_timeline (bundle_id, step_order, time, label, type, icon) VALUES ($1,$2,$3,$4,$5,$6)",
        [bundle.id, t.step_order, t.time, t.label, t.type, t.icon],
      );
    }

    // Auto-generate breakdown
    const breakdown = buildBreakdown(bundle);
    for (const row of breakdown) {
      await db.query(
        "INSERT INTO bundle_breakdown (bundle_id, item, price) VALUES ($1,$2,$3)",
        [bundle.id, row.item, row.price],
      );
    }

    res.status(201).json(bundle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/bundles/2
// PUT
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const b = req.body;

    const result = await db.query(
      `UPDATE bundles SET title=$1, destination=$2, travelers=$3, airline=$4, flight_no=$5, flight_label=$6, origin=$7, dest_code=$8, depart=$9, arrive=$10, duration=$11, hotel_id=$12, hotel_name=$13, hotel_rating=$14, hotel_reviews=$15, room_type=$16, nights=$17, price=$18, original=$19, img_seed=$20, status=$21
       WHERE id=$22 RETURNING *`,
      [
        b.title,
        b.destination,
        b.travelers,
        b.airline,
        b.flight_no,
        b.flight_label,
        b.origin,
        b.dest_code,
        b.depart,
        b.arrive,
        b.duration,
        b.hotel_id,
        b.hotel_name,
        b.hotel_rating,
        b.hotel_reviews,
        b.room_type,
        b.nights,
        b.price,
        b.original,
        b.img_seed,
        b.status,
        id,
      ],
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Bundle not found" });
    const bundle = result.rows[0];

    // Rebuild children: delete old, regenerate
    await db.query("DELETE FROM bundle_timeline WHERE bundle_id = $1", [id]);
    await db.query("DELETE FROM bundle_breakdown WHERE bundle_id = $1", [id]);

    const timeline = buildTimeline(bundle);
    for (const t of timeline) {
      await db.query(
        "INSERT INTO bundle_timeline (bundle_id, step_order, time, label, type, icon) VALUES ($1,$2,$3,$4,$5,$6)",
        [bundle.id, t.step_order, t.time, t.label, t.type, t.icon],
      );
    }

    const breakdown = buildBreakdown(bundle);
    for (const row of breakdown) {
      await db.query(
        "INSERT INTO bundle_breakdown (bundle_id, item, price) VALUES ($1,$2,$3)",
        [bundle.id, row.item, row.price],
      );
    }

    res.json(bundle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE bundle (admin) — timeline/breakdown auto-delete via CASCADE
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM bundles WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    result.rows.length > 0
      ? res.json({ deleted: result.rows[0] })
      : res.status(404).json({ message: "Bundle not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
