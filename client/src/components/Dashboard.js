// components/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import DataTable from "react-data-table-component";

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://electric-vehicle-population-dashboard-backend-yvht.vercel.app/api/data")
      .then((response) => {
        setData(response.data);
        setLoading(false);
        renderCharts(response.data);
      })
      .catch((error) => console.error("Error fetching the data:", error));
  }, []);

  const renderCharts = (data) => {
    const ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((d) => d["Make"]),
        datasets: [
          {
            label: "Number of Vehicles",
            data: data.map((d) => parseInt(d["VIN (1-10)"])), // Example using VIN count
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            barThickness: 50, // Sets the fixed thickness of bars
            maxBarThickness: 100,
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  };

  return (
    <div className="dashboard">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <canvas id="myChart" width="400" height="200"></canvas>
          <DataTable
            title="Electric Vehicle Data"
            columns={[
              { name: "Make", selector: (row) => row.Make },
              { name: "Model", selector: (row) => row.Model },
              { name: "Year", selector: (row) => row["Model Year"] },
            ]}
            data={data}
            pagination
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
