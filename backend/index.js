const express = require('express');
const axios = require('axios');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// ✅ CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // use * for now
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// ✅ Serve static frontend build files first
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ✅ React fallback route for unknown frontend routes
const frontendBuildPath = path.join(__dirname, '../frontend/build');

app.use(express.static(frontendBuildPath));

// Only match frontend routes (not API)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});


// ✅ Weather API route
app.get('/api/weather', (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(400).json({ error: "Please provide a city using ?address=CityName" });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${process.env.API_KEY}&units=metric`;

  axios.get(url)
    .then(response => {
      const data = response.data;
      const cityName = data.name;
      const temperature = data.main.temp;
      const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString();

      res.json({
        city: cityName,
        temperature,
        sunset: sunsetTime
      });
    })
    .catch(error => {
      console.error("API Error:", error.message);

      if (error.response && error.response.status === 404) {
        res.status(404).json({ error: "City not found" });
      } else {
        res.status(500).json({ error: "An error occurred while fetching data" });
      }
    });
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

