import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://w7.pngwing.com/pngs/926/178/png-transparent-brown-vehicle-car-icon-car-compact-car-glass-mode-of-transport-thumbnail.png",
  iconUrl:
    "https://w7.pngwing.com/pngs/926/178/png-transparent-brown-vehicle-car-icon-car-compact-car-glass-mode-of-transport-thumbnail.png",
});

const App = () => {
  const [currentPosition, setCurrentPosition] = useState([28.6139, 77.209]);
  const [path, setPath] = useState([[28.6139, 77.209]]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch vehicle's coordinates from the backend
  const fetchCoordinates = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/vehicle-coordinates"
      );

      console.log(response);
      const data = await response.json();
      const { latitude, longitude } = data;

      // Update position and path with data from the backend
      const newPosition = [latitude, longitude];
      setCurrentPosition(newPosition);
      setPath((prevPath) => [...prevPath, newPosition]);
    } catch (error) {
      console.error("Error fetching vehicle coordinates:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchCoordinates, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async () => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
    );
    const data = await response.json();
    if (data.length > 0) {
      const { lat, lon } = data[0];
      setCurrentPosition([parseFloat(lat), parseFloat(lon)]);
      setPath((prevPath) => [...prevPath, [parseFloat(lat), parseFloat(lon)]]);
    }
  };

  return (
    <div className="mapSection">
      <h1>Vehicle Movement on a Map</h1>
      <MapContainer
        center={currentPosition}
        zoom={7}
        style={{
          height: "100vh",
          width: "100%",
          border: "8px solid white",
          borderRadius: "7px",
        }}
      >
        {/* Search bar */}
        <div
          style={{ position: "absolute", top: 20, left: "40%", zIndex: 1000 }}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location"
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={currentPosition} />
        <Polyline positions={path} color="blue" />
      </MapContainer>
    </div>
  );
};

export default App;
