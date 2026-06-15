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

// CREATE bundle (admin)
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      title,
      destination,
      flight,
      hotel,
      hotel_id,
      nights,
      price,
      original,
      img_seed,
      status,
    } = req.body;
    const result = await db.query(
      `INSERT INTO bundles (title, destination, flight_label, hotel_name, hotel_id, nights, price, original, img_seed, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        title,
        destination,
        flight,
        hotel,
        hotel_id,
        nights,
        price,
        original,
        img_seed,
        status,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE bundle (admin)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const {
      title,
      destination,
      flight,
      hotel,
      hotel_id,
      nights,
      price,
      original,
      img_seed,
      status,
    } = req.body;
    const result = await db.query(
      `UPDATE bundles SET title=$1, destination=$2, flight_label=$3, hotel_name=$4, hotel_id=$5, nights=$6, price=$7, original=$8, img_seed=$9, status=$10
       WHERE id=$11 RETURNING *`,
      [
        title,
        destination,
        flight,
        hotel,
        hotel_id,
        nights,
        price,
        original,
        img_seed,
        status,
        req.params.id,
      ],
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "Bundle not found" });
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
