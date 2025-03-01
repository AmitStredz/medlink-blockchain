import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiPulseLine } from "react-icons/ri";
import { FaUserMd, FaSpinner } from "react-icons/fa";

export default function Signup({ contract, walletAddress }) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        specialization: '',
        licenseNumber: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!walletAddress) {
            setError('Please connect your wallet first');
            return;
        }

        try {
            setIsLoading(true);
            console.log("Registering doctor with data:", formData);
            
            const tx = await contract.registerDoctor(
                formData.name,
                formData.specialization,
                formData.licenseNumber
            );
            console.log("Transaction sent:", tx.hash);
            
            await tx.wait();
            console.log("Transaction confirmed");
            
            navigate('/dashboard');
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div className="divide-y divide-gray-200">
                            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                {/* Logo */}
                                <div className="text-center mb-8">
                                    <div className="flex items-center justify-center gap-2 mb-4">
                                        <RiPulseLine className="text-4xl text-blue-500" />
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                            MediLink
                                        </h1>
                                    </div>
                                </div>

                                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-800 mb-8 text-center">
                                    Doctor Registration
                                </h1>

                                {!walletAddress ? (
                                    <div className="text-center">
                                        <p className="text-gray-600 mb-4">
                                            Please connect your wallet to continue
                                        </p>
                                        <div className="flex items-center justify-center gap-2 text-gray-500">
                                            <FaUserMd />
                                            <span>Wallet not connected</span>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                                                placeholder="Enter your full name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Specialization
                                            </label>
                                            <input
                                                type="text"
                                                name="specialization"
                                                value={formData.specialization}
                                                onChange={handleChange}
                                                required
                                                className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                                                placeholder="Enter your specialization"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                License Number
                                            </label>
                                            <input
                                                type="text"
                                                name="licenseNumber"
                                                value={formData.licenseNumber}
                                                onChange={handleChange}
                                                required
                                                className="block w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                                                placeholder="Enter your medical license number"
                                            />
                                        </div>

                                        {error && (
                                            <p className="text-red-500 text-sm text-center">
                                                {error}
                                            </p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full px-6 py-3 rounded-lg text-white text-lg font-semibold 
                                                ${isLoading 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-blue-500 hover:bg-blue-600 transform transition-all duration-200 hover:scale-105'
                                                }`}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center">
                                                    <FaSpinner className="animate-spin h-5 w-5 mr-3" />
                                                    Registering...
                                                </div>
                                            ) : (
                                                'Register as Doctor'
                                            )}
                                        </button>

                                        {/* Login Link */}
                                        <p className="text-sm text-gray-500 text-center mt-4">
                                            Already registered?{" "}
                                            <button
                                                type="button"
                                                onClick={() => navigate("/login")}
                                                className="text-blue-500 hover:text-blue-600 font-medium"
                                            >
                                                Login here
                                            </button>
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
