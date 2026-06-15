import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

// localhost:5000/api/users
// GET
// returns all users
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM users ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/users
// POST
// body >> { name, email, password, status, joined }
// header >> x-role: admin
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, email, password, status, joined } = req.body;
    const result = await db.query(
      `INSERT INTO users (name, email, password, role, status, joined)
       VALUES ($1, $2, $3, 'customer', $4, $5) RETURNING *`,
      [name, email, password, status, joined],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/users/2
// PUT
// body >> { name, email, status, joined }
// header >> x-role: admin
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { name, email, status, joined } = req.body;
    const result = await db.query(
      `UPDATE users SET name = $1, email = $2, status = $3, joined = $4
       WHERE id = $5 RETURNING *`,
      [name, email, status, joined, req.params.id],
    );
    result.rows.length > 0
      ? res.json(result.rows[0])
      : res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/users/2
// DELETE
// header >> x-role: admin
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [req.params.id],
    );
    result.rows.length > 0
      ? res.json({ deleted: result.rows[0] })
      : res.status(404).json({ message: "User not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
