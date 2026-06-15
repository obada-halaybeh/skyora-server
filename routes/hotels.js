import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

// GET all hotels
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM hotels ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET one hotel + rooms + offers + gallery + reviews
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const hotel = await db.query("SELECT * FROM hotels WHERE id = $1", [id]);
    if (hotel.rows.length === 0)
      return res.status(404).json({ message: "Hotel not found" });

    const rooms = await db.query(
      "SELECT * FROM rooms WHERE hotel_id = $1 ORDER BY id",
      [id],
    );
    const offers = await db.query(
      "SELECT * FROM hotel_offers WHERE hotel_id = $1 ORDER BY id",
      [id],
    );
    const gallery = await db.query(
      "SELECT * FROM hotel_gallery WHERE hotel_id = $1 ORDER BY id",
      [id],
    );
    const reviews = await db.query(
      "SELECT * FROM reviews WHERE type = 'hotel' AND item_id = $1 ORDER BY id",
      [id],
    );

    res.json({
      ...hotel.rows[0],
      rooms: rooms.rows,
      offers: offers.rows.map((o) => o.label),
      gallerySeeds: gallery.rows.map((g) => g.seed),
      reviews: reviews.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE hotel (admin)
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      name,
      location,
      country,
      stars,
      rating,
      review_count,
      rooms_count,
      price,
      img_seed,
      amenities,
      status,
    } = req.body;
    const result = await db.query(
      `INSERT INTO hotels (name, location, country, stars, rating, review_count, rooms_count, price, img_seed, amenities, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        name,
        location,
        country,
        stars,
        rating,
        review_count,
        rooms_count,
        price,
        img_seed,
        amenities,
        status,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE hotel (admin)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const {
      name,
      location,
      country,
      stars,
      rating,
      review_count,
      rooms_count,
      price,
      img_seed,
      amenities,
      status,
    } = req.body;
    const result = await db.query(
      `UPDATE hotels SET name=$1, location=$2, country=$3, stars=$4, rating=$5, review_count=$6, rooms_count=$7, price=$8, img_seed=$9, amenities=$10, status=$11
       WHERE id=$12 RETURNING *`,
      [
        name,
        location,
        country,
        stars,
        rating,
        review_count,
        rooms_count,
        price,
        img_seed,
        amenities,
        status,
        req.params.id,
      ],
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "Hotel not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE hotel (admin) — children auto-delete via ON DELETE CASCADE
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM hotels WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    result.rows.length > 0
      ? res.json({ deleted: result.rows[0] })
      : res.status(404).json({ message: "Hotel not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
