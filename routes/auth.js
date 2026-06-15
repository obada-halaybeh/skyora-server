import express from "express";
import db from "../db.js";
const router = express.Router();

// POST /api/auth/signup  — body: { name, email, password }
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (exists.rows.length > 0)
      return res.status(400).json({ message: "User already exists" });

    const result = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, 'customer') RETURNING *",
      [name, email, password],
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login  — body: { email, password }
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password],
    );
    if (result.rows.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
