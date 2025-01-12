const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const app = express();
const cors = require("cors");

app.use(cors());
app.get("/api/data", (req, res) => {
  const results = [];

  const csvFilePath = path.join(
    __dirname,
    "Electric_Vehicle_Population_Data.csv"
  );

  console.log("Reading CSV data...");

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => {
      console.log("Finished reading CSV data.");
      res.json(results);
    })
    .on("error", (err) => {
      console.error("Error reading the CSV file:", err);
      res.status(500).json({ error: "Failed to read the CSV file" });
    });
});

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
