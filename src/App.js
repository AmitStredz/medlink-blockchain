import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Main from "./main";

import Login from "./components/login";
// import { Web3Provider } from "./context/Web3Context";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./components/signup";

import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const [contract, setContract] = useState();
  const [provider, setProvider] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState();

  const connectWallet = async () => {
    let provider;
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log("1");
      const network = await provider.getNetwork();
      console.log(network);
    } else {
      console.log("Ethereum provider not found");
      return;
    }

    const loadProvider = async () => {
      console.log("3");

      if (provider) {
        await provider.send("eth_requestAccounts", []);
        console.log("Request accepted...");
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        console.log("Wallet connected: ", address);

        let contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        console.log(contract);

        setContract(contract);
        setProvider(provider);
      } else {
        alert("Please install MetaMask!");
        console.log("Please install MetaMask!");
      }
    };

    provider && loadProvider();
  };

  useEffect(() => {
    connectWallet();
  }, []);

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });

  window.ethereum.on("accountsChanged", (_chainid) => {
    window.location.reload();
  });

  return (
    <AuthProvider>
      {/* <Web3Provider> */}
      {/* <Router> */}
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              contract={contract}
              walletAddress={walletAddress}
              provider={provider}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              contract={contract}
              walletAddress={walletAddress}
              provider={provider}
            />
          }
        />
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
      {/* </Web3Provider> */}
    </AuthProvider>
  );
}

export default App;
