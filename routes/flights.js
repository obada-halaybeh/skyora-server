import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

// GET all flights
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM flights ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET one flight + its reviews
router.get("/:id", async (req, res) => {
  try {
    const flight = await db.query("SELECT * FROM flights WHERE id = $1", [
      req.params.id,
    ]);
    if (flight.rows.length === 0)
      return res.status(404).json({ message: "Flight not found" });

    const reviews = await db.query(
      "SELECT * FROM reviews WHERE type = 'flight' AND item_id = $1 ORDER BY id",
      [req.params.id],
    );

    res.json({ ...flight.rows[0], reviews: reviews.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE flight (admin)
router.post("/", adminAuth, async (req, res) => {
  try {
    const {
      airline,
      flight_no,
      origin,
      destination,
      country,
      depart,
      arrive,
      duration,
      stops,
      direct,
      price,
      seats,
      schedule,
      status,
    } = req.body;
    const result = await db.query(
      `INSERT INTO flights (airline, flight_no, origin, destination, country, depart, arrive, duration, stops, direct, price, seats, schedule, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [
        airline,
        flight_no,
        origin,
        destination,
        country,
        depart,
        arrive,
        duration,
        stops,
        direct,
        price,
        seats,
        schedule,
        status,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE flight (admin)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const {
      airline,
      flight_no,
      origin,
      destination,
      country,
      depart,
      arrive,
      duration,
      stops,
      direct,
      price,
      seats,
      schedule,
      status,
    } = req.body;
    const result = await db.query(
      `UPDATE flights SET airline=$1, flight_no=$2, origin=$3, destination=$4, country=$5, depart=$6, arrive=$7, duration=$8, stops=$9, direct=$10, price=$11, seats=$12, schedule=$13, status=$14
       WHERE id=$15 RETURNING *`,
      [
        airline,
        flight_no,
        origin,
        destination,
        country,
        depart,
        arrive,
        duration,
        stops,
        direct,
        price,
        seats,
        schedule,
        status,
        req.params.id,
      ],
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "Flight not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE flight (admin)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM flights WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    result.rows.length > 0
      ? res.json({ deleted: result.rows[0] })
      : res.status(404).json({ message: "Flight not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
