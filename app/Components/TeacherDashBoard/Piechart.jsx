"use client";
import * as React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";

const data = [
  { id: 0, value: 57, label: "Present", color: "#01427A" },
  { id: 1, value: 43, label: "Absent", color: "#4169E1" },
];

export default function BasicPie() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Pie Chart */}
      <PieChart
        series={[
          {
            data,
            arcLabel: (item) => {
              const percentage = ((item.value / total) * 100).toFixed(0);
              return `${percentage}%`; 
            },
            // arcLabelMinAngle: 35, 
            arcLabelRadius: "60%", 
          },
        ]}
        width={190}
        height={135}
        slotProps={{
          legend: { hidden: true },
        }}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fontWeight: "bold", // Label text bold
            fontSize: "10px", // Customize font size
            fill: "#ffffff", // Label text color
          },
        }}
      />

      {/* Labels directly below chart in a row */}
      <div className="flex flex-row  justify-evenly w-full mt-2">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-2 text-xs">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: item.color }}
            ></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
