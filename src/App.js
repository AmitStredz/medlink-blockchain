import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Main from "./main";

import Login from "./components/login";

function App() {
  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Function to handle login
  const handleLogin = () => {
    console.log("logged in...");
    localStorage.setItem("isAuthenticated", true);
    setIsAuthenticated(true); // Set authentication to true when the user logs in
  };

  // Function to handle logout (optional)
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    navigate("/");
    setIsAuthenticated(false); // Reset authentication when the user logs out
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthProvider>
      {/* <Router> */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
        </Routes>
      {/* </Router> */}
    </AuthProvider>
  );
}

export default App;
