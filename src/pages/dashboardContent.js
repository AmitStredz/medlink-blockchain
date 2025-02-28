import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from '../context/AuthContext';
import { FaUserMd, FaHospital, FaBriefcase, FaGraduationCap, FaUserInjured, FaCalendar, FaFileAlt, FaPrescriptionBottleAlt, FaBell, FaChartLine, FaAward } from "react-icons/fa";
import { RiMentalHealthLine } from "react-icons/ri";
import { MdDateRange, MdVerified, MdClose, MdWarning, MdEmail, MdPhone } from "react-icons/md";
import { IoMdPulse } from "react-icons/io";
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function DashboardContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const { updateUserType } = useAuth();
  const [showAlerts, setShowAlerts] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');

  const fetchUserDetails = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const key = localStorage.getItem("key");

    if (!key) {
      alert("Authentication required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `https://medconnect-co7la.ondigitalocean.app/api/userProfile/`,
        {
          headers: {
            Authorization: `Token ${key}`,
          },
        }
      );

      if (response?.data) {
        setUserDetails(response.data);
        localStorage.setItem("user_type", response.data.user_type);
        localStorage.setItem("id", response.data.id);
        updateUserType(response.data.user_type);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Dummy alerts data
  const alerts = [
    {
      id: 1,
      patient: "John Doe",
      condition: "Diabetes",
      description: "High Blood Sugar - 250 mg/dL",
      timestamp: "15 Oct 2023, 10:30 AM",
      severity: "high"
    },
    {
      id: 2,
      patient: "Jane Smith",
      condition: "Hypertension",
      description: "Blood Pressure - 150/95 mmHg",
      timestamp: "15 Oct 2023, 09:45 AM",
      severity: "medium"
    },
    {
      id: 3,
      patient: "Robert Johnson",
      condition: "Diabetes",
      description: "Missed medication dose",
      timestamp: "14 Oct 2023, 08:15 PM",
      severity: "low"
    },
    {
      id: 4,
      patient: "Emily Wilson",
      condition: "Asthma",
      description: "Severe asthma attack reported",
      timestamp: "14 Oct 2023, 06:30 PM",
      severity: "high"
    }
  ];

  // Dummy doctor data
  const doctorDetails = {
    name: "Dr. Sarah Johnson",
    specialization: "Cardiologist",
    experience: "15+ years",
    hospital: "City General Hospital",
    email: "sarah.johnson@hospital.com",
    phone: "+1 (555) 123-4567",
    qualifications: "MD, FACC",
    patientCount: 248,
    rating: 4.9
  };

  // Chart data with fixed values
  const patientActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Patient Visits',
        data: [8, 12, 9, 11, 7, 5, 8],
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
        fill: false
      }
    ]
  };

  // Chart options to prevent auto-scaling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 15, // Fixed maximum value
        ticks: {
          stepSize: 3
        }
      }
    }
  };

  const conditionDistributionData = {
    labels: ['Diabetes', 'Hypertension', 'Asthma', 'Heart Disease', 'Others'],
    datasets: [
      {
        data: [35, 25, 15, 15, 10],
        backgroundColor: [
          'rgb(59, 130, 246)',
          'rgb(234, 88, 12)',
          'rgb(22, 163, 74)',
          'rgb(219, 39, 119)',
          'rgb(107, 114, 128)',
        ],
      }
    ]
  };

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const conditionMatch = selectedCondition === 'all' || alert.condition.toLowerCase() === selectedCondition.toLowerCase();
    return severityMatch && conditionMatch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <IoMdPulse className="text-5xl text-blue-500 animate-pulse" />
          <p className="text-gray-500">Loading your medical profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Doctor Profile Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-blue-500 rounded-2xl flex items-center justify-center">
                <FaUserMd className="text-4xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{doctorDetails.name}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <span>{doctorDetails.specialization}</span>
                  <span>•</span>
                  <span>{doctorDetails.experience}</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaHospital className="text-blue-500" />
                    <span>{doctorDetails.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaAward className="text-blue-500" />
                    <span>{doctorDetails.qualifications}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-gray-600">
                <MdEmail className="text-blue-500" />
                <span>{doctorDetails.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MdPhone className="text-blue-500" />
                <span>{doctorDetails.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <QuickStatCard
            title="Total Patients"
            value={doctorDetails.patientCount}
            icon={<FaUserInjured />}
            trend="+12%"
            color="blue"
          />
          <QuickStatCard
            title="Today's Visits"
            value="28"
            icon={<IoMdPulse />}
            trend="+3"
            color="green"
          />
          <QuickStatCard
            title="Critical Cases"
            value="5"
            icon={<MdWarning />}
            trend="-2"
            color="red"
          />
          <QuickStatCard
            title="Recovery Rate"
            value="94%"
            icon={<FaChartLine />}
            trend="+2%"
            color="indigo"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Activity Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Patient Visits</h2>
            <div className="h-[300px]">
              <Line data={patientActivityData} options={chartOptions} />
            </div>
          </div>

          {/* Condition Distribution Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Condition Distribution</h2>
            <div className="h-[300px] flex items-center justify-center">
              <Doughnut data={conditionDistributionData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        {/* Alerts Modal */}
        {showAlerts && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Alerts and Notifications</h2>
                  <button
                    onClick={() => setShowAlerts(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MdClose size={24} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="p-4 border-b border-gray-100 flex gap-4">
                <select
                  value={selectedSeverity}
                  onChange={(e) => setSelectedSeverity(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Severity</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Conditions</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="hypertension">Hypertension</option>
                  <option value="asthma">Asthma</option>
                </select>

                {(selectedSeverity !== 'all' || selectedCondition !== 'all') && (
                  <button
                    onClick={() => {
                      setSelectedSeverity('all');
                      setSelectedCondition('all');
                    }}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Clear Filters
                  </button>
                )}
              </div>

              {/* Alerts List */}
              <div className="overflow-y-auto max-h-[60vh]">
                {filteredAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-800">{alert.patient}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                        alert.severity === 'medium' ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{alert.condition}</p>
                    <p className="text-gray-800 mb-2">{alert.description}</p>
                    <p className="text-gray-500 text-sm">{alert.timestamp}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value || 'Not specified'}</p>
    </div>
  </div>
);

// Different stats for different user types
const getDashboardStats = (userType) => {
  switch(userType) {
    case 'doctor':
      return [
        {
          label: "Active Patients",
          value: "23",
          trend: "+5",
          icon: <FaUserInjured className="text-blue-500" />
        },
        {
          label: "Appointments Today",
          value: "8",
          trend: "+2",
          icon: <FaCalendar className="text-blue-500" />
        },
        {
          label: "Total Consultations",
          value: "156",
          trend: "+12",
          icon: <IoMdPulse className="text-blue-500" />
        }
      ];
    case 'student':
      return [
        {
          label: "Upcoming Appointments",
          value: "2",
          trend: "Next: Tomorrow",
          icon: <FaCalendar className="text-blue-500" />
        },
        {
          label: "Medical Records",
          value: "5",
          trend: "Updated 2d ago",
          icon: <FaFileAlt className="text-blue-500" />
        },
        {
          label: "Prescriptions",
          value: "3",
          trend: "Active",
          icon: <FaPrescriptionBottleAlt className="text-blue-500" />
        }
      ];
    default:
      return [];
  }
};

// Updated StatsCard component
const StatsCard = ({ icon, label, value, trend }) => (
  <div className="bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition-colors">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      <span className="text-sm text-green-500 mb-1">{trend}</span>
    </div>
  </div>
);

// Quick Stat Card Component
const QuickStatCard = ({ title, value, icon, trend, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    red: 'bg-red-50 text-red-500',
    indigo: 'bg-indigo-50 text-indigo-500',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
        <span className={`text-sm ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};
