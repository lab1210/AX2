"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  LuCopy, 
  LuDownload, 
  LuPlus, 
  LuTrash2, 
  LuRefreshCw, 
  LuFileText, 
  LuUpload,
  LuX,
  LuCheck,
  LuCalendar,
  LuMail,
  LuUser,
  LuPhone,
  LuTag
} from "react-icons/lu";
import regTokenService from "@/Service/RegistrationTokenService";
import Dropdown from "./DropDown2";

const TokenManagement = () => {
  const [tokens, setTokens] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [uploadType, setUploadType] = useState("Student");
  const [uploadExpiresAt, setUploadExpiresAt] = useState("");
  const [uploadSendEmails, setUploadSendEmails] = useState(true);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showSingleForm, setShowSingleForm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const itemsPerPage = 10;

  const [manualFormData, setManualFormData] = useState({
    type: "Student",
    expiresAt: "",
    sendEmails: true,
    recipients: [{ email: "", firstName: "", lastName: "", phoneNumber: "" }]
  });

  const [singleFormData, setSingleFormData] = useState({
    type: "Student",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    expiresAt: "",
    sendEmail: true
  });

  useEffect(() => {
    fetchSchoolId();
  }, []);

  useEffect(() => {
    if (schoolId) {
      fetchTokens();
      fetchStats();
    }
  }, [schoolId, filterType]);

  const fetchSchoolId = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.schoolId) {
        setSchoolId(user.schoolId);
      }
    } catch (error) {
      console.error("Failed to get school ID:", error);
    }
  };

  const fetchTokens = async () => {
    if (!schoolId) return;
    try {
      setLoading(true);
      const result = await regTokenService.getSchoolTokens(schoolId, {
        type: filterType || undefined
      });
      if (result.success) {
        setTokens(result.data || []);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch tokens");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!schoolId) return;
    try {
      const result = await regTokenService.getTokenStats(schoolId);
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const getTokenStatus = (expiresAt) => {
    const now = new Date();
    const expiryDate = new Date(expiresAt);
    if (expiryDate < now) {
      return "Expired";
    }
    return "Active";
  };

  const getTokenStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Expired":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTokenTypeColor = (type) => {
    switch (type) {
      case "Student":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Teacher":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop().toLowerCase();
    if (extension !== 'xlsx' && extension !== 'xls') {
      toast.error("Please upload an Excel file (.xlsx or .xls)");
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      e.target.value = '';
      return;
    }

    if (!schoolId) {
      toast.error("School ID not found");
      e.target.value = '';
      return;
    }

    try {
      setUploadLoading(true);
      toast.loading("Uploading file and generating tokens...", { id: "upload" });
      
      const result = await regTokenService.bulkUploadTokens(schoolId, file, {
        type: uploadType,
        expiresAt: uploadExpiresAt || null,
        sendEmails: uploadSendEmails
      });
      
      toast.dismiss("upload");
      
      if (result.success) {
        toast.success(result.message || "Tokens generated successfully!");
        fetchTokens();
        fetchStats();
        e.target.value = '';
      } else {
        toast.error(result.message || "Failed to generate tokens");
        if (result.errorRows?.length) {
          console.error("Error rows:", result.errorRows);
          toast.error(`${result.errorRows.length} rows had errors. Check console for details.`);
        }
      }
    } catch (error) {
      toast.dismiss("upload");
      toast.error("Failed to upload file");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleManualGenerate = async (e) => {
    e.preventDefault();
    
    const validRecipients = manualFormData.recipients.filter(r => r.firstName && r.lastName);
    if (validRecipients.length === 0) {
      toast.error("Please add at least one recipient with first name and last name");
      return;
    }

    if (!schoolId) {
      toast.error("School ID not found");
      return;
    }

    try {
      setLoading(true);
      const result = await regTokenService.generateTokensManually(schoolId, {
        type: manualFormData.type,
        expiresAt: manualFormData.expiresAt || null,
        sendEmails: manualFormData.sendEmails,
        recipients: validRecipients
      });
      
      if (result.success) {
        toast.success(result.message);
        fetchTokens();
        fetchStats();
        setShowManualForm(false);
        setManualFormData({
          type: "Student",
          expiresAt: "",
          sendEmails: true,
          recipients: [{ email: "", firstName: "", lastName: "", phoneNumber: "" }]
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to generate tokens");
    } finally {
      setLoading(false);
    }
  };

  const handleSingleGenerate = async (e) => {
    e.preventDefault();
    
    if (!singleFormData.firstName || !singleFormData.lastName) {
      toast.error("First name and last name are required");
      return;
    }

    if (!schoolId) {
      toast.error("School ID not found");
      return;
    }

    try {
      setLoading(true);
      const result = await regTokenService.generateSingleToken(schoolId, singleFormData);
      
      if (result.success) {
        toast.success(result.message);
        fetchTokens();
        fetchStats();
        setShowSingleForm(false);
        setSingleFormData({
          type: "Student",
          email: "",
          firstName: "",
          lastName: "",
          phoneNumber: "",
          expiresAt: "",
          sendEmail: true
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to generate token");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeToken = async (token) => {
    if (window.confirm("Are you sure you want to revoke this token?")) {
      try {
        const result = await regTokenService.revokeToken(token);
        if (result.success) {
          toast.success("Token revoked successfully");
          fetchTokens();
          fetchStats();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to revoke token");
      }
    }
  };

  const handleCopyToken = (token) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied to clipboard!");
  };

  const handleDownloadTemplate = async (type) => {
    try {
      toast.loading("Downloading template...", { id: "download" });
      const result = await regTokenService.downloadTemplate(type);
      toast.dismiss("download");
      if (result.success) {
        toast.success(`${type} template downloaded successfully`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.dismiss("download");
      toast.error("Failed to download template");
    }
  };

  const addRecipientField = () => {
    setManualFormData(prev => ({
      ...prev,
      recipients: [...prev.recipients, { email: "", firstName: "", lastName: "", phoneNumber: "" }]
    }));
  };

  const removeRecipientField = (index) => {
    if (manualFormData.recipients.length <= 1) return;
    setManualFormData(prev => ({
      ...prev,
      recipients: prev.recipients.filter((_, i) => i !== index)
    }));
  };

  const updateRecipientField = (index, field, value) => {
    setManualFormData(prev => ({
      ...prev,
      recipients: prev.recipients.map((r, i) => 
        i === index ? { ...r, [field]: value } : r
      )
    }));
  };

  const filteredTokens = filterType 
    ? tokens.filter(token => token.type === filterType)
    : tokens;

  const paginatedData = filteredTokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredTokens.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const InputField = ({ label, name, type = "text", value, onChange, placeholder, required, icon: Icon }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {Icon && <Icon size={14} className="text-gray-400" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField(null)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg transition-all duration-200 outline-none
          ${focusedField === name 
            ? 'border-blue-500 ring-2 ring-blue-200' 
            : 'border-gray-300 hover:border-gray-400'
          }`}
        required={required}
      />
    </div>
  );

  const SelectField = ({ label, value, options, onChange, icon: Icon }) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {Icon && <Icon size={14} className="text-gray-400" />}
        {label}
      </label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border border-blue-100 p-5 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 mb-1">Total Tokens</p>
            <p className="text-3xl font-bold text-[#07508F]">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm border border-green-100 p-5 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border border-blue-100 p-5 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 mb-1">Used</p>
            <p className="text-3xl font-bold text-blue-600">{stats.used}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-sm border border-red-100 p-5 hover:shadow-md transition-shadow">
            <p className="text-sm text-gray-500 mb-1">Expired/Revoked</p>
            <p className="text-3xl font-bold text-red-600">{(stats.expired || 0) + (stats.revoked || 0)}</p>
          </div>
        </div>
      )}

      {/* Generation Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex gap-3 p-4 border-b border-gray-200 flex-wrap bg-gray-50">
          <button
            onClick={() => {
              setShowManualForm(!showManualForm);
              setShowSingleForm(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
              ${showManualForm 
                ? 'bg-[#07508F] text-white shadow-md' 
                : 'bg-white text-[#07508F] border border-[#07508F] hover:bg-[#07508F] hover:text-white'
              }`}
          >
            <LuPlus size={18} /> Manual Bulk Generate
          </button>
          <button
            onClick={() => {
              setShowSingleForm(!showSingleForm);
              setShowManualForm(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium
              ${showSingleForm 
                ? 'bg-[#07508F] text-white shadow-md' 
                : 'bg-white text-[#07508F] border border-[#07508F] hover:bg-[#07508F] hover:text-white'
              }`}
          >
            <LuPlus size={18} /> Generate Single
          </button>
          
          <div className="border-l border-gray-300 h-8 self-center"></div>
          
          <button
            onClick={() => handleDownloadTemplate("Student")}
            className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-all duration-200 border border-purple-200"
          >
            <LuFileText size={18} /> Student Template
          </button>
          <button
            onClick={() => handleDownloadTemplate("Teacher")}
            className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-all duration-200 border border-orange-200"
          >
            <LuFileText size={18} /> Teacher Template
          </button>
          
          <div className="relative ml-auto">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="excel-upload"
              disabled={uploadLoading}
            />
            <label
              htmlFor="excel-upload"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 font-medium
                ${uploadLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow'
                }`}
            >
              <LuUpload size={18} /> 
              {uploadLoading ? "Uploading..." : "Upload Excel"}
            </label>
          </div>
        </div>

        {/* Upload Options */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SelectField
              label="Token Type"
              value={uploadType}
              icon={LuTag}
              options={[
                { value: "Student", label: "Student" },
                { value: "Teacher", label: "Teacher" }
              ]}
              onChange={(e) => setUploadType(e.target.value)}
            />
            <InputField
              label="Expires At (Optional)"
              type="datetime-local"
              value={uploadExpiresAt}
              icon={LuCalendar}
              onChange={(e) => setUploadExpiresAt(e.target.value)}
            />
            <div className="flex items-center gap-3 mt-6">
              <input
                type="checkbox"
                id="uploadSendEmails"
                checked={uploadSendEmails}
                onChange={(e) => setUploadSendEmails(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="uploadSendEmails" className="text-sm text-gray-700">Send Email Notifications</label>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
            <LuFileText size={12} /> Excel file should have columns: Email (optional), FirstName, LastName, PhoneNumber (optional)
          </p>
        </div>

        {/* Manual Bulk Form */}
        {showManualForm && (
          <form onSubmit={handleManualGenerate} className="p-4 space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                label="Token Type"
                value={manualFormData.type}
                icon={LuTag}
                options={[
                  { value: "Student", label: "Student" },
                  { value: "Teacher", label: "Teacher" }
                ]}
                onChange={(e) => setManualFormData(prev => ({ ...prev, type: e.target.value }))}
              />
              <InputField
                label="Expires At"
                type="datetime-local"
                value={manualFormData.expiresAt}
                icon={LuCalendar}
                onChange={(e) => setManualFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
              <div className="flex items-center gap-3 mt-6">
                <input
                  type="checkbox"
                  id="sendEmails"
                  checked={manualFormData.sendEmails}
                  onChange={(e) => setManualFormData(prev => ({ ...prev, sendEmails: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="sendEmails" className="text-sm text-gray-700">Send Email Notifications</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
              <div className="space-y-2">
                {manualFormData.recipients.map((recipient, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-start bg-gray-50 p-3 rounded-lg">
                    <InputField
                      label={index === 0 ? "Email" : ""}
                      type="email"
                      value={recipient.email}
                      icon={LuMail}
                      onChange={(e) => updateRecipientField(index, "email", e.target.value)}
                      placeholder="Email"
                    />
                    <InputField
                      label={index === 0 ? "First Name *" : ""}
                      value={recipient.firstName}
                      icon={LuUser}
                      onChange={(e) => updateRecipientField(index, "firstName", e.target.value)}
                      placeholder="First Name"
                      required
                    />
                    <InputField
                      label={index === 0 ? "Last Name *" : ""}
                      value={recipient.lastName}
                      icon={LuUser}
                      onChange={(e) => updateRecipientField(index, "lastName", e.target.value)}
                      placeholder="Last Name"
                      required
                    />
                    <InputField
                      label={index === 0 ? "Phone Number" : ""}
                      value={recipient.phoneNumber}
                      icon={LuPhone}
                      onChange={(e) => updateRecipientField(index, "phoneNumber", e.target.value)}
                      placeholder="Phone Number"
                    />
                    {manualFormData.recipients.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeRecipientField(index)} 
                        className="mt-6 text-red-500 hover:text-red-700 transition-colors"
                      >
                        <LuX size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button 
                type="button" 
                onClick={addRecipientField} 
                className="flex items-center gap-2 text-[#07508F] text-sm mt-3 hover:text-[#05406e] transition-colors"
              >
                <LuPlus size={16} /> Add Another Recipient
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowManualForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-[#07508F] text-white rounded-lg hover:bg-[#05406e] transition-all disabled:opacity-50 flex items-center gap-2">
                {loading ? "Generating..." : "Generate Tokens"}
                {!loading && <LuCheck size={16} />}
              </button>
            </div>
          </form>
        )}

        {/* Single Token Form */}
        {showSingleForm && (
          <form onSubmit={handleSingleGenerate} className="p-4 space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Token Type"
                value={singleFormData.type}
                icon={LuTag}
                options={[
                  { value: "Student", label: "Student" },
                  { value: "Teacher", label: "Teacher" }
                ]}
                onChange={(e) => setSingleFormData(prev => ({ ...prev, type: e.target.value }))}
              />
              <InputField
                label="Expires At"
                type="datetime-local"
                value={singleFormData.expiresAt}
                icon={LuCalendar}
                onChange={(e) => setSingleFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
              />
              <InputField
                label="Email"
                type="email"
                value={singleFormData.email}
                icon={LuMail}
                onChange={(e) => setSingleFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email address"
              />
              <div className="flex items-center gap-3 mt-6">
                <input
                  type="checkbox"
                  id="sendSingleEmail"
                  checked={singleFormData.sendEmail}
                  onChange={(e) => setSingleFormData(prev => ({ ...prev, sendEmail: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="sendSingleEmail" className="text-sm text-gray-700">Send Email</label>
              </div>
              <InputField
                label="First Name *"
                value={singleFormData.firstName}
                icon={LuUser}
                onChange={(e) => setSingleFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="First name"
                required
              />
              <InputField
                label="Last Name *"
                value={singleFormData.lastName}
                icon={LuUser}
                onChange={(e) => setSingleFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last name"
                required
              />
              <InputField
                label="Phone Number"
                value={singleFormData.phoneNumber}
                icon={LuPhone}
                onChange={(e) => setSingleFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="Phone number"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setShowSingleForm(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-2 bg-[#07508F] text-white rounded-lg hover:bg-[#05406e] transition-all disabled:opacity-50 flex items-center gap-2">
                {loading ? "Generating..." : "Generate Token"}
                {!loading && <LuCheck size={16} />}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Filters and Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-3">
            <div className="w-48">
              <Dropdown
                label={filterType || "All Types"}
                items={[
                  { label: "All Types", onClick: () => setFilterType("") },
                  { label: "Student", onClick: () => setFilterType("Student") },
                  { label: "Teacher", onClick: () => setFilterType("Teacher") }
                ]}
              />
            </div>
            <button
              onClick={() => {
                fetchTokens();
                fetchStats();
              }}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
            >
              <LuRefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Total: {filteredTokens.length} tokens
          </div>
        </div>

        {/* Tokens Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Token</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Type</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Name</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Email</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Phone</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="p-3 text-left text-sm font-semibold text-gray-600">Expires At</th>
                <th className="p-3 text-center text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center p-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#07508F] mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading tokens...</p>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-10 text-gray-500">
                    <LuFileText size={48} className="mx-auto mb-3 text-gray-300" />
                    No tokens found
                  </td>
                </tr>
              ) : (
                paginatedData.map((token, index) => {
                  const status = getTokenStatus(token.expiresAt);
                  return (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-mono text-sm">
                        <code className="bg-gray-100 px-2 py-1 rounded">{token.token}</code>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getTokenTypeColor(token.type)}`}>
                          {token.type}
                        </span>
                      </td>
                      <td className="p-3">{token.firstName} {token.lastName}</td>
                      <td className="p-3">{token.email || <span className="text-gray-400">—</span>}</td>
                      <td className="p-3">{token.phoneNumber || <span className="text-gray-400">—</span>}</td>
                      <td className="p-3">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getTokenStatusColor(status)}`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{new Date(token.expiresAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex gap-2 justify-center">
                          <button 
                            onClick={() => handleCopyToken(token.token)} 
                            className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                            title="Copy token"
                          >
                            <LuCopy size={18} />
                          </button>
                          {status === "Active" && (
                            <button 
                              onClick={() => handleRevokeToken(token.token)} 
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                              title="Revoke token"
                            >
                              <LuTrash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center gap-4 p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#07508F] text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenManagement;