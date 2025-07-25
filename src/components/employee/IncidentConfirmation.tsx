import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  RefreshCw,
  CheckCircle,
  User,
  Zap,
  ArrowLeft,
  X,
  AlertTriangle,
  Loader2,
  Tag,
  PlusCircle,
  FileText,
} from "lucide-react";
import {
  confirmIncident,
  IncidentConfirmationPayloads,
  regenerateIncident,
} from "../../api/incidentApi";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { getStaffList, Staff } from "../../api/active_staff";

// --- INTERFACES ---
interface LocationState {
  formData: {
    description: string;
    reportedBy: {
      email: string;
      name: string;
      id: string;
    };
    apiResponse: {
      classification: {
        category: string;
        severity: string;
        title: string;
        summary: string;
        email: string;
      };
      staff_assignment: {
        assigned_staff_email: string;
        assigned_staff_name: string;
        assigned_staff_id: string;
        assigned_department: string;
      };
    };
    attachment: File | null;
  };
}

interface ProcessedData {
  staffId: string;
  staffName: string;
  email: string;
  department: string;
  category: string;
  title: string;
  description: string;
  summary: string;
  priority: string;
  staffEmail: string;
  reportedByEmail: string;
  reportedByName: string;
  reportedById: string;
}

const IncidentConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as LocationState;

  const [file] = useState<File | null>(state?.formData?.attachment || null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(
    null
  );
  const [editableData, setEditableData] = useState<Partial<ProcessedData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [ccRecipients, setCcRecipients] = useState<Staff[]>([]);
  const [isCcOpen, setIsCcOpen] = useState(false);
  const [ccSearchTerm, setCcSearchTerm] = useState("");
  // --- ADDED: State for AI Summary visibility ---
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);

  useEffect(() => {
    if (state?.formData?.apiResponse) {
      processIncidentData();
    } else {
      navigate("/employee/submit");
    }

    const fetchStaff = async () => {
      try {
        const staff = await getStaffList();
        setStaffList(staff);
      } catch (err) {
        setSubmissionError("Could not load staff list for assignment.");
      }
    };
    fetchStaff();
  }, [state, navigate]);

  const processIncidentData = () => {
    const { apiResponse, description, reportedBy } = state.formData;
    const data: ProcessedData = {
      staffId: apiResponse.staff_assignment.assigned_staff_id,
      staffName: apiResponse.staff_assignment.assigned_staff_name,
      email: apiResponse.classification.email,
      title: apiResponse.classification.title,
      department: apiResponse.staff_assignment.assigned_department,
      category: apiResponse.classification.category,
      description,
      summary: apiResponse.classification.summary,
      priority: apiResponse.classification.severity,
      staffEmail: apiResponse.staff_assignment.assigned_staff_email,
      reportedByEmail: reportedBy.email,
      reportedByName: reportedBy.name,
      reportedById: reportedBy.id,
    };
    setProcessedData(data);
    setEditableData(data);
    setIsProcessing(false);
  };

  const selectedStaffDetails = useMemo(() => {
    return staffList.find((s) => s.cr6dd_staff1id === editableData.staffId);
  }, [editableData.staffId, staffList]);

  const handleInputChange = (field: keyof ProcessedData, value: string) => {
    setEditableData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegenerate = async () => {
    if (!editableData.summary || !editableData.email) return;
    setIsRegenerating(true);
    setSubmissionError(null);
    try {
      const payload = {
        summary: editableData.summary,
        email: editableData.email,
      };
      const response = await regenerateIncident(payload);
      setEditableData((prev) => ({ ...prev, email: response.email }));
    } catch (err: any) {
      setSubmissionError(err.message || "Failed to regenerate email.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return null;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "unsigned_preset");
    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dimlhmtd6/image/upload",
        data
      );
      return res.data.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      throw new Error("Failed to upload image.");
    }
  };

  const handleConfirm = async () => {
    if (!editableData || !user || !selectedStaffDetails) {
      setSubmissionError(
        "Cannot submit. Critical information is missing or invalid."
      );
      return;
    }
    setIsSubmitting(true);
    setSubmissionError(null);
    try {
      const attachmentUrl = await handleUpload();

      const payload: IncidentConfirmationPayloads = {
        incident: {
          Title: editableData.title!,
          Description: editableData.description!,
          Status: "New",
          DepartmentType: editableData.department!, // Use editable department
          AssignedResolverGUID: selectedStaffDetails.cr6dd_staff1id,
          ReportedByGUID: editableData.reportedById!,
          ResolverEmail: selectedStaffDetails.cr6dd_UserID.cr6dd_email,
          ReporterEmail: editableData.reportedByEmail!,
          ReporterName: editableData.reportedByName!,
          ResolverName: selectedStaffDetails.cr6dd_UserID.cr6dd_name,
          Severity: editableData.priority!,
          descriptionSummary: editableData.summary!,
          emailDraft: editableData.email!,
          imageUrl: attachmentUrl,
        },
      };

      const response = await confirmIncident(payload);
      navigate(`/employee/confirmation/${response.incidentId}`, {
        state: {
          ticketId: response.incidentId,
          processedData: {
            ...editableData,
            staffName: selectedStaffDetails.cr6dd_UserID.cr6dd_name,
          },
          attachmentUrl: attachmentUrl,
        },
      });
    } catch (err: any) {
      setSubmissionError(
        err.message || "Failed to submit incident. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStaffList = useMemo(() => {
    return staffList.filter(
      (staff) =>
        staff.cr6dd_UserID.cr6dd_name
          .toLowerCase()
          .includes(ccSearchTerm.toLowerCase()) &&
        !ccRecipients.some((r) => r.cr6dd_staff1id === staff.cr6dd_staff1id) &&
        staff.cr6dd_staff1id !== editableData.staffId
    );
  }, [ccSearchTerm, staffList, ccRecipients, editableData.staffId]);

  if (isProcessing || !processedData) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-50 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-gray-900 overflow-auto">
      <div className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate("/employee/submit")}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Review & Confirm Notification
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Review AI-processed information before submission
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              {/* --- RESTORED: AI Summary section with toggle button --- */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-900/80 rounded-lg text-blue-600 dark:text-blue-300">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    AI Analysis & Assignment
                  </h2>
                </div>
                <button
                  onClick={() => setIsSummaryVisible(!isSummaryVisible)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <FileText className="w-4 h-4" />
                  {isSummaryVisible ? "Hide" : "View"} AI Summary
                </button>
              </div>
              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isSummaryVisible
                    ? "grid-rows-[1fr] opacity-100 pt-4"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden bg-gray-100 dark:bg-gray-700/50 p-3 rounded-md">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {processedData.summary}
                  </p>
                </div>
              </div>

              <dl className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">Category</dt>
                  <dd className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mt-1">
                    <Tag className="w-3.5 h-3.5" />
                    {processedData.category}
                  </dd>
                </div>
                <div>
                  <label
                    htmlFor="priority"
                    className="text-gray-500 dark:text-gray-400 font-medium"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={editableData.priority || ""}
                    onChange={(e) =>
                      handleInputChange("priority", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-100 dark:bg-gray-700/50 px-2 py-1 text-sm text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="department"
                    className="text-gray-500 dark:text-gray-400 font-medium"
                  >
                    Assigned Team
                  </label>
                  <select
                    id="department"
                    value={editableData.department || ""}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-100 dark:bg-gray-700/50 px-2 py-1 text-sm text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option>IT Support</option>
                    <option>HR Request</option>
                    <option>Facilities</option>
                    <option>Finance</option>
                  </select>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">
                    Assigned Agent
                  </dt>
                  <dd className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 mt-1">
                    <User className="w-3.5 h-3.5" />
                    {selectedStaffDetails?.cr6dd_UserID.cr6dd_name || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-16 text-right">
                  To:
                </span>
                <select
                  value={editableData.staffId}
                  onChange={(e) => handleInputChange("staffId", e.target.value)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700/50 px-3 py-2 rounded-md text-sm text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {/* --- ENHANCED: Display name and email in 'To' field --- */}
                  {staffList.map((staff) => (
                    <option
                      key={staff.cr6dd_staff1id}
                      value={staff.cr6dd_staff1id}
                    >
                      {staff.cr6dd_UserID.cr6dd_name} (
                      {staff.cr6dd_UserID.cr6dd_email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-16 text-right">
                  From:
                </span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-700/50 px-3 py-2 rounded-md text-sm text-gray-800 dark:text-gray-200">
                  {user?.name} ({user?.email})
                </div>
              </div>
              <div>
                <div className="flex items-start gap-4">
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 w-16 text-right pt-2">
                    CC:
                  </span>
                  <div className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md flex flex-wrap gap-2 items-center min-h-[40px]">
                    {ccRecipients.map((staff) => (
                      <div
                        key={staff.cr6dd_staff1id}
                        className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium pl-2 pr-1 py-0.5 rounded-full"
                      >
                        <span>{staff.cr6dd_UserID.cr6dd_name}</span>
                        <button
                          onClick={() =>
                            setCcRecipients(
                              ccRecipients.filter(
                                (r) => r.cr6dd_staff1id !== staff.cr6dd_staff1id
                              )
                            )
                          }
                          className="p-0.5 hover:bg-black/10 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <div className="relative">
                      {/* --- FIXED: CC Add button color --- */}
                      <button
                        onClick={() => setIsCcOpen(!isCcOpen)}
                        className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      >
                        <PlusCircle className="w-4 h-4" /> Add
                      </button>
                      {isCcOpen && (
                        <div className="absolute top-full mt-2 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10">
                          <input
                            type="text"
                            placeholder="Search staff..."
                            value={ccSearchTerm}
                            onChange={(e) => setCcSearchTerm(e.target.value)}
                            className="w-full text-left px-3 py-2 text-gray-900 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                          />
                          <ul className="max-h-48 overflow-y-auto">
                            {filteredStaffList.length > 0 ? (
                              filteredStaffList.map((staff) => (
                                <li key={staff.cr6dd_staff1id}>
                                  <button
                                    onClick={() => {
                                      setCcRecipients([...ccRecipients, staff]);
                                      setIsCcOpen(false);
                                      setCcSearchTerm("");
                                    }}
                                    // ADDED text colors for the button itself
                                    className="w-full text-left px-3 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  >
                                    <p className="font-semibold">
                                      {staff.cr6dd_UserID.cr6dd_name}
                                    </p>
                                    {/* CORRECTED the email color for dark mode */}
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {staff.cr6dd_UserID.cr6dd_email}
                                    </p>
                                  </button>
                                </li>
                              ))
                            ) : (
                              // CORRECTED the "No staff" color for dark mode
                              <li className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                                No staff found.
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <input
                  type="text"
                  value={editableData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full text-lg font-bold bg-transparent text-gray-900 dark:text-white focus:outline-none py-1 border-b border-gray-200 dark:border-gray-700 focus:border-blue-500"
                  placeholder="Email Subject"
                />
              </div>
              <div className="pt-2">
                <textarea
                  value={editableData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full h-64 p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none"
                />
              </div>

              <div className="pt-2">
                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 block">
                  Attachment
                </label>
                {file ? (
                  <div className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Attachment Preview"
                      className="h-16 w-16 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2">
                    No attachment was provided.
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating || isSubmitting}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      isRegenerating ? "animate-spin" : ""
                    }`}
                  />
                  Regenerate with AI
                </button>
              </div>
              {submissionError && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                  <AlertTriangle className="w-4 h-4" />
                  {submissionError}
                </p>
              )}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={handleConfirm}
                disabled={isSubmitting || isRegenerating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 disabled:transform-none disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating Ticket...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Send & Create Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentConfirmation;