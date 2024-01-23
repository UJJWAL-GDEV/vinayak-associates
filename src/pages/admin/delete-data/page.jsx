// src/components/DeleteData.js
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../..";

// Define the Zod schema
const schema = z.object({
  month: z.string().min(1, "month is required").max(3, "month is required"),
  bank: z.array(
    z.string().min(1, "Bank Name is required"),
    "Bank Name is required"
  ),
  branch: z.array(
    z.string().min(1, "Branch is required"),
    "Bank Name is required"
  ),
  callCenter: z.array(z.string().min(1, "Call Center is required")),
});

const monthsArray = [
  { label: "January", value: "Jan" },
  { label: "February", value: "Feb" },
  { label: "March", value: "Mar" },
  { label: "April", value: "Apr" },
  { label: "May", value: "May" },
  { label: "June", value: "Jun" },
  { label: "July", value: "Jul" },
  { label: "August", value: "Aug" },
  { label: "September", value: "Sep" },
  { label: "October", value: "Oct" },
  { label: "November", value: "Nov" },
  { label: "December", value: "Dec" },
];

const DeleteData = () => {
  const {
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    clearErrors,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };
  const [isMobile, setIsMobile] = useState(true);
  const [data, setData] = useState({
    bankNameArray: [],
    branchNameArray: [],
    callCenterNoArray: [],
    totalRecords: "",
  });
  const token = localStorage.getItem("token");

  const values = getValues();

  const fetchDeleteDetails = (isMonth) => {
    const values = getValues();

    let url = `${BASE_URL}/details?month=${values.month}`;
    if (values.bank && values.bank.length > 0) {
      url += `&bank=${values.bank.join(",")}`;
    }
    if (values.branch && values.branch.length > 0) {
      url += `&branch=${values.branch.join(",")}`;
    }
    if (values.callCenter && values.callCenter.length > 0) {
      url += `&callCenter=${values.callCenter.join(",")}`;
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        const data = res.data.data;
        const totalRecords = res.data.totalRecords;
        const bankNameSet = new Set();
        const branchNameSet = new Set();
        const callCenterNoSet = new Set();

        // Iterate through the data array
        data.forEach((entry) => {
          // Extract values and add them to respective sets
          bankNameSet.add(entry.bankName);
          branchNameSet.add(entry.branch);
          callCenterNoSet.add(entry.callCenterNo1);
        });

        // Convert sets to arrays
        const bankNameArray = [...bankNameSet];
        const branchNameArray = [...branchNameSet];
        const callCenterNoArray = [...callCenterNoSet];

        setData((prev) =>
          isMonth
            ? {
                bankNameArray,
                branchNameArray,
                callCenterNoArray,
                totalRecords,
              }
            : { ...prev, totalRecords }
        );
      })
      .catch((error) => {
        console.error("Error fetching banks:", error);
      });
  };

  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    // Check screen width on component mount
    checkScreenWidth();

    // Attach event listener for changes in screen width
    window.addEventListener("resize", checkScreenWidth);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <>
      <h2 className="text-2xl px-6 sm:px-[40%] font-semibold mb-6">
        Delete Data
      </h2>
      <form
        className={`${
          isMobile
            ? "flex flex-col p-5"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        } w-full`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label
            htmlFor="month"
            className="block text-gray-600 text-sm font-semibold mb-2"
          >
            Month
          </label>
          <Select
            onChange={(selectedOption) => {
              setValue("month", selectedOption.value);
              setValue("bank", []);
              setValue("callCenter", []);
              setValue("branch", []);
              clearErrors("month");
              fetchDeleteDetails(true);
            }}
            options={monthsArray.map((month) => ({
              value: month.value,
              label: month.label,
            }))}
            className={`border rounded-md ${
              errors.month ? "border-red-500" : ""
            }`}
          />

          {errors.month && (
            <span className="text-red-500 text-sm">{errors.month.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="bank"
            className="block text-gray-600 text-sm font-semibold mb-2"
          >
            Bank
          </label>
          <Select
            name="bank"
            onChange={(selectedOption) => {
              setValue(
                "bank",
                selectedOption.map((sel) => sel.value)
              );
              clearErrors("bank");
              fetchDeleteDetails(false);
            }}
            value={values.bank?.map((bank) => ({ value: bank, label: bank }))}
            options={data.bankNameArray?.map((bank) => ({
              value: bank,
              label: bank,
            }))}
            isMulti
            className={`border rounded-md ${
              errors.month ? "border-red-500" : ""
            }`}
          />
          {errors.bank && (
            <span className="text-red-500 text-sm">{errors.bank.message}</span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="branch"
            className="block text-gray-600 text-sm font-semibold mb-2"
          >
            Branch
          </label>
          <Select
            onChange={(selectedOption) => {
              setValue(
                "branch",
                selectedOption.map((sel) => sel.value)
              );
              clearErrors("branch");
              fetchDeleteDetails(false);
            }}
            value={values.branch?.map((bank) => ({ value: bank, label: bank }))}
            options={data.branchNameArray?.map((bank) => ({
              value: bank,
              label: bank,
            }))}
            isMulti
            className={`border rounded-md ${
              errors.branch ? "border-red-500" : ""
            }`}
            name="branch"
          />
          {errors.branch && (
            <span className="text-red-500 text-sm">
              {errors.branch.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="callCenter"
            className="block text-gray-600 text-sm font-semibold mb-2"
          >
            Call Center
          </label>
          <Select
            name="callCenter"
            onChange={(selectedOption) => {
              setValue(
                "callCenter",
                selectedOption.map((sel) => sel.value)
              );
              clearErrors("callCenter");
              fetchDeleteDetails(false);
            }}
            value={values.callCenter?.map((bank) => ({
              value: bank,
              label: bank,
            }))}
            options={data.callCenterNoArray?.map((bank) => ({
              value: bank,
              label: bank,
            }))}
            isMulti
            className={`border rounded-md ${
              errors.callCenter ? "border-red-500" : ""
            }`}
          />
          {errors.callCenter && (
            <span className="text-red-500 text-sm">
              {errors.callCenter.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="totalRecords"
            className="block text-gray-600 text-sm font-semibold mb-2"
          >
            Total Records
          </label>
          <input
            value={data.totalRecords}
            disabled
            name="totalRecords"
            className={`border rounded-md h-10 p-4`}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 my-3 px-4 col-span-3
           rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default DeleteData;
