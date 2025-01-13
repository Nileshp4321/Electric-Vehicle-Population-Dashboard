import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Chart from "chart.js/auto";
import DataTable from "react-data-table-component";

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    axios
      .get("https://electric-vehicle-population-dashboard-backend-yvht.vercel.app/api/data")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching the data:", error));
  }, []);

  useEffect(() => {
    if (!loading && chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map((d) => d["Make"]),
          datasets: [
            {
              label: "Number of Vehicles",
              data: data.map((d) => parseInt(d["VIN (1-10)"])),
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              barThickness: 50,
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
    }
  }, [loading, data]);

  return (
    <div className="dashboard">
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <canvas ref={chartRef} width="400" height="200"></canvas>
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
