import express from "express";
import axios from "axios";
import { join } from 'path';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
const API_KEY =process.env.API_KEY; // Your API key

// Middleware to serve static files
app.use('/styles', express.static(join(process.cwd(), 'styles')));  // Use `process.cwd()` for current directory
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/submit-location", async (req, res) => {
  const location = req.body.location;
  try {
    // Single API call to get current weather data
    const  weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`);
    const weatherData = weatherResponse.data.main;  // Extract 'main' object for temperature
    const umbrellaMessage = weatherData.temp < 283.15 ? 'You might need an umbrella!' : 'No umbrella needed today!';

    res.render("index.ejs", { location, weatherData, umbrellaMessage });

  } catch (error) {
    console.error('Error fetching weather data:', error.response ? error.response.data : error.message);
    res.status(500).send('Could not fetch the data');
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
