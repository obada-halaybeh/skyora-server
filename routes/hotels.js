import express from "express";
import db from "../db.js";
import adminAuth from "../middleware/adminAuth.js";
const router = express.Router();

// localhost:5000/api/hotels
// GET
// returns all hotels
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM hotels ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/hotels/2
// GET
// returns one hotel + rooms + offers + gallery + reviews
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

// localhost:5000/api/hotels
// POST
// header >> x-role: admin
// body >> { name, location, country, stars, rating, review_count, rooms_count, price, img_seed, amenities, status, rooms, offers, gallerySeeds }
// (rooms, offers, gallery are inserted into their child tables)
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
      rooms,
      offers,
      gallerySeeds,
    } = req.body;

    // 1. Insert the hotel
    const hotelResult = await db.query(
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
    const hotel = hotelResult.rows[0];

    // 2. Insert rooms (if any)
    if (rooms && rooms.length > 0) {
      for (const r of rooms) {
        await db.query(
          `INSERT INTO rooms (hotel_id, type, size, guests, price, img_seed)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [hotel.id, r.type, r.size, r.guests, r.price, r.img_seed || img_seed],
        );
      }
    }

    // 3. Insert offers (if any)
    if (offers && offers.length > 0) {
      for (const label of offers) {
        await db.query(
          "INSERT INTO hotel_offers (hotel_id, label) VALUES ($1, $2)",
          [hotel.id, label],
        );
      }
    }

    // 4. Insert gallery seeds (if any)
    if (gallerySeeds && gallerySeeds.length > 0) {
      for (const seed of gallerySeeds) {
        await db.query(
          "INSERT INTO hotel_gallery (hotel_id, seed) VALUES ($1, $2)",
          [hotel.id, seed],
        );
      }
    }

    res.status(201).json(hotel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/hotels/2
// PUT
// header >> x-role: admin
// body >> same as POST (rebuilds children)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const id = req.params.id;
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
      rooms,
      offers,
      gallerySeeds,
    } = req.body;

    // 1. Update the hotel
    const hotelResult = await db.query(
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
        id,
      ],
    );

    if (hotelResult.rows.length === 0)
      return res.status(404).json({ message: "Hotel not found" });

    // 2. Replace children: delete old, insert new
    await db.query("DELETE FROM rooms WHERE hotel_id = $1", [id]);
    await db.query("DELETE FROM hotel_offers WHERE hotel_id = $1", [id]);
    await db.query("DELETE FROM hotel_gallery WHERE hotel_id = $1", [id]);

    if (rooms && rooms.length > 0) {
      for (const r of rooms) {
        await db.query(
          `INSERT INTO rooms (hotel_id, type, size, guests, price, img_seed)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [id, r.type, r.size, r.guests, r.price, r.img_seed || img_seed],
        );
      }
    }
    if (offers && offers.length > 0) {
      for (const label of offers) {
        await db.query(
          "INSERT INTO hotel_offers (hotel_id, label) VALUES ($1, $2)",
          [id, label],
        );
      }
    }
    if (gallerySeeds && gallerySeeds.length > 0) {
      for (const seed of gallerySeeds) {
        await db.query(
          "INSERT INTO hotel_gallery (hotel_id, seed) VALUES ($1, $2)",
          [id, seed],
        );
      }
    }

    res.json(hotelResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// localhost:5000/api/hotels/2
// DELETE
// header >> x-role: admin
// (rooms, offers, gallery auto-delete via ON DELETE CASCADE)
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
