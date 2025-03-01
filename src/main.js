import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Sidebar from "./components/sidebar";
import DashboardContent from "./pages/dashboardContent";
import Patient from "./pages/patient";
import Community from "./pages/community";
import AiAssistant from "./pages/aiAssistant";

export default function Main({ onLogout, contract, walletAddress, provider }) {
  return (
    <div className="flex h-full w-screen font-mono overflow-x-hidden">
      {/* <div className=""> */}
      <Sidebar />
      {/* </div> */}
      <div className="flex-1">
        <Routes>
          <Route
            path="/dashboard"
            element={
              <DashboardContent
                contract={contract}
                walletAddress={walletAddress}
                provider={provider}
              />
            }
          />
          <Route path="/patients" element={<Patient />} />
          <Route path="/community" element={<Community />} />
          <Route path="/ai" element={<AiAssistant />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />{" "}
          {/* Optional: Redirect to dashboard if route not found */}
        </Routes>
      </div>
    </div>
  );
}
