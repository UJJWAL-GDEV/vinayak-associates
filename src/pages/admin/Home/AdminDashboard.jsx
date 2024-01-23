import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../..";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const token = localStorage.getItem("token");
  const Navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    totalCount: 0,
    holdCount: 0,
    repoCount: 0,
    releaseCount: 0,
    confirmationCount: 0,
  });

  useEffect(() => {
    axios
      .get(`${BASE_URL}/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setDashboardData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [token]);

  const handleButtonClick = (route) => {
    // Navigate to the specified route
    Navigate(route);
  };

  return (
    <div className="grid grid-flow-row sm:grid-cols-3 gap-8 p-4 object-contain ">
      <button
        onClick={() => handleButtonClick("/reports/all-vehicle-list")}
        className="dashboard-card bg-blue-500 text-white p-6 rounded-lg"
      >
        <span className="text-2xl font-bold mb-4">Total Count</span>
        <p className="text-lg">{dashboardData.totalCount}</p>
      </button>
      <button
        onClick={() => handleButtonClick("/reports/hold-vehicle-list")}
        className="dashboard-card bg-yellow-500 text-white p-6 rounded-lg"
      >
        <h3 className="text-2xl font-bold mb-4">Hold Count</h3>
        <p className="text-lg">{dashboardData.holdCount}</p>
      </button>
      <button
        onClick={() => handleButtonClick("/reports/repo-vehicle-list")}
        className="dashboard-card bg-red-600 text-white p-6 rounded-lg"
      >
        <h3 className="text-2xl font-bold mb-4">Repo Count</h3>
        <p className="text-lg">{dashboardData.repoCount}</p>
      </button>
      <button
        onClick={() => handleButtonClick("/reports/release-vehicle-list")}
        className="dashboard-card bg-green-500 text-white p-6 rounded-lg"
      >
        <h3 className="text-2xl font-bold mb-4">Release Count</h3>
        <p className="text-lg">{dashboardData.releaseCount}</p>
      </button>
      <button
        onClick={() => handleButtonClick("/reports/confirmation-vehicle-list")}
        className="dashboard-card bg-indigo-500 text-white p-6 rounded-lg"
      >
        <h3 className="text-2xl font-bold mb-4">Confirmation Count</h3>
        <p className="text-lg">{dashboardData.confirmationCount}</p>
      </button>
    </div>
  );
};

export default AdminDashboard;
