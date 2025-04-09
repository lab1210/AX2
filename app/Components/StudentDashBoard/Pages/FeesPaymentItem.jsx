"use client";
import React, { useEffect, useState } from "react";
import Layout from "../../Studentlayout";
import { useUser } from "../context/UserProvider";
import { FaArrowRight } from "react-icons/fa";
import dummysession from "../../../Components/session";
import dummyterm from "../../../Components/Term";
import { LuArrowDownUp } from "react-icons/lu";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const FeesPaymentItem = () => {
  const { user, isLoading } = useUser();
  const [term, setTerm] = useState("");
  const [session, setSession] = useState(dummysession[0]);
  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolid");
  const userId = searchParams.get("userid");

  const [downloadPdf, setDownloadPdf] = useState(null);

  useEffect(() => {
    import("../../Print/DownloadasPdf").then((module) => {
      setDownloadPdf(() => module.default);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    if (downloadPdf) {
      downloadPdf(
        ".thirdCard",
        `${user.username}-Statement-of-Account-${session}-${term}.pdf`
      );
    } else {
      console.error("downloadPdf not loaded yet.");
    }
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalAmountBilled = user.fees.reduce(
    (sum, fee) => sum + fee.AmountBilled,
    0
  );

  const totalAmountPaid = user.fees.reduce(
    (sum, fee) => sum + fee.AmountPaid,
    0
  );

  const totalAmountPending = totalAmountBilled - totalAmountPaid;

  return (
    <Layout>
      <div className="flex flex-col gap-5 p-4 bg-[#f0f0f0] min-h-screen">
        {/* First Card Section */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between bg-white rounded-xl p-4">
          <Link
            href={`/Student/Fees-Payment/Make-Payment?schoolid=${schoolId}&userid=${userId}`}
            className="bg-blue-800 text-white rounded-2xl flex-1"
          >
            <div className="grid grid-cols-[1fr_auto] items-center justify-between p-4 text-white">
              <div>
                <h4 className="text-xl font-bold mb-2">Make Payment</h4>
                <p className="text-sm">payment made easy</p>
              </div>
              <div className="max-w-[50px]">
                <img src="/Wallet.png" alt="" className="w-full object-cover" />
              </div>
            </div>
            <div className="bg-black/10 p-2 rounded-b-2xl">
              <div className="flex items-center gap-2 justify-center">
                <p className="text-sm text-white">More info</p>
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <FaArrowRight className="text-blue-600 text-xs" />
                </div>
              </div>
            </div>
          </Link>

          <Link
            href={`/Student/Fees-Payment/Receipt?schoolid=${schoolId}&userid=${userId}`}
            className="bg-red-500 text-white rounded-2xl flex-1"
          >
            <div className="grid grid-cols-[1fr_auto] items-center justify-between p-4 text-white">
              <div>
                <h4 className="text-xl font-bold mb-2">Receipt</h4>
                <p className="text-sm">view receipt</p>
              </div>
              <div className="max-w-[50px]">
                <img src="/Glyph.png" alt="" className="w-full object-cover" />
              </div>
            </div>
            <div className="bg-black/10 p-2 rounded-b-2xl">
              <div className="flex items-center gap-2 justify-center">
                <p className="text-sm text-white">More info</p>
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <FaArrowRight className="text-red-500 text-xs" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Statement Section */}
        <div className="bg-white rounded-xl p-5">
          <h3 className="text-xl font-bold">Statement of Account</h3>
        </div>

        {/* Table Section */}
        <div className="w-full bg-white rounded-xl p-5 thirdCard">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 mb-8">
            <div className="flex items-center gap-2">
              <label className="text-sm">Select Session :</label>
              <select
                className="bg-gray-100 rounded-lg px-2 py-1 text-sm"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              >
                {dummysession.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm">Select Term :</label>
              <select
                className="bg-gray-100 rounded-lg px-2 py-1 text-sm"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                {dummyterm.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="bg-blue-700 text-white rounded-lg px-4 py-2 text-sm hover:bg-red-500 transition-colors duration-300"
            >
              Print
            </button>
          </div>

          <div className="w-[80%] md:w-full flex flex-wrap gap-4 mb-6 justify-between">
            <p className="text-sm">Name: {user.username}</p>
            <p className="text-sm">Student ID: {user.userId}</p>
            <p className="text-sm">Class: {user.class}</p>
            <p className="text-sm">Session: {session}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-red-500 text-white">
                <tr>
                  <th className="p-2 md:p-3 text-left border-r border-gray-200 text-xs md:text-sm">
                    S/N
                  </th>
                  <th className="p-2 md:p-3 text-left border-r border-gray-200 text-xs md:text-sm">
                    Purpose
                  </th>
                  <th className="p-2 md:p-3 text-left border-r border-gray-200 text-xs md:text-sm">
                    Transaction Number
                  </th>
                  <th className="p-2 md:p-3 text-left border-r border-gray-200 text-xs md:text-sm">
                    Amount Billed
                  </th>
                  <th className="p-2 md:p-3 text-left border-r border-gray-200 text-xs md:text-sm">
                    Amount Paid
                  </th>
                  <th className="p-2 md:p-3 text-left text-xs md:text-sm">
                    Payment Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {user.fees.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-2 md:p-3 border-r border-gray-200 text-xs md:text-sm">
                      {index + 1}
                    </td>
                    <td className="p-2 md:p-3 border-r border-gray-200 text-xs md:text-sm">
                      {item.purpose}
                    </td>
                    <td className="p-2 md:p-3 border-r border-gray-200 text-xs md:text-sm">
                      {item.TransactionNumber}
                    </td>
                    <td className="p-2 md:p-3 border-r border-gray-200 text-xs md:text-sm">
                      {formatCurrency(item.AmountBilled)}
                    </td>
                    <td className="p-2 md:p-3 border-r border-gray-200 text-xs md:text-sm">
                      {formatCurrency(item.AmountPaid)}
                    </td>
                    <td
                      className={`p-2 md:p-3 flex items-center gap-2 text-xs md:text-sm ${
                        item.PaymentDate === "Pending"
                          ? "text-red-500"
                          : "text-gray-700"
                      }`}
                    >
                      {item.PaymentDate}
                      <LuArrowDownUp className="text-gray-400 cursor-pointer text-xs md:text-sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-between gap-4 mt-6">
            <div className="flex items-center gap-2">
              <p className="text-sm">Amount brought forward:</p>
              <span className="bg-gray-100 rounded px-2 text-sm">Nil</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">Total Charges:</p>
              <span className="bg-gray-100 rounded px-2 text-sm">
                {formatCurrency(totalAmountBilled)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">Amount Paid:</p>
              <span className="bg-gray-100 rounded px-2 text-sm">
                {formatCurrency(totalAmountPaid)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm">Amount Pending:</p>
              <span className="bg-red-500 text-white rounded px-2 text-sm">
                {formatCurrency(totalAmountPending)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FeesPaymentItem;
