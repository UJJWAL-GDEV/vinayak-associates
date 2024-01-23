import React, { useEffect, useState } from "react";
import _ from "lodash";
import { BASE_URL } from "../../..";

const SearchComponent = () => {
  const [searchParams, setSearchParams] = useState({
    lastDigit: "",
    agreementNo: "",
    engineNo: "",
    chasisNo: "",
  });
  console.log(searchParams);
  const [data, setData] = useState([]);

  const debouncedSearch = _.debounce(() => {
    const params = Object.entries(searchParams)
      .filter(([_, value]) => value !== "") // Filter out empty values
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const url = `${BASE_URL}/search-details?${params}`;
    // Perform the fetch request here
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Process the data as needed
        console.log(data);
        setData(data.data);
      })
      .catch((error) => console.error("Error:", error));
  }, 1000); // Adjust the debounce time as needed (in milliseconds)

  useEffect(() => {
    debouncedSearch();
  }, [searchParams, debouncedSearch]);

  const handleInputChange = (param, value) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      lastDigit: param === "lastDigit" ? value : "",
      agreementNo: param === "agreementNo" ? value : "",
      engineNo: param === "engineNo" ? value : "",
      chasisNo: param === "chasisNo" ? value : "",
    }));
  };
  const onSubmit = (e) => {
    e.preventDefault();

    debouncedSearch();
  };

  const [selectedLoan, setLoan] = useState({});

  return (
    <div className="">
      <form className=" grid grid-cols-4 gap-2" onSubmit={onSubmit}>
        <input
          className="mb-2 p-2 border rounded-lg"
          type="text"
          placeholder="Last Digit"
          value={searchParams.lastDigit}
          onChange={(e) => handleInputChange("lastDigit", e.target.value)}
        />
        <input
          className="mb-2 p-2 border rounded-lg"
          type="text"
          placeholder="Agreement No"
          value={searchParams.agreementNo}
          onChange={(e) => handleInputChange("agreementNo", e.target.value)}
        />
        <input
          className="mb-2 p-2 border rounded-lg"
          type="text"
          placeholder="Engine No"
          value={searchParams.engineNo}
          onChange={(e) => handleInputChange("engineNo", e.target.value)}
        />
        <input
          className="mb-2 p-2 border rounded-lg"
          type="text"
          placeholder="Chasis No"
          value={searchParams.chasisNo}
          onChange={(e) => handleInputChange("chasisNo", e.target.value)}
        />
        <button
          className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600 none hidden"
          type="submit"
        >
          Search
        </button>
      </form>

      <div className="w-full mt-3 grid grid-cols-1 md:grid-cols-3">
        <div className="py-4 border-solid border-4 mr-3 border-gray-800 rounded-lg flex flex-wrap justify-evenly gap-1 max-h-screen overflow-y-auto">
          {data.map((data, key) => (
            <span
              key={key}
              onClick={() => setLoan(data)}
              className="text-gray-100 bg-gray-800 font-medium h-10 px-3 py-2 rounded-lg cursor-pointer"
            >
              {data.regNo}
            </span>
          ))}
        </div>
        <div className="w-full col-span-1 md:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2  gap-3 w-full">
            {/* Display selected loan details in disabled input fields */}
            {selectedLoan && (
              <>
                <div className="mb-2">
                  <label className="font-medium text-black">Agreement No</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.agreementNo}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">Bank Name</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.bankName}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">Branch</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.branch}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">
                    Call Center No 1
                  </label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.callCenterNo1}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">
                    Call Center No 1 Name
                  </label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.callCenterNo1Name}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">
                    Call Center No 2
                  </label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.callCenterNo2}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">
                    Call Center No 2 Name
                  </label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.callCenterNo2Name}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">Chasis No</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.chasisNo}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">Created At</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.createdAt}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">
                    Customer Name
                  </label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.customerName}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">Engine No</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.engineNo}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">File Name</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.fileName}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">Last Digit</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.lastDigit}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">Load Status</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.loadStatus}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">Month</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.month}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">
                    Registration No
                  </label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.regNo}
                    disabled
                  />
                </div>

                <div className="mb-2">
                  <label className="font-medium text-black">Status</label>
                  <input
                    className="rounded-lg h-10 p-4"
                    type="text"
                    value={selectedLoan.status}
                    disabled
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchComponent;
