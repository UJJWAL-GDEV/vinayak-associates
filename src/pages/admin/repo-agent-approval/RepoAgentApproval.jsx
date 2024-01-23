import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../..";
import axios from "axios";
import Pagination from "../../../components/utils/Pagination";
import CustomTable2 from "../../../components/utils/CustomTable2";
import { string, object } from "zod";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const newPasswordSchema = string().min(8);

function RepoAgentApproval() {
  const [repoAgents, setRepoAgents] = useState([]);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const apiUrl = `${BASE_URL}/get-all-repo-agents`;
  const token = localStorage.getItem("token");

  // const fetchData = async (currentPage) => {
  //   try {
  //     const response = await axios.get(`${apiUrl}/?page=${currentPage}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     setRepoAgents(response.data.agents);
  //     setTotalPages(response.data.totalPages);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };
  const fetchData = async (currentPage, search) => {
    try {
      const response = await axios.get(
        `${apiUrl}/?page=${currentPage}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRepoAgents(response.data.agents);
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        data: [],
        totalPages: 0,
      };
    }
  };

  const handleChangeDevice = async (data) => {
    console.log(data);
    try {
      const response = await axios.put(
        `${BASE_URL}/change-agent-device/${data._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error("API Request Error:", error);

      if (error.response) {
        console.error("Server responded with:", error.response.data.error);
        const errorMessage =
          error.response.data.error || "An Error occured. Please try Again!";
        toast.error(errorMessage);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Server didn't respond. Please try again!");
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("Something went wrong :(");
      }
    }
  };

  const handleAction = async (data) => {
    console.log(data);
    let state;

    data.status === "active"
      ? (state = { status: "inactive" })
      : (state = { status: "active" });

    try {
      const response = await axios.put(
        `${BASE_URL}/change-agent-status/${data._id}`,
        state,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchData();
      console.log("API Response:", response.data);
      toast.success(response.data.message);
    } catch (error) {
      console.error("API Request Error:", error);

      if (error.response) {
        console.error("Server responded with:", error.response.data.error);
        const errorMessage =
          error.response.data.error || "An Error occured. Please try Again!";
        toast.error(errorMessage);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Server didn't respond. Please try again!");
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("Something went wrong :(");
      }
    }
  };

  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleChangePassword = async () => {
    try {
      newPasswordSchema.parse(newPassword);
      setNewPasswordError("");
    } catch (error) {
      setNewPasswordError("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    } else {
      setConfirmPasswordError("");
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/change-agent-password/${selectedAgent._id}`,
        { password: newPassword, confirmPassword: confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data);
      handlePopupClose();
      toast.success(response.data.message);
    } catch (error) {
      console.error("API Request Error:", error);

      if (error.response) {
        console.error("Server responded with:", error.response.data.error);
        const errorMessage =
          error.response.data.error || "An Error occured. Please try Again!";
        toast.error(errorMessage);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Server didn't respond. Please try again!");
      } else {
        console.error("Error setting up the request:", error.message);
        toast.error("Something went wrong :(");
      }
    }
  };

  const handlePopupClose = () => {
    setShowPasswordPopup(false);
    setSelectedAgent(null);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    // const fetchData = async (currentPage, search) => {
    //   try {
    //     const response = await axios.get(
    //       `${apiUrl}/?page=${currentPage}&search=${search}`,
    //       {
    //         headers:{
    //           Authorization: `Bearer ${token}`
    //         }
    //       }
    //     );
    //     setRepoAgents(response.data.agents);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //     return {
    //       data: [],
    //       totalPages: 0,
    //     };
    //   }
    // };

    fetchData(currentPage, search);
  }, [search, currentPage]);

  useEffect(() => {
    // fetchData(currentPage);
  }, [apiUrl, currentPage]);

  const columns = [
    { Header: "Seezer Id", accessor: "agentId" },
    { Header: "Name", accessor: "name" },
    { Header: "Mobile No.", accessor: "mobile" },
    { Header: "Pan Card", accessor: "panCard" },
    { Header: "Aadhaar card", accessor: "aadharCard" },
    { Header: "Username", accessor: "username" },
    {
      Header: "Status",
      Cell: ({ row }) => (
        <div className="px-2 py-1 font-extrabold text-center border border-black rounded-lg">
          {row.original.status}
        </div>
      ),
    },
    {
      Header: "Action",
      Cell: ({ row }) => (
        <button
          onClick={() => handleAction(row.original)}
          className={`${
            row.original.status === "active"
              ? "bg-red-500 hover:bg-red-700"
              : "bg-green-500 hover:bg-green-700"
          }
          p-2 text-white  rounded-lg`}
        >
          {row.original.status === "active" ? "Deny" : "Accept"}
        </button>
      ),
    },
    {
      Header: "Change Device",
      Cell: ({ row }) => (
        <button
          onClick={() => handleChangeDevice(row.original)}
          className="px-1 py-1 bg-green-500 text-white hover:bg-green-700 rounded-lg"
        >
          Change Device
        </button>
      ),
    },
    {
      Header: "Change Password",
      Cell: ({ row }) => (
        <button
          onClick={() => {
            setSelectedAgent(row.original);
            setShowPasswordPopup(true);
          }}
          className="px-1 py-1 font-extrabold text-center border bg-white border-black hover:bg-slate-300 rounded-lg"
        >
          Change Password
        </button>
      ),
    },
  ];

  return (
    <div className="container bg-gray-600 text-white  my-4">
      <h2 className="text-2xl font-bold mb-4">Repo Agents Approval</h2>

      <div className="w-full h-full p-4">
        <div className="mb-10">
          <div className="relative  w-full ">
            <input
              type="text"
              className="border-0.5 p-2 m-2 rounded-xl border-gray-300"
              placeholder="Search..."
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <CustomTable2
          columns={columns}
          data={repoAgents}
          filterEnabled={false}
        />

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {showPasswordPopup && selectedAgent && (
        <div className="fixed top-0 left-[35%] max-w-md max-h-md flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <span
              className="close text-black text-2xl absolute top-2 right-2 cursor-pointer"
              onClick={handlePopupClose}
            >
              X
            </span>
            <h2 className="text-2xl text-black font-bold mb-4">
              Enter New Password
            </h2>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`mb-4 px-3 py-2 border rounded-md w-full ${
                newPasswordError ? "border-red-500" : ""
              }`}
            />
            {newPasswordError && (
              <p className="text-red-500 text-sm mb-2">{newPasswordError}</p>
            )}
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`mb-4 px-3 py-2 border rounded-md w-full ${
                confirmPasswordError ? "border-red-500" : ""
              }`}
            />
            {confirmPasswordError && (
              <p className="text-red-500 text-sm mb-2">
                {confirmPasswordError}
              </p>
            )}
            <button
              onClick={handleChangePassword}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Change Password
            </button>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default RepoAgentApproval;
