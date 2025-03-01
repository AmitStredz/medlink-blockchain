import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { FaUserInjured, FaSearch, FaRobot, FaUserMd } from "react-icons/fa";
import { MdCalendarToday, MdWc } from "react-icons/md";

import AddPatientModal from "../components/addPatientModal";
import ChatBot from "../components/chatBot";

export default function AiAssistant() {
  const navigate = useNavigate();

  const [patientList, setPatientList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [addPatientModal, setAddPatientModel] = useState(false);
  const [searchPatient, setSearchPatient] = useState("");
  const [patientDetails, setPatientDetails] = useState([]);

  const [patientSummary, setPatientSummary] = useState("");
  const [patientTags, setPatientTags] = useState([]);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const fetchPatients = async (searchQuery = "") => {
    if (isLoading) return;
    setIsLoading(true);
    const key = localStorage.getItem("key");

    if (!key) {
      alert("Key not found...");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://medlink-zavgk.ondigitalocean.app/api/patients/?search=${searchQuery}`,
        {
          headers: {
            Authorization: `Token ${key}`,
          },
        }
      );

      if (response?.data) {
        setPatientList(response?.data);
      } else {
        setPatientList([]);
      }
    } catch (error) {
      console.log("Error occurred: ", error);
      alert("No Patient data found...");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchQuery) => fetchPatients(searchQuery), 500),
    []
  );

  useEffect(() => {
    if (searchPatient) {
      debouncedSearch(searchPatient);
    } else {
      fetchPatients();
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchPatient, debouncedSearch]);

  const fetchPatientSummary = async (patientId) => {
    setSummaryLoading(true);
    const key = localStorage.getItem("key");

    console.log("key: ", key);

    const data = {
      id: patientId,
    };
    console.log("data: ", data);

    try {
      const response = await axios.get(
        `https://medlink-zavgk.ondigitalocean.app/api/records/18`, // Passing patient_id as a query parameter
        {
          headers: {
            Authorization: `Token ${key}`, // Include the Authorization header
          },
        }
      );

      console.log("response:", response);

      console.log("responseData: ", response?.data);

      if (response?.data) {
        const data = response.data;
        setPatientDetails(data);
      }

      console.log("PatientDetails: ", patientDetails);

      setPatientSummary(response.data[0]?.summary || "Summary not available");
      setPatientTags(response?.data[0]?.tags);
    } catch (error) {
      console.log("Error fetching patient summary: ", error);
      setPatientSummary("Failed to fetch summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handlePatientClick = async (index) => {
    const selectedPatient = patientList[index];
    setSelectedPatient(selectedPatient);
    fetchPatientSummary(selectedPatient.id);
  };

  // Function to highlight matched text
  const highlightMatch = (name, query) => {
    if (!query) return name;
    const parts = name.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-blue-300 p-1">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
        {/* Left Panel - Patient Selection */}
        <div className="lg:w-1/3 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <FaRobot className="text-blue-500" />
              AI Assistant
            </h1>
            <p className="text-gray-600">Select a patient to start consultation</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search patients by name..."
              value={searchPatient}
              onChange={(e) => setSearchPatient(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
            />
          </div>

          {/* Patient List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <FaUserMd className="text-blue-500" />
                Patient List
              </h2>
            </div>
            
            <div className="divide-y divide-gray-100 overflow-y-auto h-full">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : patientList.length > 0 ? (
                patientList.map((patient, index) => (
                  <div
                    key={index}
                    onClick={() => handlePatientClick(index)}
                    className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedPatient?.id === patient.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <FaUserInjured className="text-blue-500 text-xl" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{patient.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <MdCalendarToday className="text-gray-400" />
                            {patient.age} years
                          </span>
                          <span className="flex items-center gap-1">
                            <MdWc className="text-gray-400" />
                            {patient.gender}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                  <FaUserInjured className="text-4xl mb-2 text-gray-300" />
                  <p>No patients found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="lg:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {selectedPatient ? (
            <ChatBot id={selectedPatient?.id} name={selectedPatient?.name} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FaRobot className="text-blue-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome to AI Assistant
              </h3>
              <p className="text-gray-500 max-w-md">
                Select a patient from the list to start an AI-powered consultation session.
                Get instant insights and medical recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
      {addPatientModal && (
        <AddPatientModal onClose={() => setAddPatientModel(false)} />
      )}
    </div>
  );
}
