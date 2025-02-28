import axios from "axios";
import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaUserPlus, FaCheckCircle } from "react-icons/fa";
import { MdPerson, MdCalendarToday, MdWc } from "react-icons/md";

const AddPatientModal = ({ onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    doctor: null,
  });

  useEffect(() => {
    const userId = localStorage.getItem("id");
    if (userId) {
      setFormData(prev => ({
        ...prev,
        doctor: parseInt(userId)
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !formData.doctor) return;
    setIsLoading(true);

    const key = localStorage.getItem("key");
    if (!key) {
      alert("Authentication required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://medconnect-co7la.ondigitalocean.app/api/patients/",
        formData,
        {
          headers: {
            Authorization: `Token ${key}`,
          },
        }
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
      console.error("Error adding patient:", error);
      alert("Failed to add patient. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (successModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center animate-fade-in shadow-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FaCheckCircle size={32} className="text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Patient Added Successfully!
          </h3>
          <p className="text-gray-500 text-center">
            The patient has been registered to your care.
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
                <FaUserPlus className="text-blue-500 text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">New Patient</h2>
                <p className="text-sm text-gray-500">Add patient to your care</p>
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
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MdPerson className="text-gray-400" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 bg-white/50 backdrop-blur-sm"
              placeholder="Enter patient's full name"
            />
          </div>

          {/* Age and Gender in one row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MdCalendarToday className="text-gray-400" />
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                max="150"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 bg-white/50 backdrop-blur-sm"
                placeholder="Age"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MdWc className="text-gray-400" />
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-800 bg-white/50 backdrop-blur-sm appearance-none cursor-pointer"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
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
                <span>Adding Patient...</span>
              </div>
            ) : (
              'Register Patient'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
