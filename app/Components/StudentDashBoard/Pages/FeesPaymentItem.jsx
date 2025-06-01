"use client";
import React, { useEffect, useRef, useState } from "react";
import Layout from "../../../Components/Studentlayout";
import { FaArrowRight } from "react-icons/fa";
import dummysession from "../../../Components/session";
import dummyterm from "../../../Components/Term";
import { LuArrowDownUp } from "react-icons/lu";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getUserDetails } from "../../../Service/AuthService";
import MakePaymentModal from "../MakePaymentModal";

const FeesPaymentItem = () => {
  const [term, setTerm] = useState("");
  const [session, setSession] = useState(dummysession[0]);
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMakePaymentModal, setShowMakePaymentModal] = useState(false);

  useEffect(() => {
    const userData = getUserDetails();
    setUser(userData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const fees = [
    {
      purpose: "Admission Acceptance Fee",
      TransactionNumber: "TD01",
      AmountBilled: 52000,
      AmountPaid: 52000,
      PaymentDate: "07/09/23",
    },
    {
      purpose: "School fees for 1st Term",
      TransactionNumber: "TD02",
      AmountBilled: 250000,
      AmountPaid: 0,
      PaymentDate: "Pending",
    },
    {
      purpose: "PTA dues",
      TransactionNumber: "TD03",
      AmountBilled: 2000,
      AmountPaid: 0,
      PaymentDate: "Pending",
    },
    {
      purpose: "Extracurricular Sports Mentorship",
      TransactionNumber: "TD04",
      AmountBilled: 20000,
      AmountPaid: 20000,
      PaymentDate: "07/09/23",
    },
    {
      purpose: "Payment Charge",
      TransactionNumber: "PC01",
      AmountBilled: 650,
      AmountPaid: 0,
      PaymentDate: "Pending",
    },
  ];

  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const totalAmountBilled = fees.reduce(
    (sum, fee) => sum + fee.AmountBilled,
    0
  );

  const totalAmountPaid = fees.reduce((sum, fee) => sum + fee.AmountPaid, 0);

  const totalAmountPending = totalAmountBilled - totalAmountPaid;

  return (
    <Layout>
      <div className="hidden lg:flex flex-col gap-5 p-4 xl:pt-10 xl:pr-8  bg-[#f0f0f0] rounded-lg min-h-screen">
        {/* First Card Section */}
        <div className="flex flex-col xl:gap-12 gap-8 md:flex-row md:justify-between bg-white rounded-xl p-6 pl-3 pr-3 xl:pl-14 xl:pr-14">
          <Link
            href={`/Student/Fees-Payment/Make-Payment?studentId=${studentId}`}
            className="bg-[#4084B1] text-white rounded-2xl flex-1"
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
                  <FaArrowRight className="text-[#4084B1] text-sm 2xl:text-lg" />
                </div>
              </div>
            </div>
          </Link>

          <Link
            href={`/Student/Fees-Payment/Receipt?studentId=${studentId}`}
            className="bg-red-500 text-white rounded-2xl flex-1"
          >
            <div className="grid grid-cols-[1fr_auto] items-center justify-between p-4 text-white">
              <div>
                <h4 className="text-xl font-bold mb-2">Receipt</h4>
                <p className="text-sm">view receipt</p>
              </div>
              <div className="max-w-[55px]">
                <img src="/Glyph.png" alt="" className="w-full object-cover" />
              </div>
            </div>
            <div className="bg-black/10 p-2 rounded-b-2xl">
              <div className="flex items-center gap-2 justify-center">
                <p className="text-sm text-white">More info</p>
                <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <FaArrowRight className="text-red-500 text-sm 2xl:text-lg" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Statement Section */}
        <div className="bg-white rounded-xl p-5 pt-3 pb-3">
          <h3 className="text-xl font-bold">Statement of Account</h3>
        </div>

        {/* Table Section */}
        <div className=" w-full bg-white rounded-xl  ">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 mb-8 p-5 pb-0">
            <div className="flex items-center gap-2">
              <label className="text-sm 2xl:text-md">Select Session :</label>
              <select
                className="bg-gray-100 rounded-lg p-1 text-sm outline-0"
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
              <label className="text-sm 2xl:text-md">Select Term :</label>
              <select
                className="bg-gray-100 rounded-lg p-1 outline-0 text-sm"
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
            <div>
              <button className="bg-[#0b71b5] text-white font-bold p-3 pl-5 pr-5 rounded-[10px] cursor-pointer">
                Print
              </button>
            </div>
          </div>

          <div className="w-[80%] md:w-full font-bold text-sm 2xl:text-md flex flex-wrap gap-4 mb-6 justify-center">
            <p>
              Name: {user?.student?.first_name + " " + user?.student?.last_name}
            </p>
            <p>Student ID: {user.id}</p>
            <p>Class: {user.class}</p>
            <p>Session: {session}</p>
          </div>

          <div className="overflow-x-auto pl-3 pr-3 p-2">
            <table className="w-full  table-fixed">
              <thead className="bg-red-500 text-white text-md xl:text-xl">
                <tr>
                  <th className="p-[3px] pl-2 w-1/12 text-left border-r border-gray-200 text-sm 2xl:text-lg md:text-[13.4px]">
                    S/N
                  </th>
                  <th className="p-[3px] pl-2 w-1 text-left border-r border-gray-200 text-sm 2xl:text-lg md:text-[13.4px]">
                    Purpose
                  </th>
                  <th className="p-[3px] pl-2 w-1 text-left border-r border-gray-200 text-sm 2xl:text-lg md:text-[13.4px]">
                    Transaction Number
                  </th>
                  <th className="p-[3px] pl-2 w-1 text-left border-r border-gray-200 text-sm 2xl:text-lg md:text-[13.4px]">
                    Amount Billed
                  </th>
                  <th className="p-[3px] pl-2 w-1 text-left border-r border-gray-200 text-sm 2xl:text-lg md:text-[13.4px]">
                    Amount Paid
                  </th>
                  <th className="p-[3px] pl-2 w-1 text-left text-sm 2xl:text-lg md:text-sm">
                    Payment Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {fees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-gray-500">
                      No fee records available.
                    </td>
                  </tr>
                ) : (
                  fees.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="p-2  border-r border-gray-200 text-sm 2xl:text-md">
                        {index + 1}
                      </td>
                      <td className="p-2  border-r border-gray-200 text-sm 2xl:text-md ">
                        {item.purpose}
                      </td>
                      <td className="p-2  border-r border-gray-200 text-sm 2xl:text-md ">
                        {item.TransactionNumber}
                      </td>
                      <td className="p-2  border-r border-gray-200 text-sm 2xl:text-md ">
                        {formatCurrency(item.AmountBilled)}
                      </td>
                      <td className="p-2  border-r border-gray-200 text-sm 2xl:text-md ">
                        {formatCurrency(item.AmountPaid)}
                      </td>
                      <td
                        className={`p-2   text-sm 2xl:text-md  ${
                          item.PaymentDate === "Pending"
                            ? "text-red-500"
                            : "text-gray-700"
                        }`}
                      >
                        <span className="flex  items-center gap-2">
                          {item.PaymentDate}
                          <LuArrowDownUp className="text-gray-400 cursor-pointer" />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap justify-between  mt-6 pl-5 pr-5 pb-3">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm 2xl:text-lg">Amount brought forward:</p>
              <span className="bg-gray-100 rounded-lg px-2 text-sm">Nil</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm 2xl:text-lg">Total Charges:</p>
              <span className="bg-gray-100 rounded-lg px-2 text-sm">
                {formatCurrency(totalAmountBilled)}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm 2xl:text-lg">Amount Paid:</p>
              <span className="bg-gray-100 rounded-lg px-2 text-sm">
                {formatCurrency(totalAmountPaid)}
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm 2xl:text-lg">Amount Pending:</p>
              <span className="bg-red-500 text-white rounded-lg px-2 text-sm">
                {formatCurrency(totalAmountPending)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="bg-[#FDFDFD] min-h-screen lg:hidden">
        <div className="p-4 flex flex-col gap-4">
          <div className="flex gap-4 text-white">
            <Link
              href={"#"}
              className="bg-[#004080] text-white rounded-xl flex-1 overflow-hidden"
              onClick={e => { e.preventDefault(); setShowMakePaymentModal(true); }}
            >
              <div className="p-2 flex">
                <div className="flex items-start">
                  <img
                    src="/Wallet.png"
                    alt=""
                    className="w-12 h-12 object-contain text-white"
                  />
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-bold mb-1">Make Payment</h4>
                <p className="text-sm ">payment made easy</p>
              </div>
            </Link>

            <Link
              href={`/Student/Fees-Payment/Receipt?studentId=${studentId}`}
              className="bg-[#F94144] text-white rounded-xl flex-1 overflow-hidden"
            >
              <div className=" p-2">
                <div className="flex items-start">
                  <img
                    src="/Glyph.png"
                    alt=""
                    className="w-12 h-12 object-contain text-white"
                  />
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-lg font-bold mb-1 text-white">Receipt</h4>
                <p className="text-sm text-white/80">view receipt</p>
              </div>
            </Link>
          </div>

          {/* Statement Section */}
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between mb-8">
              <label className="text-lg md:text-xl font-semibold">
                Statement of Account
              </label>
              <select
                className="bg-gray-100 rounded-lg p-1 text-sm outline-0"
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
            <div className="overflow-x-auto">
              <div className="flex flex-row justify-between gap-4 mb-3">
                <div className="flex flex-col mb-3">
                  <p className="text-xs text-gray-400"> 07/09/23</p>
                  <p className="text-md text-black font-semibold">
                    {" "}
                    Admission Acceptance Fee
                  </p>
                  <p className="text-sm text-gray-500"> TD01</p>
                </div>
                <div>
                  <p className="text-green-500 font-semibold text-sm">
                    52,000.00
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4 mb-3">
                <div className="flex flex-col mb-3">
                  <p className="text-md text-black font-semibold">
                    {" "}
                    Semester School Fee
                  </p>
                  <p className="text-sm text-gray-500"> TD02</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-500 font-semibold text-sm">
                    250,000.00
                  </p>
                  <p className="text-red-500 font-semibold text-sm">
                    152,345.00
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4 mb-3">
                <div className="flex flex-col mb-3">
                  <p className="text-xs text-gray-400"> 08/09/23</p>
                  <p className="text-md text-black font-semibold"> PTA Dues</p>
                  <p className="text-sm text-gray-500"> TD02</p>
                </div>
                <div>
                  <p className="text-green-500 font-semibold text-sm">
                    2,000.00
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4 mb-3">
                <div className="flex flex-col mb-3">
                  <p className="text-xs text-gray-400"> 07/09/23</p>
                  <p className="text-md text-black font-semibold">
                    {" "}
                    Admission Acceptance Fee
                  </p>
                  <p className="text-sm text-gray-500"> TD01</p>
                </div>
                <div>
                  <p className="text-green-500 font-semibold text-sm">
                    52,000.00
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4 mb-3">
                <div className="flex flex-col mb-3">
                  <p className="text-md text-black font-semibold">
                    {" "}
                    Semester School Fee
                  </p>
                  <p className="text-sm text-gray-500"> TD02</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-500 font-semibold text-sm">
                    250,000.00
                  </p>
                  <p className="text-red-500 font-semibold text-sm">
                    152,345.00
                  </p>
                </div>
              </div>
              <div className="flex flex-row justify-between gap-4 mb-3">
                <div className="flex flex-col mb-3">
                  <p className="text-xs text-gray-400"> 08/09/23</p>
                  <p className="text-md text-black font-semibold"> PTA Dues</p>
                  <p className="text-sm text-gray-500"> TD02</p>
                </div>
                <div>
                  <p className="text-green-500 font-semibold text-sm">
                    2,000.00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showMakePaymentModal && (
        <MakePaymentModal onClose={() => setShowMakePaymentModal(false)} />
      )}
    </Layout>
  );
};

export default FeesPaymentItem;
