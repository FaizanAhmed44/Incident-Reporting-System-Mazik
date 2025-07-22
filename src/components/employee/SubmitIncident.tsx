import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, AlertCircle, Zap, Clock, Users, FileText, Image, X } from 'lucide-react';
import { submitIncident } from '../../api/incidentApi';
import { useAuth } from '../../contexts/AuthContext';
import CategoryDisplay from '../ui/CategoryDisplay';

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
        staff_skillset: string;
      };
    };
    attachment: File | null;
  };
}

const SubmitIncident: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        setAttachment(null);
        setError("Please select a valid image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setAttachment(null);
        setError("File size exceeds 5MB limit.");
        return;
      }
      setAttachment(file);
      setError(null);
    } else {
      setAttachment(null);
      setError(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitIncident({ description: formData.description });
      console.log("Incident submitted successfully:", response);

      if (
        response.staff_assignment?.assigned_department === "Unclassified" ||
        response.classification?.category === "Unclassified"
      ) {
        setShowPopup(true);
        setIsSubmitting(false);
        return;
      }

      navigate("/employee/incident-confirmation", {
        state: {
          formData: {
            description: formData.description,
            reportedBy: {
              email: user?.email,
              name: user?.name,
              id: user?.id,
            },
            apiResponse: response,
            attachment: attachment, // Pass the selected image
          },
        },
      });
    } catch (err: any) {
      setError(err.message || "Failed to submit incident. Please try again.");
      console.error("Submit incident error:", err);
    } finally {
      if (!showPopup) {
        setIsSubmitting(false);
      }
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClosePopup();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-4 rounded-2xl shadow-lg">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">Submit Incident</h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">Report an issue and get expert assistance</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Progress Indicator */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold">AI-Powered Processing</h3>
                    <p className="text-xs sm:text-sm text-blue-100">Intelligent routing and priority assignment</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {error}
                </div>
              )}

              {/* Description Field with Attachment Icon */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Description <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-3 sm:py-4 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="Please provide detailed information about the issue including:
• What happened?
• When did it occur?
• Steps to reproduce
• Error messages (if any)
• Impact on your work"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute bottom-2 right-2 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    title="Click to attach an image (max 5MB)"
                  >
                    <Image className="h-5 w-5" />
                  </button>
                  <input
                    id="attachment"
                    name="attachment"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                </div>
                
                <div className="mt-2 text-xs sm:text-sm text-gray-500">
                  {formData.description.length}/500 characters
                </div>
                {attachment && (
                  <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Image className="h-4 w-4 mr-2" />
                    <span>{attachment.name}</span>
                    <button
                      type="button"
                      onClick={handleRemoveAttachment}
                      className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      title="Remove attachment"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <CategoryDisplay />

              {/* AI Features Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 sm:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 sm:p-3 rounded-xl">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-2">
                      AI-Enhanced Processing
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">Automatic priority detection</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">Smart team assignment</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">Issue categorization</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-gray-700 dark:text-gray-300">Solution suggestions</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/employee")}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.description}
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2 sm:space-x-3 font-medium shadow-lg text-sm sm:text-base"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Processing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Continue</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {showPopup && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all duration-300 scale-100 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    Unable to Classify Incident
                  </h2>
                  <button
                    onClick={handleClosePopup}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    aria-label="Close popup"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                  Please provide a more appropriate description to help us classify your ticket.
                </p>
                <div className="text-center">
                  <button
                    onClick={handleClosePopup}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base font-semibold"
                    autoFocus
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <style>
          {`
            @keyframes fade-in {
              0% { opacity: 0; transform: scale(0.95); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default SubmitIncident;
