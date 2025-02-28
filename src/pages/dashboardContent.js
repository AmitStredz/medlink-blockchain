import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { FaUserMd, FaHospital, FaBriefcase, FaGraduationCap, FaUserInjured, FaCalendar, FaFileAlt, FaPrescriptionBottleAlt } from "react-icons/fa";
import { RiMentalHealthLine } from "react-icons/ri";
import { MdDateRange, MdVerified } from "react-icons/md";
import { IoMdPulse } from "react-icons/io";

export default function DashboardContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const { updateUserType } = useAuth();

  const fetchUserDetails = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const key = localStorage.getItem("key");

    if (!key) {
      alert("Authentication required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://medconnect-co7la.ondigitalocean.app/api/userProfile/`,
        {
          headers: {
            Authorization: `Token ${key}`,
          },
        }
      );

      if (response?.data) {
        setUserDetails(response.data);
        localStorage.setItem("user_type", response.data.user_type);
        localStorage.setItem("id", response.data.id);
        updateUserType(response.data.user_type);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <IoMdPulse className="text-5xl text-blue-500 animate-pulse" />
          <p className="text-gray-500">Loading your medical profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <FaUserMd className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {userDetails?.username}
              </h1>
              <p className="text-blue-100">
                {userDetails?.user_type === 'doctor' 
                  ? 'Your dedication to healthcare makes a difference every day'
                  : 'Your health is our priority'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <RiMentalHealthLine className="text-blue-500" />
              Professional Profile
            </h2>
            
            <div className="space-y-6">
              {/* Profile Items */}
              <ProfileItem
                icon={<FaUserMd className="text-blue-500" />}
                label="Full Name"
                value={userDetails?.username}
              />
              
              <ProfileItem
                icon={<FaHospital className="text-blue-500" />}
                label="Institution"
                value={userDetails?.institution_name}
              />
              
              <ProfileItem
                icon={<FaBriefcase className="text-blue-500" />}
                label="Experience"
                value={`${userDetails?.experience} Years`}
              />
              
              <ProfileItem
                icon={<FaGraduationCap className="text-blue-500" />}
                label="Specialization"
                value={userDetails?.specialisation}
              />
            </div>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Account Status */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <MdVerified className="text-blue-500" />
                Account Status
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">User Type</p>
                  <p className="font-semibold text-gray-800 capitalize">
                    {userDetails?.user_type}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500 mb-1">Member Since</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(userDetails?.date_joined).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <IoMdPulse className="text-blue-500" />
                {userDetails?.user_type === 'doctor' ? 'Practice Overview' : 'Health Overview'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getDashboardStats(userDetails?.user_type).map((stat, index) => (
                  <StatsCard
                    key={index}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    trend={stat.trend}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value || 'Not specified'}</p>
    </div>
  </div>
);

// Different stats for different user types
const getDashboardStats = (userType) => {
  switch(userType) {
    case 'doctor':
      return [
        {
          label: "Active Patients",
          value: "23",
          trend: "+5",
          icon: <FaUserInjured className="text-blue-500" />
        },
        {
          label: "Appointments Today",
          value: "8",
          trend: "+2",
          icon: <FaCalendar className="text-blue-500" />
        },
        {
          label: "Total Consultations",
          value: "156",
          trend: "+12",
          icon: <IoMdPulse className="text-blue-500" />
        }
      ];
    case 'student':
      return [
        {
          label: "Upcoming Appointments",
          value: "2",
          trend: "Next: Tomorrow",
          icon: <FaCalendar className="text-blue-500" />
        },
        {
          label: "Medical Records",
          value: "5",
          trend: "Updated 2d ago",
          icon: <FaFileAlt className="text-blue-500" />
        },
        {
          label: "Prescriptions",
          value: "3",
          trend: "Active",
          icon: <FaPrescriptionBottleAlt className="text-blue-500" />
        }
      ];
    default:
      return [];
  }
};

// Updated StatsCard component
const StatsCard = ({ icon, label, value, trend }) => (
  <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      <span className="text-sm text-green-500 mb-1">{trend}</span>
    </div>
  </div>
);
