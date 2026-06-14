"use client";
import React, { useState, useEffect } from "react";
import { FiPlus, FiRefreshCw, FiFileText, FiX, FiEye, FiSearch } from "react-icons/fi";
import Dropdown from "./DropDown2";
import paymentService from "@/Service/PaymentService";
import academicPeriodService from "@/Service/AcademicPeriodService";
import classService from "@/Service/ClassService";
import studentService from "@/Service/studentService";
import toast from "react-hot-toast";

const FeeManagement = () => {
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("categories");
  const [terms, setTerms] = useState([]);
  const [classYears, setClassYears] = useState([]);
  const [students, setStudents] = useState([]);
  
  // Fee Categories
  const [categories, setCategories] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    type: 1,
    scope: 1,
  });
  
  // Fee Structures
  const [structures, setStructures] = useState([]);
  const [showStructureForm, setShowStructureForm] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [structureForm, setStructureForm] = useState({
    feeCategoryId: "",
    classYearId: "",
    termId: "",
    amount: "",
    dueDate: "",
  });
  const [selectedCategoryScope, setSelectedCategoryScope] = useState(null);
  const [rawAmount, setRawAmount] = useState("");

  // Compulsory Account Generation
  const [selectedGenTerm, setSelectedGenTerm] = useState("");
  const [selectedSyncTerm, setSelectedSyncTerm] = useState("");

  // Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  
  // Payment History
  const [paymentHistory, setPaymentHistory] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [selectedReceiptTerm, setSelectedReceiptTerm] = useState("");
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [allPayments, setAllPayments] = useState([]);
  const [paymentFilters, setPaymentFilters] = useState({
    termId: "",
    classYearId: "",
    studentId: "",
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    fetchTerms();
    fetchClassYears();
    fetchCategories();
    fetchStructures();
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedTerm) {
      fetchStructures(selectedTerm);
    }
  }, [selectedTerm]);

  useEffect(() => {
    if (structureForm.feeCategoryId) {
      const selectedCategory = categories.find(c => c.id === structureForm.feeCategoryId);
      setSelectedCategoryScope(selectedCategory?.scope);
      if (selectedCategory?.scope !== 2) {
        setStructureForm(prev => ({ ...prev, classYearId: "" }));
      }
    } else {
      setSelectedCategoryScope(null);
    }
  }, [structureForm.feeCategoryId, categories]);

  const formatAmount = (value) => {
    if (!value) return "";
    const number = value.toString().replace(/\D/g, "");
    if (!number) return "";
    return new Intl.NumberFormat('en-NG').format(parseInt(number));
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/\D/g, "");
    setRawAmount(rawValue);
    setStructureForm(prev => ({ ...prev, amount: numericValue }));
  };

  const parseAmount = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat('en-NG').format(parseFloat(value));
  };

  const fetchTerms = async () => {
    try {
      const result = await academicPeriodService.getAllTerms();
      if (result.success) {
        setTerms(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch terms:", error);
    }
  };

  const fetchClassYears = async () => {
    try {
      const result = await classService.getAllClassYears();
      if (result.success) {
        setClassYears(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch class years:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const result = await studentService.getAllStudents();
      if (result.success) {
        setStudents(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await paymentService.getFeeCategories();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchStructures = async (termId = null) => {
    try {
      const result = await paymentService.getFeeStructures(termId);
      if (result.success) {
        setStructures(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch structures:", error);
    }
  };

  const fetchStudentPaymentHistory = async () => {
    if (!selectedStudent) {
      toast.error("Please select a student");
      return;
    }

    try {
      setLoading(true);
      const result = await paymentService.getStudentPaymentHistory(selectedStudent, selectedReceiptTerm || null);
      
      if (result.success) {
        setPaymentHistory(result.data);
        setShowPaymentHistory(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch payment history");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPayments = async () => {
    try {
      setLoading(true);
      const result = await paymentService.getAllPaymentHistory({
        termId: paymentFilters.termId || null,
        classYearId: paymentFilters.classYearId || null,
        studentId: paymentFilters.studentId || null,
        fromDate: paymentFilters.fromDate || null,
        toDate: paymentFilters.toDate || null,
      });
      
      if (result.success) {
        setAllPayments(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const handleViewReceipt = async (reference) => {
    try {
      setLoading(true);
      const result = await paymentService.getPaymentReceipt(reference);
      if (result.success) {
        setReceiptData(result.data);
        setShowReceiptModal(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch receipt");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      toast.error("Category name is required");
      return;
    }

    try {
      setLoading(true);
      const result = await paymentService.createFeeCategory(categoryForm);
      if (result.success) {
        toast.success("Fee category created successfully");
        setCategoryForm({ name: "", description: "", type: 1, scope: 1 });
        setShowCategoryForm(false);
        await fetchCategories();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStructure = async (e) => {
    e.preventDefault();
    if (!structureForm.feeCategoryId || !structureForm.termId || !structureForm.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedCategoryScope === 2 && !structureForm.classYearId) {
      toast.error("Please select a class year for this class-specific fee");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        feeCategoryId: structureForm.feeCategoryId,
        termId: structureForm.termId,
        amount: parseFloat(structureForm.amount),
        dueDate: structureForm.dueDate || null,
      };
      
      if (selectedCategoryScope === 2) {
        payload.classYearId = structureForm.classYearId;
      }
      
      const result = await paymentService.createFeeStructure(payload);
      if (result.success) {
        toast.success("Fee structure created successfully");
        setStructureForm({ feeCategoryId: "", classYearId: "", termId: "", amount: "", dueDate: "" });
        setRawAmount("");
        setShowStructureForm(false);
        await fetchStructures(selectedTerm);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to create fee structure");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAccounts = async () => {
    if (!selectedGenTerm) {
      toast.error("Please select a term");
      return;
    }

    try {
      setLoading(true);
      const result = await paymentService.generateCompulsoryAccounts(selectedGenTerm);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to generate accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAmounts = async () => {
    if (!selectedSyncTerm) {
      toast.error("Please select a term");
      return;
    }

    try {
      setLoading(true);
      const result = await paymentService.syncCompulsoryAmounts(selectedSyncTerm);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to sync amounts");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTypeColor = (type) => {
    return type === 1 ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800";
  };

  const getCategoryTypeName = (type) => {
    return type === 1 ? "Compulsory" : "Additional";
  };

  const getCategoryScopeLabel = (scope) => {
    return scope === 1 ? "All Students" : "Specific Class";
  };

  const getTermName = (termId) => {
    const term = terms.find(t => t.id === termId);
    return term?.name;
  };

  const getClassName = (classYearId) => {
    const classYear = classYears.find(c => c.id === classYearId);
    return classYear?.className;
  };

  const getStudentName = (studentId) => {
    const student = students.find(s => s.userId === studentId);
    return student ? `${student.firstName} ${student.lastName}` : "";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Receipt Modal */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#07508F]">Payment Receipt</h2>
              <button
                onClick={() => {
                  setShowReceiptModal(false);
                  setReceiptData(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                {receiptData.schoolLogo && (
                  <img src={receiptData.schoolLogo} alt="School Logo" className="h-16 mx-auto mb-3" />
                )}
                <h3 className="text-xl font-bold">{receiptData.schoolName}</h3>
                <p className="text-sm text-gray-600">{receiptData.schoolAddress}</p>
                <p className="text-sm text-gray-600 mt-2">Payment Receipt</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Receipt No:</p>
                  <p className="font-semibold">{receiptData.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date:</p>
                  <p className="font-semibold">{new Date(receiptData.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student:</p>
                  <p className="font-semibold">{receiptData.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admission No:</p>
                  <p className="font-semibold">{receiptData.admissionNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Type:</p>
                  <p className="font-semibold">{receiptData.paymentType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Method:</p>
                  <p className="font-semibold">{receiptData.paymentMethod}</p>
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
                  {receiptData.items?.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-right">{parseAmount(item.amount)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 font-bold">
                    <td className="p-2">Total</td>
                    <td className="p-2 text-right">₦{parseAmount(receiptData.amount)}</td>
                  </tr>
                </tbody>
              </table>

              {receiptData.totalExpected !== undefined && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Fee Account Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Expected:</p>
                      <p className="font-semibold">₦{parseAmount(receiptData.totalExpected)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Paid:</p>
                      <p className="font-semibold text-green-600">₦{parseAmount(receiptData.totalPaidToDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Remaining Balance:</p>
                      <p className="font-semibold text-red-600">₦{parseAmount(receiptData.remainingBalance)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center text-sm text-gray-500 mt-6">
                <p>Thank you for your payment!</p>
                <p className="mt-2">This is an official receipt. Please keep for your records.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Modal */}
      {showPaymentHistory && paymentHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-[#07508F]">
                Payment History - {getStudentName(selectedStudent)}
              </h2>
              <button
                onClick={() => {
                  setShowPaymentHistory(false);
                  setPaymentHistory(null);
                  setSelectedStudent("");
                  setSelectedReceiptTerm("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6">
              {paymentHistory.terms && paymentHistory.terms.length > 0 ? (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <p className="font-semibold">Total Outstanding Balance: ₦{parseAmount(paymentHistory.totalOutstanding)}</p>
                  </div>
                  {paymentHistory.terms.map((term, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">{term.termName} - {term.sessionName}</h3>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Expected:</p>
                          <p className="font-semibold">₦{parseAmount(term.compulsoryTotal)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Paid:</p>
                          <p className="font-semibold text-green-600">₦{parseAmount(term.compulsoryPaid)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Balance:</p>
                          <p className="font-semibold text-red-600">₦{parseAmount(term.compulsoryBalance)}</p>
                        </div>
                      </div>
                      {term.compulsoryPayments && term.compulsoryPayments.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Payment History</h4>
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2 text-left">Reference</th>
                                <th className="p-2 text-left">Date</th>
                                <th className="p-2 text-right">Amount</th>
                                <th className="p-2 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {term.compulsoryPayments.map((payment, pIdx) => (
                                <tr key={pIdx} className="border-b">
                                  <td className="p-2 font-mono text-xs">{payment.reference}</td>
                                  <td className="p-2">{new Date(payment.paidAt).toLocaleDateString()}</td>
                                  <td className="p-2 text-right">₦{parseAmount(payment.amount)}</td>
                                  <td className="p-2 text-center">
                                    <button
                                      onClick={() => handleViewReceipt(payment.reference)}
                                      className="text-blue-500 hover:text-blue-700"
                                    >
                                      <FiEye size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {term.optionalPayments && term.optionalPayments.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Optional Payments</h4>
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="p-2 text-left">Reference</th>
                                <th className="p-2 text-left">Items</th>
                                <th className="p-2 text-left">Date</th>
                                <th className="p-2 text-right">Amount</th>
                                <th className="p-2 text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {term.optionalPayments.map((payment, pIdx) => (
                                <tr key={pIdx} className="border-b">
                                  <td className="p-2 font-mono text-xs">{payment.reference}</td>
                                  <td className="p-2">{payment.items?.join(", ")}</td>
                                  <td className="p-2">{new Date(payment.paidAt).toLocaleDateString()}</td>
                                  <td className="p-2 text-right">₦{parseAmount(payment.amount)}</td>
                                  <td className="p-2 text-center">
                                    <button
                                      onClick={() => handleViewReceipt(payment.reference)}
                                      className="text-blue-500 hover:text-blue-700"
                                    >
                                      <FiEye size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No payment history found for this student.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="flex gap-2 border-b pb-2 flex-wrap">
        <button
          onClick={() => setActiveSection("categories")}
          className={`px-4 py-2 rounded-t-lg transition-all ${
            activeSection === "categories"
              ? "bg-[#07508F] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Fee Categories
        </button>
        <button
          onClick={() => setActiveSection("structures")}
          className={`px-4 py-2 rounded-t-lg transition-all ${
            activeSection === "structures"
              ? "bg-[#07508F] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Fee Structures
        </button>
        <button
          onClick={() => setActiveSection("accounts")}
          className={`px-4 py-2 rounded-t-lg transition-all ${
            activeSection === "accounts"
              ? "bg-[#07508F] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Fee Accounts
        </button>
        <button
          onClick={() => setActiveSection("receipts")}
          className={`px-4 py-2 rounded-t-lg transition-all ${
            activeSection === "receipts"
              ? "bg-[#07508F] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Student Payment History
        </button>
      </div>

      {/* Fee Categories Section */}
      {activeSection === "categories" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-semibold text-lg text-[#07508F]">Fee Categories</h3>
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="flex items-center gap-2 bg-[#07508F] text-white px-3 py-1 rounded-md hover:bg-[#05406e]"
            >
              <FiPlus size={16} /> Add Category
            </button>
          </div>

          {showCategoryForm && (
            <form onSubmit={handleCreateCategory} className="p-4 bg-gray-50 border-b">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category Name *</label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full border rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fee Type</label>
                  <select
                    value={categoryForm.type}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, type: parseInt(e.target.value) }))}
                    className="w-full border rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value={1}>Compulsory</option>
                    <option value={2}>Additional (Optional)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Scope</label>
                  <select
                    value={categoryForm.scope}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, scope: parseInt(e.target.value) }))}
                    className="w-full border rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value={1}>All Students (School-wide)</option>
                    <option value={2}>Specific Class Year</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryForm(false)}
                  className="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1 bg-[#07508F] text-white rounded-md hover:bg-[#05406e]"
                >
                  Save Category
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Scope</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{category.name}</td>
                    <td className="p-3">{category.description || "-"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getCategoryTypeColor(category.type)}`}>
                        {getCategoryTypeName(category.type)}
                      </span>
                    </td>
                    <td className="p-3">{getCategoryScopeLabel(category.scope)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fee Structures Section */}
      {activeSection === "structures" && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Filter by Term</label>
                <Dropdown
                  label={getTermName(selectedTerm) || "Select Term"}
                  items={terms.map((term) => ({
                    label: term.name,
                    onClick: () => setSelectedTerm(term.id),
                  }))}
                />
              </div>
              <button
                onClick={() => setShowStructureForm(!showStructureForm)}
                className="flex items-center gap-2 bg-[#07508F] text-white px-3 py-2 rounded-md hover:bg-[#05406e]"
              >
                <FiPlus size={16} /> Add Fee Structure
              </button>
            </div>
          </div>

          {showStructureForm && (
            <form onSubmit={handleCreateStructure} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h4 className="font-semibold mb-4">Add Fee Structure</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fee Category *</label>
                  <select
                    value={structureForm.feeCategoryId}
                    onChange={(e) => setStructureForm(prev => ({ ...prev, feeCategoryId: e.target.value }))}
                    className="w-full border rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name} ({getCategoryTypeName(cat.type)})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Term *</label>
                  <select
                    value={structureForm.termId}
                    onChange={(e) => setStructureForm(prev => ({ ...prev, termId: e.target.value }))}
                    className="w-full border rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value="">Select Term</option>
                    {terms.map((term) => (
                      <option key={term.id} value={term.id}>{term.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Amount (₦) *</label>
                  <input
                    type="text"
                    value={rawAmount || (structureForm.amount ? formatAmount(structureForm.amount) : "")}
                    onChange={handleAmountChange}
                    placeholder="e.g., 50,000"
                    className="w-full border rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date (Optional)</label>
                  <input
                    type="date"
                    value={structureForm.dueDate}
                    onChange={(e) => setStructureForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full border rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                
                {selectedCategoryScope === 2 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Class Year *</label>
                    <select
                      value={structureForm.classYearId}
                      onChange={(e) => setStructureForm(prev => ({ ...prev, classYearId: e.target.value }))}
                      className="w-full border rounded-md p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      required
                    >
                      <option value="">Select Class Year</option>
                      {classYears.map((year) => (
                        <option key={year.id} value={year.id}>{year.className}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      This fee will only apply to students in this class year
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowStructureForm(false)}
                  className="px-3 py-1 border rounded-md text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-3 py-1 bg-[#07508F] text-white rounded-md hover:bg-[#05406e]"
                >
                  Save Structure
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Type</th>
                    <th className="p-3 text-left">Term</th>
                    <th className="p-3 text-left">Class</th>
                    <th className="p-3 text-right">Amount (₦)</th>
                    <th className="p-3 text-left">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {structures.map((structure) => (
                    <tr key={structure.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{structure.feeCategoryName}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${getCategoryTypeColor(structure.feeType)}`}>
                          {getCategoryTypeName(structure.feeType)}
                        </span>
                      </td>
                      <td className="p-3">{structure.termName}</td>
                      <td className="p-3">{structure.classYearName || "All Students"}</td>
                      <td className="p-3 text-right font-semibold">
                        ₦{parseAmount(structure.amount)}
                      </td>
                      <td className="p-3">{structure.dueDate ? new Date(structure.dueDate).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fee Accounts Section */}
      {activeSection === "accounts" && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-lg text-[#07508F] mb-4">Compulsory Fee Account Management</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Term</label>
                <Dropdown
                  label={getTermName(selectedGenTerm) || "Select Term"}
                  items={terms.map((term) => ({
                    label: term.name,
                    onClick: () => setSelectedGenTerm(term.id),
                  }))}
                />
                <button
                  onClick={handleGenerateAccounts}
                  disabled={loading || !selectedGenTerm}
                  className="mt-3 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  <FiRefreshCw size={16} /> Generate Fee Accounts
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Creates compulsory fee accounts for all active students in the selected term.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sync Amounts</label>
                <Dropdown
                  label={getTermName(selectedSyncTerm) || "Select Term"}
                  items={terms.map((term) => ({
                    label: term.name,
                    onClick: () => setSelectedSyncTerm(term.id),
                  }))}
                />
                <button
                  onClick={handleSyncAmounts}
                  disabled={loading || !selectedSyncTerm}
                  className="mt-3 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  <FiRefreshCw size={16} /> Sync Fee Amounts
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  Updates existing fee accounts with any changes to fee structures.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Payment History Section */}
      {activeSection === "receipts" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="font-semibold text-lg text-[#07508F] mb-4">View Student Payment History</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Student *</label>
              <Dropdown
                label={getStudentName(selectedStudent) || "Select Student"}
                items={students.map((student) => ({
                  label: `${student.firstName} ${student.lastName} - ${student.admissionNumber}`,
                  onClick: () => {
                    setSelectedStudent(student.userId);
                    setSelectedStudentName(`${student.firstName} ${student.lastName}`);
                  },
                }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Filter by Term (Optional)</label>
              <Dropdown
                label={getTermName(selectedReceiptTerm) || "All Terms"}
                items={[
                  { label: "All Terms", onClick: () => setSelectedReceiptTerm("") },
                  ...terms.map((term) => ({
                    label: term.name,
                    onClick: () => setSelectedReceiptTerm(term.id),
                  })),
                ]}
              />
            </div>
          </div>
          <button
            onClick={fetchStudentPaymentHistory}
            disabled={!selectedStudent || loading}
            className="flex items-center gap-2 bg-[#07508F] text-white px-4 py-2 rounded-md hover:bg-[#05406e] disabled:opacity-50"
          >
            <FiSearch size={16} /> {loading ? "Loading..." : "View Payment History"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;