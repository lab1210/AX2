import React from "react";

const StatCard = ({ label, value, icon, percentage }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-5xl font-bold">{value}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-xs text-black mt-1">
        +{percentage}% than last term
      </p>
    </div>
  );
};

export default StatCard;