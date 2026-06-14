"use client";
import React, { useState, useEffect } from "react";
import { 
  FiCreditCard, FiFileText, FiCheckCircle, FiAlertCircle, 
  FiRefreshCw, FiX, FiEye, FiClock, FiCalendar, 
  FiDollarSign, FiUsers, FiInfo, FiPrinter
} from "react-icons/fi";
import toast from "react-hot-toast";
import paymentService from "@/Service/PaymentService";
import subscriptionService from "@/Service/SubscribtionService";

const SchoolSubscriptionPayment = () => {
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [billData, setBillData] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [paystackReady, setPaystackReady] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState(null);

  useEffect(() => {
    fetchAllData();
    loadPaystackScript();
    
    // Optional: Refresh data every 30 seconds to keep subscription status updated
    const interval = setInterval(() => {
      if (!paymentProcessing) {
        fetchSubscription();
        fetchBill();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPaystackScript = async () => {
    try {
      if (window.PaystackPop) {
        setPaystackReady(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => {
        console.log("Paystack script loaded");
        setPaystackReady(true);
      };
      script.onerror = () => {
        console.error("Failed to load Paystack script");
        toast.error("Failed to load payment system");
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Error loading Paystack script:", error);
    }
  };

  const fetchAllData = async () => {
    console.log("Refreshing all subscription data...");
    await Promise.all([
      fetchSubscription(),
      fetchBill(),
      fetchPaystackConfig()
    ]);
    console.log("All data refreshed successfully");
  };

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const result = await subscriptionService.getCurrentSubscription();
      console.log("Subscription data:", result);
      
      if (result.success && result.data) {
        setSubscription(result.data);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaystackConfig = async () => {
    try {
      const result = await paymentService.getPaystackConfig();
      console.log("Paystack config:", result);
      if (result.success && result.data?.paystackPublicKey) {
        setPaystackPublicKey(result.data.paystackPublicKey);
        console.log("Paystack public key loaded:", result.data.paystackPublicKey);
      } else {
        console.warn("No Paystack public key found");
      }
    } catch (error) {
      console.error("Error fetching Paystack config:", error);
    }
  };

  const fetchBill = async () => {
    try {
      const result = await subscriptionService.getMyBill();
      if (result.success) {
        setBillData(result.data);
      }
    } catch (error) {
      console.error("Error fetching bill:", error);
    }
  };

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const result = await subscriptionService.getMyReceipt();
      if (result.success) {
        setReceiptData(result.data);
        setReceiptModalVisible(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch receipt");
    } finally {
      setLoading(false);
    }
  };

  const getSchoolEmail = async () => {
    try {
      const result = await subscriptionService.getCurrentSubscription();
      return result.data?.schoolEmail || '';
    } catch {
      return '';
    }
  };

  const verifyPayment = async (reference) => {
    try {
      const result = await paymentService.verifySubscriptionPayment(reference);
      console.log("Verification response:", result);
      if (result.success) {
        toast.success("Payment verified successfully!");
        
        // Refetch all subscription data after successful payment
        await fetchAllData();
        
        // Close any open modals
        setPaymentProcessing(false);
        
        // Show success message with updated balance
        toast.success("Your subscription has been updated!");
      } else {
        toast.error(result.message || "Payment verification failed");
        setPaymentProcessing(false);
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Payment verification failed");
      setPaymentProcessing(false);
    }
  };

  const handleRefresh = async () => {
    toast.loading("Refreshing subscription data...");
    await fetchAllData();
    toast.dismiss();
    toast.success("Subscription data refreshed!");
  };

  const handlePayment = async () => {
    console.log("handlePayment called");
    
    if (!subscription) {
      toast.error("No subscription found");
      return;
    }

    if (!paystackReady) {
      toast.error("Payment system is still loading. Please wait...");
      return;
    }

    if (!paystackPublicKey) {
      toast.error("Paystack is not configured for this school. Please contact admin.");
      return;
    }

    try {
      setPaymentProcessing(true);
      
      console.log("Initializing payment for subscription:", subscription.subscriptionId);
      
      const result = await paymentService.initializeSubscriptionPayment(subscription.subscriptionId);
      
      console.log("Payment initialization response:", result);
      
      if (result.success && result.data) {
        const { reference, amount } = result.data;
        
        console.log("Payment details:", { reference, amount });
        
        // Get school email from subscription
        const schoolEmail = subscription.schoolEmail || await getSchoolEmail();
        
        console.log("School email:", schoolEmail);
        console.log("Paystack public key:", paystackPublicKey);
        
        // Define callback functions BEFORE calling setup
        const paymentCallback = async (response) => {
          console.log("Payment callback response:", response);
          toast.success("Payment successful! Verifying...");
          
          // Verify payment
          await verifyPayment(response.reference);
          
          // Force refresh subscription data after verification
          setTimeout(async () => {
            await fetchAllData();
            toast.success("Subscription updated! Please check your balance.");
          }, 2000);
        };
        
        const paymentOnClose = () => {
          console.log("Payment window closed by user");
          toast.error("Payment was cancelled");
          setPaymentProcessing(false);
        };
        
        // Initialize Paystack inline payment
        const handler = window.PaystackPop.setup({
          key: paystackPublicKey,
          email: schoolEmail,
          amount: Math.round(amount * 100), // Convert to kobo
          currency: 'NGN',
          ref: reference,
          callback: paymentCallback,
          onClose: paymentOnClose
        });
        
        handler.openIframe();
      } else {
        console.error("Payment initialization failed:", result.message);
        toast.error(result.message || "Failed to initialize payment");
        setPaymentProcessing(false);
      }
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Payment initialization failed: " + (error.message || "Unknown error"));
      setPaymentProcessing(false);
    }
  };

  const formatAmount = (value) => {
    if (!value) return "0";
    return new Intl.NumberFormat('en-NG').format(value);
  };

  const calculateBalanceDue = () => {
    if (!subscription) return 0;
    return (subscription.liveExpectedFee || 0) - (subscription.amountPaid || 0);
  };

  const balanceDue = calculateBalanceDue();
  const hasOutstandingBalance = balanceDue > 0;
  const isActive = subscription?.liveIsActive && subscription?.daysRemaining > 0;
  const paymentProgress = subscription?.liveExpectedFee > 0 
    ? ((subscription.amountPaid || 0) / subscription.liveExpectedFee) * 100 
    : 0;

  // Loading state
  if (loading && !subscription) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#07508F]"></div>
      </div>
    );
  }

  // No subscription found
  if (!subscription && !loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Subscription Found</h2>
          <p className="text-gray-600 mb-6">
            Your school doesn't have an active subscription. Please contact the administrator.
          </p>
          <button
            onClick={fetchSubscription}
            className="bg-[#07508F] text-white px-6 py-2 rounded-lg hover:bg-[#05406e]"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Receipt Modal */}
      {receiptModalVisible && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#07508F]">Payment Receipt</h2>
              <button
                onClick={() => {
                  setReceiptModalVisible(false);
                  setReceiptData(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                {receiptData?.schoolLogo && (
                  <img src={receiptData.schoolLogo} alt="School Logo" className="h-16 mx-auto mb-3" />
                )}
                <h3 className="text-xl font-bold">{receiptData?.schoolName}</h3>
                <p className="text-sm text-gray-600">{receiptData?.schoolAddress}</p>
                <p className="text-sm text-gray-600 mt-2">Payment Receipt</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Receipt No:</p>
                  <p className="font-semibold font-mono text-sm">{receiptData?.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date:</p>
                  <p className="font-semibold">{new Date(receiptData?.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method:</p>
                  <p className="font-semibold">{receiptData?.paymentMethod || "Card"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status:</p>
                  <p className="font-semibold text-green-600">{receiptData?.status}</p>
                </div>
              </div>

              <table className="w-full mb-6 border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Amount (₦)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">
                      Subscription Fee ({receiptData?.numberOfStudents} students × ₦{formatAmount(receiptData?.amountPerStudent)})
                    </td>
                    <td className="p-2 text-right">₦{formatAmount(receiptData?.amount)}</td>
                  </tr>
                  <tr className="border-t-2 font-bold">
                    <td className="p-2">Total Paid</td>
                    <td className="p-2 text-right text-green-600">₦{formatAmount(receiptData?.amount)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Subscription Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Active Period:</p>
                    <p className="font-medium">
                      {new Date(receiptData?.activeDate).toLocaleDateString()} - {new Date(receiptData?.expiredDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Days Remaining:</p>
                    <p className="font-medium">{receiptData?.daysRemaining} days</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <FiPrinter /> Print
                </button>
                <button
                  onClick={() => setReceiptModalVisible(false)}
                  className="px-4 py-2 bg-[#07508F] text-white rounded-lg hover:bg-[#05406e]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bill Modal */}
      {showBillModal && billData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#07508F]">Subscription Bill</h2>
              <button
                onClick={() => {
                  setShowBillModal(false);
                  setBillData(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                {billData?.schoolLogo && (
                  <img src={billData.schoolLogo} alt="School Logo" className="h-16 mx-auto mb-3" />
                )}
                <h3 className="text-xl font-bold">{billData?.schoolName}</h3>
                <p className="text-sm text-gray-600">{billData?.schoolAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Bill Date:</p>
                  <p className="font-semibold">{new Date(billData?.billDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status:</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    billData?.status === "Active" ? "bg-green-100 text-green-800" :
                    billData?.status === "Expiring Soon" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {billData?.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subscription Period:</p>
                  <p className="font-semibold">
                    {new Date(billData?.activeDate).toLocaleDateString()} - {new Date(billData?.expiredDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Days Remaining:</p>
                  <p className={`font-semibold ${billData?.daysRemaining <= 7 ? "text-red-600" : "text-green-600"}`}>
                    {billData?.daysRemaining} days
                  </p>
                </div>
              </div>

              <table className="w-full mb-6 border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Amount (₦)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">
                      Number of Students ({billData?.numberOfStudents} students × ₦{formatAmount(billData?.amountPerStudent)} per student)
                    </td>
                    <td className="p-2 text-right">₦{formatAmount(billData?.totalAmount)}</td>
                  </tr>
                  {billData?.amountPaid > 0 && (
                    <tr className="border-b">
                      <td className="p-2">Amount Paid</td>
                      <td className="p-2 text-right text-green-600">- ₦{formatAmount(billData?.amountPaid)}</td>
                    </tr>
                  )}
                  <tr className="border-t-2 font-bold">
                    <td className="p-2">Balance Due</td>
                    <td className="p-2 text-right text-red-600">₦{formatAmount(billData?.balanceDue)}</td>
                  </tr>
                </tbody>
              </table>

              {billData?.balanceDue > 0 && (
                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <FiAlertCircle />
                    Please pay the balance due to continue using your subscription.
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  <FiPrinter /> Print
                </button>
                <button
                  onClick={() => setShowBillModal(false)}
                  className="px-4 py-2 bg-[#07508F] text-white rounded-lg hover:bg-[#05406e]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-semibold text-lg text-[#07508F]">Subscription Status</h3>
          <button
            onClick={handleRefresh}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            disabled={loading}
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} />
            <span className="text-xs">Refresh</span>
          </button>
        </div>

        <div className="p-4">
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {isActive ? "Active" : "Inactive"}
            </span>
            {isActive && (
              <p className="text-sm text-gray-500 mt-2">
                Valid until {subscription?.expiredDate ? new Date(subscription.expiredDate).toLocaleDateString() : 'N/A'}
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Number of Students</p>
              <p className="text-xl font-bold">{subscription?.liveNumberStudents || 0}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Amount per Student</p>
              <p className="text-xl font-bold">₦{formatAmount(subscription?.amountPerStudent)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Total Expected</p>
              <p className="text-xl font-bold">₦{formatAmount(subscription?.liveExpectedFee)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Amount Paid</p>
              <p className="text-xl font-bold text-green-600">₦{formatAmount(subscription?.amountPaid)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span>Payment Progress</span>
              <span>{Math.round(paymentProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${paymentProgress}%` }}
              />
            </div>
          </div>

          {/* Balance Due Section */}
          {hasOutstandingBalance && (
            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-red-800">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-red-800">₦{formatAmount(balanceDue)}</p>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={paymentProcessing || !paystackReady || !paystackPublicKey}
                  className="bg-[#07508F] text-white px-6 py-2 rounded-lg hover:bg-[#05406e] disabled:opacity-50 flex items-center gap-2"
                >
                  {paymentProcessing ? (
                    <FiRefreshCw className="animate-spin" size={16} />
                  ) : (
                    <FiCreditCard size={16} />
                  )}
                  Pay Now
                </button>
              </div>
              {!paystackPublicKey && (
                <p className="text-xs text-red-600 mt-2">
                  Paystack not configured. Please contact admin.
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowBillModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              <FiFileText size={16} /> View Bill
            </button>
            {subscription?.amountPaid > 0 && (
              <button
                onClick={fetchReceipt}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <FiEye size={16} /> View Receipt
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-[#07508F]">Subscription Details</h3>
        </div>
        <div className="p-4 space-y-2 text-sm">
          <div className="flex justify-between py-1">
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Active Period:</span>
            <span>
              {subscription?.activeDate && new Date(subscription.activeDate).toLocaleDateString()} - {subscription?.expiredDate && new Date(subscription.expiredDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Days Remaining:</span>
            <span className={subscription?.daysRemaining <= 7 ? "text-red-600 font-semibold" : ""}>
              {subscription?.daysRemaining || 0} days
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-gray-500">Last Updated:</span>
            <span>{subscription?.updatedAt && new Date(subscription.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolSubscriptionPayment;