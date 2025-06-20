import React, { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city name");
      return;
    }

    try {
      const response = await fetch(`/api/weather?address=${city}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
      setError("");
    } catch (err) {
      setError(err.message || "Failed to fetch weather data");
      setResult(null);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px", fontFamily: "Arial" }}>
      <h1>🌤 Weather App</h1>
      <input
        type="text"
        value={city}
        placeholder="Enter city"
        onChange={(e) => setCity(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "250px",
          marginRight: "10px",
        }}
      />
      <button
        onClick={getWeather}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Get Weather
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {result && (
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "#f0f0f0",
            padding: "20px",
            borderRadius: "10px",
            display: "inline-block",
          }}
        >
          <h2>City: {result.city}</h2>
          <p>Temperature: {result.temperature}°C</p>
          <p>Sunset Time: {result.sunset}</p>
        </div>
      )}
    </div>
  );
}

export default App;

