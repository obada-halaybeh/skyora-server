import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

// localhost:5000/api/bookings
// GET
// returns all bookings
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM bookings ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/bookings
// POST
// body >> { ref, user_email, type, item_id, customer, trip, seat, room, booking_date, price, status }
router.post("/", async (req, res) => {
  try {
    const {
      ref,
      user_email,
      type,
      item_id,
      customer,
      trip,
      seat,
      room,
      booking_date,
      price,
      status,
    } = req.body;
    const result = await db.query(
      `INSERT INTO bookings (ref, user_email, type, item_id, customer, trip, seat, room, booking_date, price, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        ref,
        user_email,
        type,
        item_id,
        customer,
        trip,
        seat,
        room,
        booking_date,
        price,
        status,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/bookings/2
// PUT
// body >> { status }   (admin only — change Confirmed/Cancelled)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const result = await db.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, req.params.id],
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "Booking not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/bookings/2
// DELETE
// header >> x-role: admin
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM bookings WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    result.rows.length > 0
      ? res.json({ deleted: result.rows[0] })
      : res.status(404).json({ message: "Booking not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
