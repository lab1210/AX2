import React from "react";
import Image from "next/image";

const StatCard = ({ label, value, icon, percentage }) => {
  return (
    <div className="flex items-center justify-between border border-gray-300 rounded-lg p-4 shadow-sm">
      <div>
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        <h2 className="text-4xl font-bold text-black">{value}</h2>
        <p className="text-xs text-gray-500">
          {percentage > 0 ? `+${percentage}%` : `${percentage}%`} than last term
        </p>
      </div>

      <div>
        <Image src={icon} alt={label} width={25} height={25} />
      </div>
    </div>
  );
};

export default StatCard;