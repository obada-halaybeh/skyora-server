import express from "express";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// localhost:5000/api/weather/Dubai
// GET
// returns current weather for the city
router.get("/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const key = process.env.OPENWEATHER_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(404).json({ message: "Weather not found" });
    }

    // Send back only what the frontend needs
    res.json({
      city: data.name,
      temp: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind: data.wind.speed,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
