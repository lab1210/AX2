import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for the pie chart
const data = [
  { name: "Present", value: 54 },
  { name: "Absent", value: 46 },
  
];

const COLORS = ["#01427A", "#4169E1"];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-md p-2 shadow-md">
        <p className="text-gray-700">{`${label} : ${payload[0].value}%`}</p>
      </div>
    );
  }

  return null;
};

const RightSidebar = () => {
  return (
    <div className="w-[20%] mt-3 p-2">
      <div className="mb-6 bg-white rounded-lg shadow-xl p-4">
        <div className="flex items-center gap-2 text-red-500 font-semibold mb-2">
          <span>Notice</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Attendance for 06/10/23 has not been uploaded and is past the due date</li>
          <li>JSS 1A students offering English Language might not be eligible for exams</li>
          <li>JSS 2B students offering Literature in English might not be eligible for exams</li>
        </ul>
      </div>

      {/* Attendance Statistics Section */}
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="p-4">
        <div className="flex items-center justify-between text-gray-700 font-semibold border-b border-gray-300">
          <span className="font-semibold">Attendance Statistics</span>
          <span className="text-xs text-white font-bold bg-[#BDBDBD] rounded-full p-2 ">i</span>
        </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#01427A]"></div>
            <span className="text-sm text-gray-600">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4169E1]"></div>
            <span className="text-sm text-gray-600">Absent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;