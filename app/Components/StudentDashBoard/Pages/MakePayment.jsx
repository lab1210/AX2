"use client";
import React, { useState } from "react";
import Layout from "../../Studentlayout";
import { FaRegCreditCard } from "react-icons/fa6";
import { FaRegFileAlt } from "react-icons/fa";
import dummysession from "../../session";
import { useUser } from "../context/UserProvider";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const MakePaymentItem = () => {
  const [card, setCard] = useState(false);
  const [bankPin, setBankpin] = useState(false);
  const [details, setDetails] = useState(false);
  const [payment, setPayment] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardOwner, setCardOwner] = useState("");
  const [cardExpiryMonth, setCardExpiryMonth] = useState("");
  const [cardExpiryYear, setCardExpiryYear] = useState("");
  const [session, setSession] = useState(dummysession[0]);
  const [cardCvv, setCardCvv] = useState("");
  const [remember, setRemember] = useState(false);
  const { user, isLoading } = useUser();

  const searchParams = useSearchParams();
  const schoolId = searchParams.get("schoolid");
  const userId = searchParams.get("userid");
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-full h-full z-50">
        <div className="border-4 border-[rgba(0,64,128,1)] border-t-4 border-t-[rgba(249,65,68,1)] rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 - ");
    setCardNumber(formatted);
  };

  const checkFields = () => {
    if (
      cardNumber.length === 25 &&
      cardOwner.trim() !== "" &&
      cardExpiryMonth.trim() !== "" &&
      cardExpiryYear.trim() !== "" &&
      cardCvv.trim() !== ""
    ) {
      setDetails(true);
    } else {
      setDetails(false);
    }
  };

  const handleConfirm = () => {
    setConfirm(true);
    router.push(`/Student/Fees-Payment/Receipt`);
  };

  const filteredFees = user.fees.filter(
    (item) => item.AmountBilled !== item.AmountPaid
  );
  const adjustedFees = filteredFees.map((item) => {
    if (item.AmountBilled > item.AmountPaid) {
      return {
        ...item,
        AmountBilled: item.AmountBilled - item.AmountPaid,
      };
    }
    return item;
  });

  return (
    <Layout>
      <div
        className={`
          grid
          md:[grid-template-rows:110px_100px_1fr_1fr]
          xl:[grid-template-rows:110px_100px_1fr] bg-[#f0f0f0]
        `}
      >
        {/* Payment Steps */}
        <div
          className={`
            grid grid-cols-[110px_110px_110px_110px] rounded-[10px] mb-[30px] bg-white
            md:py-[15px] md:px-[60px]
          `}
        >
          {/* Step 1: Choose payment method */}
          <div className="flex flex-col items-center gap-[5px]">
            <div className="flex items-center gap-[3px]">
              <span
                className={`
                  w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px]
                  ${card || bankPin ? "text-white bg-[#1bb66e] border-2 border-[#1bb66e]" : "border-2 border-[#c9c9c9] text-[#c9c9c9]"}
                `}
              >
                &#10004;
              </span>
              <div
                className={`
                  border-t-2 min-w-[80px]
                  ${card || bankPin ? "border-black" : "border-[#c9c9c9]"}
                `}
              ></div>
            </div>
            <div className="text-center mr-[80px] min-w-[50px]">
              <p>Choose payment method</p>
            </div>
          </div>
          {/* Step 2: Fill details */}
          <div className="flex flex-col items-center gap-[5px]">
            <div className="flex items-center gap-[3px]">
              <span
                className={`
                  w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px]
                  ${details ? "text-white bg-[#1bb66e] border-2 border-[#1bb66e]" : "border-2 border-[#c9c9c9] text-[#c9c9c9]"}
                `}
              >
                &#10004;
              </span>
              <div
                className={`
                  border-t-2 min-w-[80px]
                  ${details ? "border-black" : "border-[#c9c9c9]"}
                `}
              ></div>
            </div>
            <div className="text-center mr-[80px] min-w-[100px]">
              <p>Fill details</p>
            </div>
          </div>
          {/* Step 3: Make Payment */}
          <div className="flex flex-col items-center gap-[5px]">
            <div className="flex items-center gap-[3px]">
              <span
                className={`
                  w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px]
                  ${payment ? "text-white bg-[#1bb66e] border-2 border-[#1bb66e]" : "border-2 border-[#c9c9c9] text-[#c9c9c9]"}
                `}
              >
                &#10004;
              </span>
              <div
                className={`
                  border-t-2 min-w-[80px]
                  ${payment ? "border-black" : "border-[#c9c9c9]"}
                `}
              ></div>
            </div>
            <div className="text-center mr-[80px] min-w-[100px]">
              <p>Make Payment</p>
            </div>
          </div>
          {/* Step 4: Confirm */}
          <div className="flex flex-col gap-[3px] mr-[68px]">
            <span
              className={`
                w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px]
                ${confirm ? "text-white bg-[#1bb66e] border-2 border-[#1bb66e]" : "border-2 border-[#c9c9c9] text-[#c9c9c9]"}
              `}
            >
              &#10004;
            </span>
            <p>Confirm</p>
          </div>
        </div>
        {/* Payment Options Header */}
        <div className="rounded-[10px] mb-[20px] flex items-center px-[30px] bg-white">
          <h2>Payment Options</h2>
        </div>
        {/* Payment Options / Details Container */}
        <div
          className={`
            ${card || bankPin ? "block" : "hidden"}
            md:hidden
          `}
        >
          {/* For smaller screens, you might hide the payment details */}
        </div>
        <div
          className={`
            ${card || bankPin ? "grid" : "hidden"}
            mb-[20px]
            xl:grid xl:grid-cols-[3fr_auto] xl:gap-[10px]
          `}
        >
          <div className="flex flex-col bg-white p-[10px]">
            <div className="flex flex-col bg-white pt-[10px] px-[8px] rounded-[10px]">
              {/* Credit/Debit Card Option */}
              <div
                className="border rounded-[5px] border-[#cfcfcf] p-[15px] mb-[15px] shadow cursor-pointer"
                onClick={() => {
                  bankPin
                    ? (setBankpin(false), setCard((prev) => !prev))
                    : setCard((prev) => !prev);
                }}
              >
                <div className="flex justify-between mb-[10px]">
                  <div className="flex items-center gap-[10px]">
                    <span
                      className={`
                        w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px]
                        ${card ? "text-white bg-[#1bb66e] border-2 border-[#1bb66e]" : "border-2 border-[#c9c9c9] text-[#c9c9c9]"}
                      `}
                      onClick={() => {
                        bankPin
                          ? (setBankpin(false), setCard((prev) => !prev))
                          : setCard((prev) => !prev);
                      }}
                    >
                      &#10004;
                    </span>
                    <h3>Credit/Debit Card</h3>
                  </div>
                  <div className="max-w-[60px]">
                    <img src="/CardLogo.png" alt="" className="w-full object-cover" />
                  </div>
                </div>
                {card && (
                  <div className="grid grid-rows-[1fr_1fr_1fr] gap-[20px]">
                    {/* Card Number Input */}
                    <div className="grid grid-cols-[4fr_1fr_1fr] items-center">
                      <div
                        className={`
                          flex flex-col text-[12px]
                          ${cardNumber.length > 0 && cardNumber.length < 25 ? "text-[#dd1b10]" : "text-gray-700"}
                        `}
                      >
                        <label className="font-bold" htmlFor="cardNumber">
                          Card number
                        </label>
                        <p className="text-[#5e5e5e]">Enter the 16-digit card number on the card</p>
                      </div>
                      <div className="relative">
                        <span className="absolute left-[10px] top-1/2 -translate-y-1/2">
                          <FaRegCreditCard size={40} />
                        </span>
                        <input
                          type="text"
                          name="cardNumber"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            formatCardNumber(e.target.value);
                            checkFields();
                          }}
                          value={cardNumber}
                          maxLength="25"
                          className="bg-[#d9d9d9] border border-[#d9d9d9] py-[10px] px-[16px] min-w-[200px] outline-none font-medium text-[12px] rounded-[5px] pl-[35px]"
                          style={
                            cardNumber.length > 0 && cardNumber.length < 25
                              ? { border: "2px solid red" }
                              : {}
                          }
                        />
                      </div>
                      <div>
                        {cardNumber.length === 25 ? (
                          <span className="w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px] text-white bg-[#1bb66e] border-2 border-[#1bb66e]">
                            &#10004;
                          </span>
                        ) : cardNumber.length > 0 && cardNumber.length < 25 ? (
                          <span className="w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px] border-2 border-[#dd1b10] text-white bg-[#dd1b10] font-bold">
                            &#x2715;
                          </span>
                        ) : (
                          <span className="w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px] border-2 border-[#c9c9c9] text-[#c9c9c9]">
                            &#10004;
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Card Owner Input */}
                    <div className="grid grid-cols-[4fr_1fr_1fr] items-center">
                      <div className="flex flex-col text-[12px]">
                        <label className="font-bold" htmlFor="cardOwner">
                          Card Owner
                        </label>
                        <p className="text-[#5e5e5e]">Enter the name on the card</p>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardOwner"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            setCardOwner(e.target.value);
                            checkFields();
                          }}
                          value={cardOwner}
                          className="bg-[#d9d9d9] border border-[#d9d9d9] py-[10px] px-[16px] min-w-[200px] outline-none font-medium text-[12px] rounded-[5px]"
                        />
                      </div>
                      <div></div>
                    </div>
                    {/* Expiry and CVV Inputs */}
                    <div className="grid grid-cols-[4fr_1fr_1fr] items-center">
                      <div className="flex flex-col text-[12px]">
                        <label className="font-bold" htmlFor="cardExpiryMonth">
                          Expiry Date
                        </label>
                        <p className="text-[#5e5e5e]">Enter the expiration date of the card</p>
                      </div>
                      <div className="flex min-w-[200px]">
                        <div className="flex items-center gap-[5px] mr-[10px]">
                          <input
                            type="text"
                            name="cardExpiryMonth"
                            onClick={(e) => e.stopPropagation()} 
                            onChange={(e) => {
                              setCardExpiryMonth(e.target.value);
                              checkFields();
                            }}
                            value={cardExpiryMonth}
                            className="bg-[#d9d9d9] border border-[#d9d9d9] py-[10px] px-[16px] min-w-[200px] outline-none font-medium text-[12px] rounded-[5px]"
                          />
                          <h3>/</h3>
                          <input
                            type="text"
                            name="cardExpiryYear"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              setCardExpiryYear(e.target.value);
                              checkFields();
                            }}
                            value={cardExpiryYear}
                            placeholder="23"
                            className="bg-[#d9d9d9] border border-[#d9d9d9] py-[10px] px-[16px] min-w-[50px] outline-none font-medium text-[12px] rounded-[5px]"
                          />
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <div className="flex flex-col text-[12px]">
                            <label className="font-bold" htmlFor="cardCvv">
                              CVV Number
                            </label>
                            <p className="text-[#5e5e5e]">Security code</p>
                          </div>
                          <input
                            type="text"
                            name="cardCvv"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              setCardCvv(e.target.value);
                              checkFields();
                            }}
                            value={cardCvv}
                            placeholder="012"
                            className="bg-[#d9d9d9] border border-[#d9d9d9] py-[10px] px-[16px] min-w-[200px] outline-none font-medium text-[12px] rounded-[5px]"
                          />
                        </div>
                      </div>
                      <div></div>
                    </div>
                    {/* Remember Card Checkbox */}
                    <div className="flex items-center gap-[10px] justify-end">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={remember}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="appearance-none bg-[#fafafa] border-2 border-[#d9d9d9] rounded-[5px] w-[24px] h-[24px] cursor-pointer relative p-[4px] box-border outline-none checked:bg-[#fafafa] checked:border-[#1ed760]"
                      />
                      <label
                        htmlFor="remember"
                        className={`${remember ? "text-[#1ed760] font-bold text-[14px]" : "text-[14px] font-bold"}`}
                      >
                        Remember this card
                      </label>
                    </div>
                  </div>
                )}
              </div>
              {/* Bank Pin Option */}
              <div
                className="border rounded-[5px] border-[#cfcfcf] p-[15px] mb-[15px] shadow cursor-pointer"
                onClick={() => {
                  card
                    ? (setCard(false), setBankpin((prev) => !prev))
                    : setBankpin((prev) => !prev);
                }}
              >
                <div className="flex justify-between mb-[10px]">
                  <div className="flex items-center gap-[10px]">
                    <span
                      className={`
                        w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px]
                        ${bankPin ? "text-white bg-[#1bb66e] border-2 border-[#1bb66e]" : "border-2 border-[#c9c9c9] text-[#c9c9c9]"}
                      `}
                      onClick={() => {
                        card
                          ? (setCard(false), setBankpin((prev) => !prev))
                          : setBankpin((prev) => !prev);
                      }}
                    >
                      &#10004;
                    </span>
                    <h3>Bank Pin</h3>
                  </div>
                  <div className="max-w-[60px]">
                    <img src="/CardLogo.png" alt="" className="w-full object-cover" />
                  </div>
                </div>
                {bankPin && (
                  <div className="grid grid-rows-[1fr_1fr_1fr] gap-[20px]">
                    {/* Bank Pin fields replicate the Credit/Debit card fields */}
                    <div className="grid grid-cols-[4fr_1fr_1fr] items-center">
                      <div
                        className={`
                          flex flex-col text-[12px]
                          ${cardNumber.length > 0 && cardNumber.length < 25 ? "text-[#dd1b10]" : "text-gray-700"}
                        `}
                      >
                        <label className="font-bold" htmlFor="cardNumber">
                          Card number
                        </label>
                        <p className="text-[#5e5e5e]">Enter the 16-digit card number on the card</p>
                      </div>
                      <div className="relative">
                        <span className="absolute left-[10px] top-1/2 -translate-y-1/2">
                          <FaRegCreditCard size={40} />
                        </span>
                        <input
                          type="text"
                          name="cardNumber"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            formatCardNumber(e.target.value);
                            checkFields();
                          }}
                          value={cardNumber}
                          maxLength="25"
                          className="bg-[#d9d9d9] border border-[#d9d9d9] py-[10px] px-[16px] min-w-[200px] outline-none font-medium text-[12px] rounded-[5px] pl-[35px]"
                          style={
                            cardNumber.length > 0 && cardNumber.length < 25
                              ? { border: "2px solid red" }
                              : {}
                          }
                        />
                      </div>
                      <div>
                        {cardNumber.length === 25 ? (
                          <span className="w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px] text-white bg-[#1bb66e] border-2 border-[#1bb66e]">
                            &#10004;
                          </span>
                        ) : cardNumber.length > 0 && cardNumber.length < 25 ? (
                          <span className="w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px] border-2 border-[#dd1b10] text-white bg-[#dd1b10] font-bold">
                            &#x2715;
                          </span>
                        ) : (
                          <span className="w-[22px] h-[22px] rounded-full flex justify-center items-center p-[5px] text-[10px] ml-[2px] border-2 border-[#c9c9c9] text-[#c9c9c9]">
                            &#10004;
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-[4fr_1fr_1fr] items-center">
                      <div className="flex flex-col text-[12px]">
                        <label className="font-bold" htmlFor="cardOwner">
                          Card Owner
                        </label>
                        <p className="text-[#5e5e5e]">Enter the name on the card</p>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardOwner"
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            setCardOwner(e.target.value);
                            checkFields();
                          }}
                          value={cardOwner}
                          className="bg-[#d9d9d9] border border-[#d9d9d9] py-[10px] px-[16px] min-w-[200px] outline-none font-medium text-[12px] rounded-[5px]"
                        />
                      </div>
                      <div></div>
                    </div>
                    <div className="grid grid-cols-[4fr_1fr_1fr] items-center">
                      <div className="flex flex-col text-[12px]">
                        <label className="font-bold" htmlFor="cardExpiryMonth">
                          Expiry Date
                        </label>
                        <p className="text-[#5e5e5e]">Enter the expiration date of the card</p>
                      </div>
                      <div className="flex min-w-[200px]">
                        <div className="flex items-center gap-[5px] mr-[10px]">
                          <input
                            type="text"
                            name="cardExpiryMonth"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              setCardExpiryMonth(e.target.value);
                              checkFields();
                            }}
                            value={cardExpiryMonth}
                            className="bg-[#d9d9d9] border border-[#d9d9d9] py-[10px] px-[16px] min-w-[200px] outline-none font-medium text-[12px] rounded-[5px]"
                          />
                          <h3>/</h3>
                          <input
                            type="text"
                            name="cardExpiryYear"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              setCardExpiryYear(e.target.value);
                              checkFields();
                            }}
                            value={cardExpiryYear}
                            placeholder="23"
                            className="bg-[#d9d9d9] border border-[#d9d9d9] py-[10px] px-[16px] min-w-[50px] outline-none font-medium text-[12px] rounded-[5px]"
                          />
                        </div>
                        <div className="flex items-center gap-[10px]">
                          <div className="flex flex-col text-[12px]">
                            <label className="font-bold" htmlFor="cardCvv">
                              CVV Number
                            </label>
                            <p className="text-[#5e5e5e]">Security code</p>
                          </div>
                          <input
                            type="text"
                            name="cardCvv"
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              setCardCvv(e.target.value);
                              checkFields();
                            }}
                            value={cardCvv}
                            placeholder="012"
                            className="bg-[#d9d9d9] border border-[#d9d9d9] py-[10px] px-[16px] min-w-[200px] outline-none font-medium text-[12px] rounded-[5px]"
                          />
                        </div>
                      </div>
                      <div></div>
                    </div>
                    <div className="flex items-center gap-[10px] justify-end">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={remember}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="appearance-none bg-[#fafafa] border-2 border-[#d9d9d9] rounded-[5px] w-[24px] h-[24px] cursor-pointer relative p-[4px] box-border outline-none checked:bg-[#fafafa] checked:border-[#1ed760]"
                      />
                      <label
                        htmlFor="remember"
                        className={`${remember ? "text-[#1ed760] font-bold text-[14px]" : "text-[14px] font-bold"}`}
                      >
                        Remember this card
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Payment Details Section (visible on xl and above) */}
          <div className="hidden md:block xl:flex xl:flex-col xl:items-center xl:justify-center bg-white rounded-[15px] xl:p-[15px]">
            <div className="flex gap-[10px] mb-[10px]">
              <FaRegFileAlt size={20} />
              <h3>Payment Details</h3>
            </div>
            <div className="mb-[15px]">
              <select
                name="session"
                value={session}
                onChange={(e) => setSession(e.target.value)}
                required
                className="bg-[#cfcfcf66] border-0 rounded-[10px] text-[14px] outline-none"
              >
                {dummysession.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="border-t-2 border-b-2 border-[#cfcfcf66] pt-[15px]">
              {adjustedFees.map((item, index) => (
                <div
                  key={index}
                  className="grid mb-[5px] text-[12px] font-bold gap-[10px] [grid-template-columns:1fr_auto]"
                >
                  <p>{item.purpose}</p>
                  <p>
                    {item.AmountBilled.toLocaleString("en-NG", {
                      useGrouping: true,
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              ))}
            </div>
            <div className="grid py-[10px] border-b-[2px] border-[#cfcfcf66] items-center [grid-template-columns:150px_auto]">
              <p>Total</p>
              <p className="text-[15px]">
                {adjustedFees
                  .reduce((acc, item) => acc + item.AmountBilled, 0)
                  .toLocaleString("en-NG", {
                    useGrouping: true,
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
            </div>
            <div className="flex justify-center p-[20px]">
              <button
                onClick={handleConfirm}
                className="bg-[#004080] border-0 text-white text-[12px] font-bold py-[5px] px-[15px] rounded-[5px] cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MakePaymentItem;
