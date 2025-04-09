"use client";
import React, { useState } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { IoIosNotificationsOutline, IoMdMore } from "react-icons/io";
import Image from "next/image";
import { FaPlus } from "react-icons/fa6";
import chatList from "../../chat";
import { RiMore2Fill } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";
import { IoVideocamOutline } from "react-icons/io5";
import { GoPaperclip } from "react-icons/go";
import { LuSendHorizontal } from "react-icons/lu";
const ChatItem = () => {
  const [selectedchat, setSelectedChat] = useState(null);

  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const updatedChat = { ...selectedchat };
    updatedChat.messages.push({
      sender: "School",
      text: newMessage,
      time: new Date().toLocaleTimeString(),
      date: new Date().toISOString(),
    });

    setSelectedChat(updatedChat);
    setNewMessage("");
  };
  const openChat = (msg) => {
    setSelectedChat(msg);
  };
  return (
    <SuperAdminLayout>
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />
        <div className="flex flex-row items-center">
          <div className="w-12 h-12 object-cover">
            <img
              src={"/superadmin.png"}
              alt="admin"
              className="w-full h-full"
            />
          </div>
          <div className="relative w-8 h-8 object-contain">
            <IoIosNotificationsOutline className="text-[#33363F] w-[100%] h-[100%] cursor-pointer" />
            <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#F94144]"></div>
          </div>
        </div>
      </div>
      <div className="bg-[#D4D4D4] h-screen  p-2  ">
        <div className=" h-screen  sm:gap-2 grid lg:grid-cols-[1.5fr_3fr] sm:grid-cols-[2fr_3fr]   gap-3  ">
          <div
            className="bg-[#ffffff] flex flex-col overflow-auto sm:resize-x sm:overflow-auto md:resize-x md:overflow-auto min-h-screen"
            style={{ minWidth: "150px", maxWidth: "400px" }}
          >
            <div>
              <p className="sm:text-xl p-3 pt-5 lg:text-2xl font-bold flex justify-between items-center">
                Chats
                <span className="text-[#333333] text-xl cursor-pointer bg-[#f2f2f2] flex justify-center p-2 rounded-xl">
                  <FaPlus />
                </span>
              </p>
              <hr className="text-[#C4C4C4] border-[1.2px]" />
            </div>
            <div className="p-3">
              <div className="mt-2 flex items-center rounded-4xl border-2 lg:min-w-[200px]  border-[#978F8F] ">
                <input
                  type="text"
                  placeholder="Search School"
                  className="w-full outline-none bg-transparent text-[#AEAEAE] text-sm p-2 pl-5"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 192.904 192.904"
                  width="16px"
                  className="fill-[#B09A9A] stroke-[#D9D9D9] mr-4"
                >
                  <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
                </svg>
              </div>
            </div>
            <div
              className="mt-2 overflow-auto no-scrollbar"
              style={{ maxHeight: "calc(100vh - 250px)" }}
            >
              <ul className="overflow-auto flex flex-col gap-3  ">
                {chatList.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className={`grid grid-cols-[auto_1fr_7px] gap-2 p-2  cursor-pointer 
                    ${selectedchat === item && "bg-[#DFEBF3]"}`}
                      onClick={() => openChat(item)}
                    >
                      <span className="w-12 h-12 object-cover">
                        <img
                          src={item.pic}
                          alt={item.pic}
                          className="w-full h-full"
                        />
                      </span>
                      <span className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <p className="font-bold sm:max-w-12 lg:max-w-30 truncate xl:text-base lg:text-sm sm:text-xs">
                            {item.Name}
                          </p>
                          <p className="text-[#808080] text-xs  truncate ">
                            {item.messages[item.messages.length - 1]?.time}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs max-w-18 truncate text-[#808080] ">
                            {item.messages[item.messages.length - 1].text}
                          </p>
                          {item.unread !== 0 && (
                            <p className="text-xs bg-[#07508F] text-white font-bold w-5 h-5 text-center rounded-full flex items-center justify-center leading-none">
                              {item.unread > 9 ? "9+" : item.unread}
                            </p>
                          )}
                        </div>
                      </span>
                      <p className="cursor-pointer">
                        <RiMore2Fill />
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          {selectedchat ? (
            <div className="bg-[#ffffff] grid grid-rows-[67px_0.79fr_auto] max-h-screen  ">
              <div className="bg-[#ffffff] pl-2 pr-5 sticky top-0 z-10 shadow-sm border-b border-b-[#C4C4C4] flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 object-cover relative">
                    <img
                      src={selectedchat.pic}
                      alt="admin"
                      className="w-full h-full "
                    />
                    {selectedchat.isActive && (
                      <div className="bg-[#15EF8A] rounded-full w-2.5 h-2.5 absolute top-9 right-0"></div>
                    )}
                  </div>
                  <div className="flex flex-col ">
                    <p className="font-bold text-md">{selectedchat.Name}</p>
                    {selectedchat.isActive && (
                      <p className="text-sm text-[#808080] font-bold">Active</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="w-10 h-10 p-2 object-contain  bg-[#ECECEC] rounded-full">
                    <FiPhoneCall className="w-full h-full" />
                  </p>
                  <p className="w-10 h-10 p-2 object-contain bg-[#ECECEC] rounded-full">
                    <IoVideocamOutline className="w-full h-full" />
                  </p>
                </div>
              </div>
              <div
                className="bg-[url(/chatbg.png)] overflow-auto no-scrollbar p-3  bg-white"
                style={{ maxHeight: "calc(100vh - 200px)" }}
              >
                {selectedchat.messages.map((msg, index) => {
                  const isSender = msg.sender === "School";
                  const showDate =
                    index === 0 ||
                    new Date(msg.date).toDateString() !==
                      new Date(
                        selectedchat.messages[index - 1].date
                      ).toDateString();
                  return (
                    <div key={index} className="flex flex-col">
                      {showDate && (
                        <div className="text-center text-xs text-gray-500 font-bold my-2">
                          {new Date(msg.date).toDateString()}
                        </div>
                      )}
                      <div
                        className={`flex ${
                          isSender ? "justify-end " : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-2 mb-2  max-w-[50%] ${
                            isSender
                              ? "bg-[#0A4A81] text-white rounded-t-lg rounded-bl-lg"
                              : "bg-gray-200 text-black rounded-t-lg rounded-br-lg"
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-[#ffffff]">
                <div className=" pl-5 pr-5 text-sm flex items-center">
                  <GoPaperclip className="mr-2 w-5 h-5 cursor-pointer" />
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="focus:outline-none h-full w-full"
                  />
                  <LuSendHorizontal
                    onClick={handleSendMessage}
                    className="ml-2 w-5 h-5 text-[#01427A] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#ffffff] flex justify-center max-h-screen items-center  ">
              <p className="text-[#808080]">Select a chat to view messages.</p>
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default ChatItem;
