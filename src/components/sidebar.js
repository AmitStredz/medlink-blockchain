import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaUserInjured, FaCalendar, FaSignOutAlt } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { SiGooglegemini } from "react-icons/si";
import { RiPulseLine } from "react-icons/ri";

export default function Sidebar() {
  const navigate = useNavigate();
  const { userType, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = {
    doctor: [
      { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
      { icon: <FaUserInjured />, label: "Patients", path: "/patients" },
      { icon: <SiGooglegemini />, label: "AI Chat", path: "/ai-chat" },
      { icon: <MdPeopleAlt />, label: "Community", path: "/community" },
    ],
    patient: [
      { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
      { icon: <MdPeopleAlt />, label: "Community", path: "/community" },
    ],
  };

  const items = menuItems[userType] || menuItems.patient;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <RiPulseLine className="text-3xl text-blue-500" />
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            MedLink
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all group"
        >
          <FaSignOutAlt className="text-xl group-hover:scale-110 transition-transform" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
