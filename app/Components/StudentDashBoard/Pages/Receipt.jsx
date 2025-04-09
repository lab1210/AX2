"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../Studentlayout";
import dummysession from "../../session";
import { useUser } from "../context/UserProvider";

const ReceiptItem = () => {
  const [session, setSession] = useState(dummysession[0]);
  const { user, isLoading } = useUser();
  const [downloadPdf, setDownloadPdf] = useState(null);

  useEffect(() => {
    import("../../Print/DownloadasPdf").then((module) => {
      setDownloadPdf(() => module.default);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-50">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-4 border-t-[rgba(249,65,68,1)] rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    if (downloadPdf) {
      downloadPdf(
        ".ReceiptPageContent", 
        `${user.username}-Receipt.pdf`
      );
    } else {
      console.error("downloadPdf not loaded yet.");
    }
  };

  return (
    <Layout>
      {/* ReceiptGrid: grid with two auto rows */}
      <div className="grid grid-rows-[auto_auto]">
        {/* ReceiptPageTitle */}
        <div className="bg-white mb-5 rounded-[15px] p-5">
          <h2 className="text-xl font-bold">Financial Transaction Receipt</h2>
        </div>
        {/* ReceiptPageContent */}
        <div className="bg-white mb-5 rounded-[10px] py-5 px-10 flex flex-col gap-5">
          {/* firstRow */}
          <div className="flex justify-between items-center">
            {/* dropdown */}
            <div className="flex gap-[30px] items-center">
              <label htmlFor="session" className="font-bold">
                Select Session :
              </label>
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
              <button
                onClick={handleDownloadPDF}
                className="bg-[#0b71b5] text-white font-bold px-10 py-2.5 rounded-[10px] cursor-pointer"
              >
                Print
              </button>
            </div>
          </div>
          {/* secondRow */}
          <div className="flex flex-col gap-5">
            {/* head */}
            <div className="text-center border-b border-[#cfcfcf] p-5 mb-[25px]">
              <div className="mb-[30px]">
                <h2 className="text-xl font-bold">
                  Foursquare International Secondary School
                </h2>
                <h2 className="text-xl font-bold">Proof of Fees Payment</h2>
              </div>
              <div className="flex items-center justify-center font-bold gap-[10px]">
                <p>Name: {user.username}</p>
                <p>Student ID: {user.userId}</p>
                <p>Class: {user.class}</p>
                <p>Session: {session}</p>
              </div>
            </div>
            {/* Receipt Table */}
            <div>
              <table className="border-collapse mb-[30px] w-full">
                <thead className="bg-[#80adcb] text-white text-left font-bold">
                  <tr>
                    <th className="py-[10px] px-[12px] min-h-[60px]">S/N</th>
                    <th className="py-[10px] px-[12px] min-h-[60px]">
                      Purpose
                    </th>
                    <th className="py-[10px] px-[12px] min-h-[60px]">
                      Transaction Number
                    </th>
                    <th className="py-[10px] px-[12px] min-h-[60px]">
                      Amount Billed
                    </th>
                    <th className="py-[10px] px-[12px] min-h-[60px]">
                      Amount Paid
                    </th>
                    <th className="py-[10px] px-[12px] min-h-[60px]">
                      Payment Date
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[14px]">
                  {user.receipts.map((item, index) => {
                    const currentDate = new Date();
                    return (
                      <tr key={index}>
                        <td className="py-[10px] px-[12px] min-h-[60px] font-bold">
                          {index + 1}
                        </td>
                        <td className="py-[10px] px-[12px] min-h-[60px]">
                          {item.purpose}
                        </td>
                        <td className="py-[10px] px-[12px] min-h-[60px]">
                          {item.TransactionNumber}
                        </td>
                        <td className="py-[10px] px-[12px] min-h-[60px]">
                          {item.AmountBilled.toLocaleString("en-NG", {
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-[10px] px-[12px] min-h-[60px]">
                          {item.AmountPaid.toLocaleString("en-NG", {
                            useGrouping: true,
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-[10px] px-[12px] min-h-[60px]">
                          {currentDate.toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* ReceiptTotalContainer */}
            <div className="grid md:[grid-template-columns:30px_1fr_auto] xl:[grid-template-columns:80px_1fr_auto]">
              <div></div>
              <div className="flex items-center font-bold gap-[10px]">
                <p>Total Payment</p>
                <div className="text-[#4084b1] bg-[#cfcfcf66] rounded-[10px] p-[5px] text-[18px]">
                  {user.receipts
                    .reduce((sum, fee) => sum + fee.AmountPaid, 0)
                    .toLocaleString("en-NG", {
                      useGrouping: true,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReceiptItem;
