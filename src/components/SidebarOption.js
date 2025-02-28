import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SidebarOption({ path, icon, text }) {
  const navigate = useNavigate();

  return (
    <div
      className="w-full flex items-center text-gray-700 h-10 pl-4 hover:bg-gray-200 rounded-lg cursor-pointer mb-2"
      onClick={() => navigate(path)}
    >
      {icon}
      <span className="ml-2">{text}</span>
    </div>
  );
} 