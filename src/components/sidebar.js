import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaHome, FaUserInjured, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { SiGooglegemini } from "react-icons/si";
import { RiPulseLine } from "react-icons/ri";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    // Initialize from localStorage or current path
    return localStorage.getItem('activeMenuItem') || location.pathname;
  });

  const menuItems = [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <SiGooglegemini />, label: "AI Chat", path: "/ai" },
    { icon: <FaUserInjured />, label: "Patients", path: "/patients" },
    { icon: <MdPeopleAlt />, label: "Community", path: "/community" },
  ];

  // Update activeItem when route changes
  useEffect(() => {
    setActiveItem(location.pathname);
    localStorage.setItem('activeMenuItem', location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('activeMenuItem');
    logout();
    navigate("/");
  };

  const handleNavigation = (path) => {
    setActiveItem(path);
    localStorage.setItem('activeMenuItem', path);
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative lg:w-60 z-[1000000]">
      <div className="fixed top-0 left-0">
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
      >
        {isOpen ? (
          <FaTimes className="text-xl text-gray-600" />
        ) : (
          <FaBars className="text-xl text-gray-600" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}


      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 right-0 z-40 w-screen lg:w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col h-screen`}
      >
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
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group
                  ${
                    activeItem === item.path
                      ? 'bg-blue-50 text-blue-500'
                      : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                  }`}
              >
                <span className={`text-xl group-hover:scale-110 transition-transform ${
                  activeItem === item.path ? 'scale-110' : ''
                }`}>
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
    </div>
    </div>
  );
}
