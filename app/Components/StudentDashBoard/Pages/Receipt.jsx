"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../Studentlayout";
import dummysession from "../../session";
import { getUserDetails } from "@/app/Service/AuthService";
import { useRouter } from "next/navigation";
import Receipt from "../../../public/Receipt.png";

const ReceiptItem = () => {
  const [session, setSession] = useState(dummysession[0]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const receipts = [
    {
      purpose: "Admission Acceptance Fee",
      TransactionNumber: "TD01",
      AmountBilled: 52000,
      AmountPaid: 52000,
    },
    {
      purpose: "Extracurricular Sports Mentorship",
      TransactionNumber: "TD04",
      AmountBilled: 20000,
      AmountPaid: 20000,
    },
  ];

  useEffect(() => {
    const userData = getUserDetails();
    setUser(userData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-50">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-4 border-t-[rgba(249,65,68,1)] rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }
  const router = useRouter();

  return (
    <Layout>
      <div className="hidden lg:flex flex-col gap-5 p-4 xl:pt-10 xl:pr-8  bg-[#f0f0f0] rounded-lg min-h-screen">
        <div>
          <div className="bg-white mb-5 rounded-[15px] p-5">
            <h2 className="text-xl font-bold">Financial Transaction Receipt</h2>
          </div>
          <div className="bg-white mb-5 rounded-[10px] flex flex-col gap-5">
            <div className="flex justify-between items-center px-10 pt-5">
              <div className="flex gap-[30px] items-center">
                <label htmlFor="session">Select Session :</label>
                <select
                  name="session"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  required
                  className="outline-none border-0 bg-[#cfcfcf66] rounded-[10px] p-2.5 text-base font-normal"
                >
                  {dummysession.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button className="bg-[#0b71b5] text-white font-bold px-10 py-2.5 rounded-[10px] cursor-pointer">
                  Print
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="text-center border-[#cfcfcf]">
                <div className="mb-[30px]">
                  <h2 className="text-xl font-bold">{user.student.school}</h2>
                  <h2 className="text-xl font-bold">Proof of Fees Payment</h2>
                </div>
                <div className="flex text-sm items-center justify-center font-bold gap-[10px]">
                  <p>
                    Name:
                    <span>
                      {user?.student?.first_name +
                        " " +
                        user?.student?.last_name}
                    </span>
                  </p>
                  <p>Student ID: {user.id}</p>
                  <p>Class: </p>
                  <p>Session: {session}</p>
                </div>
                <hr className="text-[#cfcfcf] w-full mt-5 mb-5" />
              </div>
              <div className="px-10">
                <table className="border-collapse mb-[18px] w-full table-fixed">
                  <thead className="bg-[#80adcb] text-white xl:text-base text-[13.4px]  text-left font-bold">
                    <tr>
                      <th className="py-[10px] px-[12px] w-1/2 ">S/N</th>
                      <th className="py-[10px] px-[12px] w-1/2 ">Purpose</th>
                      <th className="py-[10px] px-[12px] w-1/2 ">
                        Transaction Number
                      </th>
                      <th className="py-[10px] px-[12px] w-1/2 ">
                        Amount Billed
                      </th>
                      <th className="py-[10px] px-[12px] w-1/2 ">
                        Amount Paid
                      </th>
                      <th className="py-[10px] px-[12px] w-1/2 ">
                        Payment Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="xl:text-sm text-xs">
                    {receipts.map((item, index) => {
                      const currentDate = new Date();
                      return (
                        <tr key={index}>
                          <td className="py-[10px] px-[12px] w-1/2  font-bold">
                            {index + 1}
                          </td>
                          <td className="py-[10px] px-[12px] w-1/2 ">
                            {item.purpose}
                          </td>
                          <td className="py-[10px] px-[12px] w-1/2 ">
                            {item.TransactionNumber}
                          </td>
                          <td className="py-[10px] px-[12px] w-1/2 ">
                            {item.AmountBilled.toLocaleString("en-NG", {
                              useGrouping: true,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-[10px] px-[12px] w-1/2 ">
                            {item.AmountPaid.toLocaleString("en-NG", {
                              useGrouping: true,
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-[10px] px-[12px] w-1/2 ">
                            {currentDate.toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="pl-35 mb-10 flex items-center font-bold gap-[10px]">
                <p className="text-sm">Total Payment</p>
                <div className="text-[#4084b1] bg-[#cfcfcf66] rounded-[10px] p-[5px] text-[18px]">
                  {receipts
                    .reduce((sum, fee) => sum + fee.AmountPaid, 0)
                    .toLocaleString("en-NG", {
                      useGrouping: true,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet View */}
      <div className="block lg:hidden min-h-screen">
        <div className="p-4">
          <img
            src={Receipt.src}
            alt="Lunch"
            className="w-20 h-20 object-contain"
          />
          <div className="mb-4">
            <div className="relative inline-block w-full text-gray-700">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              >
                {dummysession.map((sessionName) => (
                  <option key={sessionName} value={sessionName}>
                    {sessionName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {receipts.map((receipt, index) => (
              <div
                key={index}
                className="bg-white rounded-md border-b border-gray-300 p-4"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="text-md font-semibold">Receipt Number</h3>
                  <p> {receipt.TransactionNumber}</p>
                </div>
                <div className="grid grid-rows-2 gap-2 text-sm text-gray-600 border-t border-gray-300 mb-2">
                  <div className="flex justify-between gap-2 mt-2">
                    <p>Date Paid:</p>
                    <p className="font-semibold text-black">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-between gap-2">
                    <p>Time:</p>
                    <p className="font-semibold text-black">
                      {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex justify-between gap-2">
                    <p>Description:</p>
                    <p className="font-semibold text-black">
                      {receipt.purpose}
                    </p>
                  </div>
                  <div className="flex justify-between gap-2">
                    <p>Amount Paid:</p>
                    <p className="font-semibold text-black">
                      {receipt.AmountPaid.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="bg-[#004080] text-white font-semibold py-3 rounded-md shadow-md w-full mt-6">
            Download PDF
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ReceiptItem;
