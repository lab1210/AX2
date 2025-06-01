import React from "react";

const ConfirmPaymentModal = ({ amount, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center top-70 lg:hidden">
      <div className="bg-white rounded-t-3xl shadow-3xl w-[95%] max-w-md md:max-w-[70%] p-0 relative items-center animate-slideUp">
        <div className="flex flex-col items-center pt-6 pb-8 px-6">
          <div className="w-12 h-1 rounded-full bg-[#FFA500] mb-8" />
          <h2 className="text-xl font-bold mb-6 text-center">
            You are about to pay
          </h2>
          <div className="text-3xl font-bold text-[#FFA500] mb-6 text-center">
            {amount}
          </div>
          <div className="text-gray-500 text-md mb-8 text-center">
            Are you sure about this transaction?
          </div>
          <div className="flex gap-4 w-full justify-center p-4">
            <button
              className="flex-1 bg-[#004080] text-white font-bold py-2 rounded-lg transition"
              onClick={onConfirm}
            >
              Yes
            </button>
            <button
              className="flex-1 bg-red-500 text-white font-bold py-2 rounded-lg transition"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPaymentModal;
