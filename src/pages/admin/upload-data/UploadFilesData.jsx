import { useState, useEffect } from "react";
import { BASE_URL } from "../../..";
import CustomTable from "../../../components/utils/CustomTable2";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSearch as SearchIcon } from "react-icons/fa"; // Assuming FaSearch is the icon you want to use

function UploadFilesData() {
  const [data, setData] = useState({ data: [], totalPages: 0 });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");

  const handleDelete = async (fileName) => {
    console.log(fileName);
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!userConfirmed) {
      return;
    }
    try {
      const response = await axios.delete(
        `${BASE_URL}/delete-by-fileName/${fileName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(`File ${fileName} deleted successfully`);
        toast.success(`File ${fileName} deleted successfully`);
        // fetchDataFromAPI();
      } else {
        console.error("Error deleting file. Unexpected response:", response);
        toast.error("Error deleting file.");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const urlPage = parseInt(urlSearchParams.get("page")) || 1;
    const urlSearch = urlSearchParams.get("search") || "";

    setPage(urlPage);
    setSearch(urlSearch);
  }, []);

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/get-data?page=${page}&search=${search}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData({
          data: response.data.data,
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

    fetchDataFromAPI();
  }, [search, page, token]);

  const columns = [
    { Header: "File Name", accessor: "fileName" },
    { Header: "Month", accessor: "month" },
    { Header: "Upload Date", accessor: "createdAt" },
    { Header: "Count", accessor: "count" },
    { Header: "Status", accessor: "status" },
    {
      Header: "Actions",

      Cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original.fileName)}
          className="px-2 py-1 bg-red-500 rounded-lg text-white hover:bg-red-700"
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="container bg-blue-400 text-white  mx-auto my-4">
      <h2 className="text-2xl font-bold mb-4">Files Information</h2>

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

export default UploadFilesData;
