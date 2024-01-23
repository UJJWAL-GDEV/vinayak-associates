import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch as SearchIcon } from "react-icons/fa"; // Assuming FaSearch is the icon you want to use
import { BASE_URL } from "../../..";
import CustomTable from "../../../components/utils/CustomTable2";
import { useDispatch } from "react-redux";
import { setError, setMessage } from "../../../redux/user/userSlice";

const HoldVehicleList = () => {
  const [data, setData] = useState({ data: [], totalPages: 0 });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const columns = [
    { Header: "Regd. ID", accessor: "_id" },
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => (
        <div className="px-2 py-1 font-extrabold text-center border border-black rounded-lg">
          {value}
        </div>
      ),
    },
    {
      Header: "Release",
      Cell: ({ row }) => (
        <button
          onClick={() => handleRelease(row.original)}
          className="px-2 py-1 bg-green-500 rounded-lg text-white hover:bg-green-700"
        >
          Release
        </button>
      ),
    },
    {
      Header: "Repo",
      Cell: ({ row }) => (
        <button
          onClick={() => handleRepo(row.original)}
          className="px-2 py-1 bg-red-500 rounded-lg text-white hover:bg-red-700"
        >
          Repo
        </button>
      ),
    },
    { Header: "Regd. No.", accessor: "regNo" },
    { Header: "Customer Name", accessor: "customerName" },
    { Header: "Bank Name", accessor: "bankName" },
    { Header: "Branch", accessor: "branch" },
    { Header: "Agreement No.", accessor: "agreementNo" },
    { Header: "Engine No.", accessor: "engineNo" },
    { Header: "Chasis No.", accessor: "chasisNo" },
    { Header: "Seezer Name", accessor: "seezerId.name" },
  ];

  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const urlPage = parseInt(urlSearchParams.get("page")) || 1;
    const urlSearch = urlSearchParams.get("search") || "";

    setPage(urlPage);
    setSearch(urlSearch);
  }, []);

  const fetchDataFromAPI = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/hold-vehicle-list?page=${page}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData({
        data: response.data.vehiclesList,
        totalPages: response.data.totalPages,
      });

      const newUrl = `${window.location.pathname}?page=${page}${
        search ? `&search=${search}` : ""
      }`;
      window.history.pushState({ path: newUrl }, "", newUrl);
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        data: [],
        totalPages: 0,
      };
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, [search, page, token]);

  const handleRelease = async (data) => {
    console.log(data);
    try {
      const response = await axios.put(
        `${BASE_URL}/change-vehicle-status/${data._id}`,
        { status: "release" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data);
      dispatch(setMessage(response.data.message));
      fetchDataFromAPI();
    } catch (error) {
      console.error("API Request Error:", error);

      if (error.response) {
        console.error("Server responded with:", error.response.data.error);
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          "An Error occured. Please try Again!";
        dispatch(setError(errorMessage));
      } else if (error.request) {
        console.error("No response received:", error.request);
        dispatch(setError("Server didn't respond. Please try again!"));
      } else {
        console.error("Error setting up the request:", error.message);
        dispatch(setError("Something went wrong :("));
      }
    }
  };
  const handleRepo = async (data) => {
    console.log(data);
    try {
      const response = await axios.put(
        `${BASE_URL}/change-vehicle-status/${data._id}`,
        { status: "repo" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", response.data);
      dispatch(setMessage(response.data.message));
      fetchDataFromAPI();
    } catch (error) {
      if (error.response) {
        console.error("Server responded with:", error.response.data.error);
        const errorMessage =
          error.response.data.error ||
          error.response.data.message ||
          "An Error occured. Please try Again!";
        dispatch(setError(errorMessage));
      } else if (error.request) {
        console.error("No response received:", error.request);
        dispatch(setError("Server didn't respond. Please try again!"));
      } else {
        console.error("Error setting up the request:", error.message);
        dispatch(setError("Something went wrong :("));
      }
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="w-full sm:w-[70%] md:w-[50%]">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-300" />
          </span>
          <input
            type="text"
            className="border border-gray-300 w-full py-2 pl-10"
            placeholder="Search..."
            value={search || ""}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <CustomTable columns={columns} data={data.data} searchEnabled={true} />

      {/* pagination here */}
      <div className="flex justify-center items-center space-x-2">
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded"
          onClick={() => setPage(1)}
          disabled={page === 1}
        >
          1
        </button>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page <= 1}
        >
          {"<<"}
        </button>
        <p>{page}</p>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded"
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page >= data.totalPages}
        >
          {">>"}
        </button>
        <button
          className="bg-teal-500 text-white px-4 py-2 rounded"
          onClick={() => setPage(data.totalPages)}
          disabled={page === data.totalPages}
        >
          {data.totalPages}
        </button>
      </div>
    </div>
  );
};

export default HoldVehicleList;
