import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { FiExternalLink } from "react-icons/fi";
import { FaUserPlus, FaFileMedical, FaSearch, FaUserInjured } from "react-icons/fa";
import { MdVerified, MdCalendarToday, MdWc } from "react-icons/md";
import AddPatientModal from "../components/addPatientModal";
import AddReportModal from "../components/addReportModal";

export default function Patient() {
  const navigate = useNavigate();

  const [patientList, setPatientList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [addPatientModal, setAddPatientModel] = useState(false);
  const [addReportModel, setAddReportModel] = useState(false);
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
        `https://medconnect-co7la.ondigitalocean.app/api/patients/?search=${searchQuery}`,
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
        `https://medconnect-co7la.ondigitalocean.app/api/records/${patientId}`, // Passing patient_id as a query parameter
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

  return (
    <div className="p-6 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Patient Records</h1>
        <p className="text-gray-600">Manage and view your patient information</p>
      </div>

      {/* Search and Add Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search patients by name..."
            value={searchPatient}
            onChange={(e) => setSearchPatient(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <button
          onClick={() => setAddPatientModel(true)}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <FaUserPlus />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Patient List */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Patient List</h2>
            </div>
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">Loading patients...</div>
              ) : patientList.length > 0 ? (
                patientList.map((patient, index) => (
                  <div
                    key={index}
                    onClick={() => handlePatientClick(index)}
                    className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                      selectedPatient?.id === patient.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUserInjured className="text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{patient.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
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
                <div className="p-4 text-center text-gray-500">No patients found</div>
              )}
            </div>
          </div>
        </div>

        {/* Patient Details */}
        {selectedPatient ? (
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Patient Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <FaUserInjured className="text-blue-500 text-2xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{selectedPatient.name}</h2>
                      <div className="flex items-center gap-4 text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <MdCalendarToday />
                          {selectedPatient.age} years
                        </span>
                        <span className="flex items-center gap-1">
                          <MdWc />
                          {selectedPatient.gender}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setAddReportModel(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                  >
                    <FaFileMedical />
                    Add Report
                  </button>
                </div>
              </div>

              {/* Medical Records */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Medical Records</h3>
                <div className="space-y-4">
                  {patientDetails.length > 0 ? (
                    patientDetails.map((record, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-800">{record.name}</h4>
                            <p className="text-sm text-gray-500">{record.date}</p>
                          </div>
                          <a
                            href={record.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
                          >
                            View Report
                            <FiExternalLink />
                          </a>
                        </div>
                        <p className="text-gray-600 mb-3">{record.summary}</p>
                        {record.tags && (
                          <div className="flex flex-wrap gap-2">
                            {record.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      No medical records available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="text-center text-gray-500">
              <FaUserInjured className="text-6xl mx-auto mb-4 text-gray-300" />
              <p>Select a patient to view their details</p>
            </div>
          </div>
        )}
      </div>

      {addPatientModal && (
        <AddPatientModal
          onClose={() => setAddPatientModel(false)}
          onSuccess={() => fetchPatients()}
        />
      )}
      {addReportModel && (
        <AddReportModal
          id={selectedPatient?.id}
          onClose={() => setAddReportModel(false)}
          onSuccess={() => fetchPatientSummary(selectedPatient?.id)}
        />
      )}
    </div>
  );
}
