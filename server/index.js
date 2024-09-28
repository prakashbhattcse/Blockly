const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors());

// Dummy data to simulate the vehicle's coordinates
const vehicleData = [
  {
    latitude: 30.335723139343973,
    longitude: 77.40698833251217,
  },
  {
    latitude: 29.85253794593389,
    longitude: 78.21183842319444,
  },
  {
    latitude: 29.761728218445374,
    longitude: 78.82364534226501,
  },
  {
    latitude: 28.768679633000108,
    longitude: 78.04187858440474,
  },
  {
    latitude: 29.904499854804683,
    longitude: 75.02453320318963,
  },
  {
    latitude: 28.720579198401648,
    longitude: 73.87245570651855,
  },
];

let currentIndex = 0;

app.get("/api/vehicle-coordinates", (req, res) => {
  console.log();
  currentIndex = (currentIndex + 1) % vehicleData.length;
  res.json(vehicleData[currentIndex]);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
