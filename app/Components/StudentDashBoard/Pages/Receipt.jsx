"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../Studentlayout";
import dummysession from "../../session";
import { getUserDetails } from "@/app/Service/AuthService";

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
      // PaymentDate: "07/09/23", // Removed from receipts
    },
    {
      purpose: "Extracurricular Sports Mentorship",
      TransactionNumber: "TD04",
      AmountBilled: 20000,
      AmountPaid: 20000,
      //PaymentDate: "07/09/23", // Removed from receipts
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

  return (
    <Layout>
      <div className="flex flex-col gap-5 p-4 xl:pt-10 xl:pr-8  bg-[#f0f0f0] rounded-lg min-h-screen">
        {/* ReceiptGrid: grid with two auto rows */}
        <div>
          {/* ReceiptPageTitle */}
          <div className="bg-white mb-5 rounded-[15px] p-5">
            <h2 className="text-xl font-bold">Financial Transaction Receipt</h2>
          </div>
          {/* ReceiptPageContent */}
          <div className="bg-white mb-5 rounded-[10px] flex flex-col gap-5">
            {/* firstRow */}
            <div className="flex justify-between items-center px-10 pt-5">
              {/* dropdown */}
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
              {/* printButton */}
              <div>
                <button className="bg-[#0b71b5] text-white font-bold px-10 py-2.5 rounded-[10px] cursor-pointer">
                  Print
                </button>
              </div>
            </div>
            {/* secondRow */}
            <div className="flex flex-col gap-5">
              {/* head */}
              <div className="text-center border-[#cfcfcf]">
                <div className="mb-[30px]">
                  <h2 className="text-xl font-bold">{user.student.school}</h2>
                  <h2 className="text-xl font-bold">Proof of Fees Payment</h2>
                </div>
                <div className="flex text-sm items-center justify-center font-bold gap-[10px]">
                  <p>
                    Name:{" "}
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
              {/* Receipt Table */}
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
              {/* ReceiptTotalContainer */}
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
    </Layout>
  );
};

export default ReceiptItem;
