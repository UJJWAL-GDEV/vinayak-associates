import { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch as SearchIcon } from "react-icons/fa"; // Assuming FaSearch is the icon you want to use
import { BASE_URL } from "../../..";

import CustomTable from "../../../components/utils/CustomTable2";

const ConfirmationVehicleList = () => {
  const [data, setData] = useState({ data: [], totalPages: 0 });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const columns = [
    { Header: "Ser. No.", accessor: "_id" },
    { Header: "Regd. No.", accessor: "regNo" },
    { Header: "Customer Name", accessor: "customerName" },
    { Header: "Bank Name", accessor: "bankName" },
    { Header: "Branch", accessor: "branch" },
    { Header: "Agreement No.", accessor: "agreementNo" },
    { Header: "Engine No.", accessor: "engineNo" },
    { Header: "Chasis No.", accessor: "chasisNo" },
    { Header: "Seezer Name", accessor: "seezerId.name" },
  ];
  const token = localStorage.getItem("token");

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
          `${BASE_URL}/confirmation-vehicle-list?page=${page}&search=${search}`,
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

    fetchDataFromAPI();
  }, [search, page, token]);

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

export default ConfirmationVehicleList;
