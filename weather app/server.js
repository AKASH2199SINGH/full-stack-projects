const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your OpenWeatherMap API key
const API_KEY = "ca695dcbc66c5fa3d0cb955033fd918f";

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// Weather API route
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: "City is required" });

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
    const response = await axios.get(url);
    const data = response.data;

    const weatherData = {
      city: data.name,
      temp: `${(data.main.temp - 273.15).toFixed(1)} °C`,
      feels_like: `${(data.main.feels_like - 273.15).toFixed(1)} °C`,
      humidity: `${data.main.humidity} %`,
      description: data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    };

    res.json(weatherData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
