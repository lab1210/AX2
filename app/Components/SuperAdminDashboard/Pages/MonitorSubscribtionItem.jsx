"use client";
import React, { useState, useCallback, useEffect } from "react";
import SuperAdminLayout from "../SuperAdminLayout";
import DashboardHeader from "../DashboardHeader";
import { RiEqualizerLine } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import subscriptionService from "@/Service/SubscribtionService";
import toast from "react-hot-toast";

const itemsPerPage = 7;

const MonitorSubscribtionItem = () => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // State for the edit modal
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAmountPerStudent, setEditAmountPerStudent] = useState("");
  const [editAmountPaid, setEditAmountPaid] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateApiError, setUpdateApiError] = useState(null);

  // State for activate/deactivate toggle
  const [togglingSubscription, setTogglingSubscription] = useState(null);

  // Function to format currency
  const formatCurrency = (amount) => {
    if (typeof amount === "number") {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);
    }
    return "N/A";
  };

  // Function to fetch all subscriptions
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const response = await subscriptionService.getAllSubscriptions();
      console.log("Subscriptions response:", response);
      
      if (response.success) {
        setSubscriptions(response.data || []);
      } else {
        setApiError(response.message || "Failed to fetch subscriptions.");
        toast.error(response.message || "Failed to fetch subscriptions.");
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      setApiError("An error occurred while fetching subscriptions.");
      toast.error("An error occurred while fetching subscriptions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Function to open the edit modal
  const openModal = (subscription) => {
    setSelectedSubscription(subscription);
    setEditAmountPerStudent(String(subscription.amountPerStudent || ""));
    setEditAmountPaid(String(subscription.amountPaid || ""));
    setIsModalOpen(true);
  };

  // Function to close the edit modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubscription(null);
    setUpdateApiError(null);
  };

  // Function to handle saving the edited subscription data
  const handleSaveSubscription = async () => {
    if (!selectedSubscription?.subscriptionId) {
      console.error("No subscription ID found for the selected subscription.");
      toast.error("No subscription ID found.");
      return;
    }

    setUpdateLoading(true);
    setUpdateApiError(null);

    const updatedSubscriptionData = {
      amountPerStudent: parseFloat(editAmountPerStudent),
      amountPaid: parseFloat(editAmountPaid),
    };

    try {
      const response = await subscriptionService.patchSubscriptionAmount(
        selectedSubscription.subscriptionId,
        updatedSubscriptionData
      );

      if (response.success) {
        console.log("Subscription updated successfully:", response.data);
        toast.success(response.message || "Subscription updated successfully!");
        closeModal();
        fetchSubscriptions();
      } else {
        setUpdateApiError(response.message || "Failed to update subscription.");
        toast.error(response.message || "Failed to update subscription.");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      setUpdateApiError("An error occurred while updating the subscription.");
      toast.error("An error occurred while updating the subscription.");
    } finally {
      setUpdateLoading(false);
    }
  };

  // Function to handle activate/deactivate subscription
  const handleToggleStatus = async (subscription) => {
    setTogglingSubscription(subscription.subscriptionId);
    try {
      let response;
      if (subscription.liveIsActive) {
        response = await subscriptionService.deactivateSubscription(subscription.subscriptionId);
      } else {
        response = await subscriptionService.activateSubscription(subscription.subscriptionId);
      }

      if (response.success) {
        toast.success(response.message || `Subscription ${subscription.liveIsActive ? "deactivated" : "activated"} successfully!`);
        fetchSubscriptions();
      } else {
        toast.error(response.message || `Failed to ${subscription.liveIsActive ? "deactivate" : "activate"} subscription.`);
      }
    } catch (error) {
      console.error("Error toggling subscription status:", error);
      toast.error("An error occurred while updating subscription status.");
    } finally {
      setTogglingSubscription(null);
    }
  };

  // Filter subscriptions based on search query
  const filteredSubscriptions = subscriptions.filter((sub) =>
    sub.schoolName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (apiError) {
    return (
      <SuperAdminLayout>
        <div className="bg-[#ffffff] pl-4 pt-4 pb-3 pr-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
          <DashboardHeader />
        </div>
        <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
          <div className="text-center bg-red-200 border border-red-500 text-red-700 px-4 py-2 rounded-md">
            {apiError}
          </div>
        </div>
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      {isModalOpen && selectedSubscription && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/65"
            onClick={closeModal}
          ></div>
          <div className="relative bg-white rounded-md shadow-lg z-50 transition-transform min-w-110 duration-600 ease-in-out">
            <div className="flex justify-end pt-5 pr-5">
              <span onClick={closeModal} className="cursor-pointer">
                <IoClose size={20} />
              </span>
            </div>
            <div className="text-center font-bold text-gray-400">
              <p>SUBSCRIPTION PLAN</p>
            </div>
            <form className="flex flex-col mt-5 pl-10 pr-10 gap-2">
              <div className="flex justify-between font-semibold text-[#AEAEAE]">
                <p>Amount Per Student:</p>
                <input
                  type="number"
                  className="text-sm text-center pl-2 max-w-36 pr-2 focus:outline-none border-[2px] border-[#d4d4d4]"
                  value={editAmountPerStudent}
                  onChange={(e) => setEditAmountPerStudent(e.target.value)}
                />
              </div>
              <div className="flex justify-between font-semibold">
                <p className="text-[#01427A]">Amount Paid:</p>
                <input
                  type="number"
                  className="text-[#AEAEAE] max-w-36 text-sm text-center pl-2 pr-2 focus:outline-none border-[2px] border-[#d4d4d4]"
                  value={editAmountPaid}
                  onChange={(e) => setEditAmountPaid(e.target.value)}
                />
              </div>
              {updateApiError && (
                <p className="text-red-500 text-sm">{updateApiError}</p>
              )}
              <div className="pb-10 pt-5">
                <button
                  type="button"
                  onClick={handleSaveSubscription}
                  disabled={updateLoading}
                  className={`text-white rounded-md pt-1 cursor-pointer pb-1 w-full ${
                    updateLoading ? "bg-gray-400" : "bg-[#4084B1]"
                  }`}
                >
                  {updateLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="bg-[#ffffff] pl-4 pt-4 pb-3 sm:pr-4 lg:pr-9 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <DashboardHeader />

        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-4xl border lg:min-w-[350px] border-[#D0D0D0]">
            <input
              type="text"
              placeholder="Search School"
              className="w-full outline-none bg-transparent text-[#AEAEAE] text-sm p-2 pl-5"
              value={searchQuery}
              onChange={handleSearch}
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
          <div>
            <RiEqualizerLine size={20} />
          </div>
        </div>
      </div>
      <div className="bg-[#D4D4D4] overflow-auto flex-1 p-4">
        <div className="bg-[#ffffff] rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-[#E6EFF5] lg:text-sm sm:text-xs">
              <tr className="border-b-[#D0D0D0] border-b">
                <th className="pt-3 pb-3 px-5 pl-10 text-left font-bold text-[#333333]">
                  School Name
                </th>
                <th className="pt-3 pb-3 px-5 text-center font-bold text-[#333333]">
                  No of Students
                </th>
                <th className="pt-3 pb-3 px-5 text-center font-bold text-[#333333]">
                  Amount per Student
                </th>
                <th className="pt-3 pb-3 px-5 text-center font-bold text-[#333333]">
                  Amount Expected
                </th>
                <th className="pt-3 pb-3 px-5 text-center font-bold text-[#333333]">
                  Amount Paid
                </th>
                <th className="pt-3 pb-3 px-5 text-center font-bold text-[#333333]">
                  Start Date
                </th>
                <th className="pt-3 pb-3 px-5 text-center font-bold text-[#333333]">
                  Expiring Date
                </th>
                <th className="pt-3 pb-3 px-5 text-center font-bold text-[#333333]">
                  Status
                </th>
                <th className="pt-3 pb-3 px-5 text-center pr-10 font-bold text-[#333333]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr
                  key={item.subscriptionId}
                  className="border-b-[#D0D0D0] border-b font-semibold text-xs"
                >
                  <td className="pt-3 pb-3 px-5 pl-10 text-left text-[#333333]">
                    {item.schoolName}
                  </td>
                  <td className="pt-3 pb-3 px-5 text-center text-[#333333]">
                    {item.liveNumberStudents}
                  </td>
                  <td className="pt-3 pb-3 px-5 text-center text-[#333333]">
                    {formatCurrency(item.amountPerStudent)}
                  </td>
                  <td className="pt-3 pb-3 px-5 text-center text-[#333333]">
                    {formatCurrency(item.liveExpectedFee)}
                  </td>
                  <td className="pt-3 pb-3 px-5 text-center text-[#333333]">
                    {formatCurrency(item.amountPaid)}
                  </td>
                  <td className="pt-3 pb-3 px-5 text-center text-[#333333]">
                    {formatDate(item.activeDate)}
                  </td>
                  <td className="pt-3 pb-3 px-5 text-center text-[#333333]">
                    {formatDate(item.expiredDate)}
                  </td>
                  <td className="pt-3 pb-3 px-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className={`${
                          item.liveIsActive
                            ? "text-[#1BB66E]"
                            : "text-[#F94144]"
                        } font-bold`}
                      >
                        {item.liveIsActive ? "Active" : "Inactive"}
                      </span>
                      <button
                        onClick={() => handleToggleStatus(item)}
                        disabled={togglingSubscription === item.subscriptionId}
                        className={`${
                          item.liveIsActive ? "bg-[#1BB66E]" : "bg-[#F94144]"
                        } font-bold text-white text-center rounded-full w-5 h-5 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {togglingSubscription === item.subscriptionId ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : item.liveIsActive ? (
                          <FaCheck size={12} />
                        ) : (
                          <IoClose size={12} />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="pt-3 pb-3 px-5 text-center text-[#333333]">
                    <div className="flex gap-4 justify-center">
                      <FiEdit3
                        className="text-[#80ADCB] cursor-pointer hover:text-[#01427A] transition-colors"
                        size={15}
                        onClick={() => openModal(item)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSubscriptions.length > itemsPerPage && (
            <div className="flex justify-center mt-4 pb-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`mx-1 px-3 py-1 rounded-md ${
                      currentPage === number
                        ? "bg-[#4084B1] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {number}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </SuperAdminLayout>
  );
};

export default MonitorSubscribtionItem;