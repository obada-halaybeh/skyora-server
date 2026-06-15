import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import db from "./db.js";

import authRoutes from "./routes/auth.js";
import flightRoutes from "./routes/flights.js";
import hotelRoutes from "./routes/hotels.js";
import bundleRoutes from "./routes/bundles.js";
import bookingRoutes from "./routes/bookings.js";
import userRoutes from "./routes/users.js";
import reviewRoutes from "./routes/reviews.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// localhost:5000
app.use("/api/auth", authRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bundles", bundleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("Skyora API (PostgreSQL) is running");
});

db.connect().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`),
  );
});
