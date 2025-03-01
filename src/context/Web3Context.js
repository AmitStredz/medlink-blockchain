import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { UPLOAD_CONTRACT_ADDRESS, UPLOAD_CONTRACT_ABI } from '../utils/constants';

const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [account, setAccount] = useState(null);
    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [doctor, setDoctor] = useState(null);
    const [error, setError] = useState(null);

    const getDoctorData = async (address, contract) => {
        try {
            console.log("Fetching doctor data for:", address);
            const data = await contract.doctors(address);
            console.log("Raw doctor data:", data);
            
            if (data && data.isRegistered) {
                return {
                    address: address,
                    name: data.name,
                    specialization: data.specialization,
                    licenseNumber: data.licenseNumber,
                    isRegistered: data.isRegistered
                };
            }
            return null;
        } catch (error) {
            console.error("Error fetching doctor data:", error);
            return null;
        }
    };

    const connectWallet = async () => {
        try {
            setError(null);
            setLoading(true);
            
            if (!window.ethereum) {
                throw new Error("Please install MetaMask!");
            }

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            
            const contract = new ethers.Contract(
                UPLOAD_CONTRACT_ADDRESS,
                UPLOAD_CONTRACT_ABI,
                signer
            );

            setAccount(accounts[0]);
            setContract(contract);
            setProvider(provider);

            // Check if the wallet is registered as a doctor
            const doctorData = await getDoctorData(accounts[0], contract);
            console.log("Processed doctor data:", doctorData);
            setDoctor(doctorData);

        } catch (error) {
            console.error("Connection error:", error);
            setError(error.message || "Failed to connect wallet");
        } finally {
            setLoading(false);
        }
    };

    // Handle account changes
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    if (contract) {
                        const doctorData = await getDoctorData(accounts[0], contract);
                        setDoctor(doctorData);
                    }
                } else {
                    setAccount(null);
                    setDoctor(null);
                }
            });

            window.ethereum.on("chainChanged", () => {
                window.location.reload();
            });
        }

        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", () => {});
                window.ethereum.removeListener("chainChanged", () => {});
            }
        };
    }, [contract]);

    // Initial check for connected account
    useEffect(() => {
        const checkConnection = async () => {
            try {
                if (window.ethereum) {
                    const accounts = await window.ethereum.request({
                        method: "eth_accounts",
                    });
                    if (accounts.length > 0) {
                        await connectWallet();
                    }
                }
            } catch (error) {
                console.error("Initial connection check error:", error);
            } finally {
                setLoading(false);
            }
        };

        checkConnection();
    }, []);

    return (
        <Web3Context.Provider value={{
            connectWallet,
            account,
            contract,
            provider,
            loading,
            doctor,
            error
        }}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    return useContext(Web3Context);
} 