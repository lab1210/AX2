"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#F97316", "#EF4444"]; 

export default function WeeklyReportCard({
  eligibility,
  missedAssembly,
  missedClass,
}) {
  const data = [
    { name: "Eligible", value: eligibility },
    { name: "Not Eligible", value: 100 - eligibility },
  ];

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-row items-center justify-center gap-8 max-w-xl md:max-w-2xl w-full">
        {/* Pie Chart and Eligibility */}
        <div className="flex flex-col items-center justify-center min-w-[140px]">
          <div className="relative w-28 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius="70%"
                  outerRadius="100%"
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={4}
                >
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={COLORS[idx]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{eligibility}%</span>
            </div>
          </div>
          <div className="mt-2 text-lg font-bold text-gray-900 text-center">
            Exam Eligibility
          </div>
        </div>

        <div className="h-24 border-l border-gray-200" />

        <div className="flex flex-col justify-center min-w-[25vh]">
          <div className="text-md md:text-lg font-medium text-gray-900 mb-3 text-center">Weekly Report</div>
          <ul className="space-y-2 text-base">
            <li>
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-3" />
              <span className="w-full">
                <span className="font-bold text-blue-600">{missedAssembly}</span>
                <span className="text-gray-900 font-normal text-sm md:text-lg"> missed assembly days</span>
              </span>
            </li>
            <li>
              <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-3" />
              <span className="w-full">
                <span className="font-bold text-blue-600">{missedClass}</span>
                <span className="text-gray-900 font-normal text-sm md:text-lg"> missed Class days</span>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}