import axios from "axios";
import React, { useState } from "react";
import { FaCheckCircle, FaFileMedical, FaFileUpload } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { MdTitle, MdLink, MdCategory } from "react-icons/md";

const AddReportModal = ({ id, onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    record_type: "",
  });

  const recordTypes = [
    { value: "diagnoses", label: "Diagnosis Report" },
    { value: "medications", label: "Medication Record" },
    { value: "labresult", label: "Laboratory Result" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    if (!id) {
      alert("Patient ID not found...");
      setIsLoading(false);
      return;
    }

    const data = {
      id: id,
      ...formData,
    };

    try {
      const response = await axios.post(
        "https://medconnect-co7la.ondigitalocean.app/api/records/",
        data
      );

      if (response?.data) {
        setSuccessModal(true);
        onSuccess();
        setTimeout(() => {
          setSuccessModal(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("Failed to add report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center animate-fade-in shadow-xl max-w-md w-full mx-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FaCheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Report Added Successfully!
          </h3>
          <p className="text-gray-500 text-center">
            The medical report has been added to the patient's records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-xl max-w-md w-full animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500 bg-opacity-10 flex items-center justify-center">
                <FaFileMedical className="text-blue-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Add Medical Report</h2>
                <p className="text-sm text-gray-500">Upload new patient record</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <IoClose size={24} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Report Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MdTitle className="text-gray-400" />
              Report Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 bg-white/50 backdrop-blur-sm"
              placeholder="Enter report name"
            />
          </div>

          {/* Report URL */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MdLink className="text-gray-400" />
              Report URL
            </label>
            <div className="relative">
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 bg-white/50 backdrop-blur-sm"
                placeholder="Enter report URL"
              />
              <FaFileUpload className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Record Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MdCategory className="text-gray-400" />
              Record Type
            </label>
            <select
              name="record_type"
              value={formData.record_type}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
            >
              <option value="" disabled>Select record type</option>
              {recordTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-[0.99] active:scale-[0.97] ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Adding Report...</span>
              </div>
            ) : (
              'Upload Report'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReportModal;
