import express from "express";
import db from "../db.js";
const router = express.Router();

// localhost:5000/api/reviews/hotel/1
// GET
// returns all reviews for one item (type = flight/hotel/bundle, id = item id)
router.get("/:type/:itemId", async (req, res) => {
  try {
    const { type, itemId } = req.params;
    const result = await db.query(
      "SELECT * FROM reviews WHERE type = $1 AND item_id = $2 ORDER BY id",
      [type, itemId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/reviews
// POST
// body >> { type, item_id, name, rating, text, review_date }
router.post("/", async (req, res) => {
  try {
    const { type, item_id, name, rating, text, review_date } = req.body;
    const result = await db.query(
      `INSERT INTO reviews (type, item_id, name, rating, text, review_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [type, item_id, name, rating, text, review_date],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
