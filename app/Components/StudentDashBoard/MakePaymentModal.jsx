import React from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";

const MakePaymentModal = ({ onClose }) => {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const statement = {
    transactionId: "TD01",
    semesterFees: 250000,
    amountPaid: 152345,
    pending: 15345,
    total: 252650,
  };
  const formatCurrency = (amount) =>
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="absolute inset-0 z-50 flex justify-center top-60 lg:hidden">
      <div className="bg-white rounded-3xl shadow-2xl w-[95%] max-w-md md:max-w-2xl p-0 relative">
        <div className="flex flex-col pt-6 items-center pb-2 px-6">
          <div className="flex items-center w-12 h-1 rounded-full bg-[#FFA500] mb-10" />
          <div className="bg-white w-full mb-4">
            <h2 className="text-xl font-bold mb-5">Statement Details</h2>
            <div className="text-[#A1A1A1] text-md mb-4">
              Transaction ID: {statement.transactionId}
            </div>
            <div className="border-t border-gray-200 my-2" />
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Semester School Fees</span>
              <span className="text-[#A1A1A1]">
                {formatCurrency(statement.semesterFees)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Amount Paid</span>
              <span className="text-[#A1A1A1]">
                {formatCurrency(statement.amountPaid)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Pending</span>
              <span className="text-red-500">
                {formatCurrency(statement.pending)}
              </span>
            </div>
            <div className="border-t border-gray-200 my-2" />
            <div className="flex justify-between mt-2">
              <span className="font-bold">Total</span>
              <span className="text-[#A1A1A1]">
                {formatCurrency(statement.total)}
              </span>
            </div>
            <div className="border-t border-gray-200 my-2" />
          </div>
          <div className="flex gap-3 w-full mt-2 mb-2">
            <Link
              href={`/Student/Fees-Payment/Make-Payment?studentId=${studentId}`}
              >
            <button className="flex-1 bg-[#004080] hover:bg-[#17407e] text-white font-bold py-2 p-2 px-5 md:px-25 rounded-lg">
              Make Payments
            </button>
            </Link>
            <button
              className="flex-1 border border-gray-200 text-[#4169E1] font-bold py-2 rounded-lg"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakePaymentModal;
