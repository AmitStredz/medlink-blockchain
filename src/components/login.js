import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RiPulseLine } from "react-icons/ri";
import { FaUserMd, FaSpinner } from "react-icons/fa";

export default function Login({ contract, walletAddress }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [doctorData, setDoctorData] = useState(null);

  // Check doctor status when wallet or contract changes
  useEffect(() => {
    const checkDoctorStatus = async () => {
      if (!walletAddress || !contract) return;

      try {
        console.log("Checking doctor status for:", walletAddress);
        const data = await contract.doctors(walletAddress);
        console.log("Doctor data:", data);
        
        if (data && data.isRegistered) {
          setDoctorData(data);
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking doctor status:", error);
      }
    };

    checkDoctorStatus();
  }, [walletAddress, contract, navigate]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (!walletAddress) {
        setError("Please connect your wallet first");
        return;
      }

      if (!contract) {
        setError("Contract not initialized");
        return;
      }

      console.log("Checking doctor registration...");
      const doctorData = await contract.doctors(walletAddress);
      console.log("Doctor data:", doctorData);

      if (!doctorData.isRegistered) {
        setError("This wallet is not registered as a doctor. Please register first.");
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <RiPulseLine className="text-4xl text-blue-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              MediLink
            </h1>
          </div>
          <p className="text-gray-600">
            Secure Digital Health Records Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Welcome Back
          </h2>

          <div className="space-y-6">
            {/* Wallet Connection Status */}
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <FaUserMd className="text-gray-400" />
                <span className="text-gray-600">
                  {walletAddress 
                    ? `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` 
                    : "Not Connected"}
                </span>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading || !walletAddress}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login as Doctor"
                )}
              </button>

              {/* Registration Link */}
              <p className="text-sm text-gray-500 mt-4">
                Not registered yet?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  Register as Doctor
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
