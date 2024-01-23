import axios from "axios";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { BASE_URL } from "../../..";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const validationSchema = z.object({
  month: z.string().min(1, "Select month is required"),
  bank: z.string().min(1, "Select bank is required"),
  file: typeof window === "undefined" ? z.any() : z.instanceof(File),
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

const BankWiseData = () => {
  const [banks, setBanks] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  const [file, setFile] = useState(null);
  const [isMobile, setIsMobile] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${BASE_URL}/get-bank`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBanks(response.data.banks);
      })
      .catch((error) => {
        console.error("Error fetching banks:", error);
      });
  }, [token]);

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(
        `${BASE_URL}/upload-bank-wise-data`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("API Response:", response.data);
      toast.success("Form submitted successfully");
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log({ file });
    setFile(file);
    setValue("file", file);
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
    <form
      className={` ${
        isMobile ? "flex flex-col p-5" : "p-4 grid grid-cols-2 gap-4"
      }`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="mb-4">
        <label className="block text-sm font-medium text-black">
          Select Month
          <span className="text-red-600 ">*</span>
        </label>
        <Select
          onChange={(selectedOption) => {
            setValue("month", selectedOption.value);
          }}
          options={monthsArray.map((month) => ({
            value: month.value,
            label: month.label,
          }))}
          className={`mt-1 p-2 border rounded-md ${
            errors.month ? "border-red-500" : ""
          }`}
        />

        {errors.month && (
          <span className="text-red-500 text-xs">{errors.month.message}</span>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          Bank Name
          <span className="text-red-600 ">*</span>
        </label>
        <Select
          onChange={(selectedOption) => {
            setValue("bank", selectedOption.value);
          }}
          options={banks.map((bank) => ({
            value: bank.bankName,
            label: bank.bankName,
          }))}
          className={`mt-1 p-2 border rounded-md ${
            errors.bank ? "border-red-500" : ""
          }`}
        />
        {errors.bank && (
          <span className="text-red-500 text-xs">{errors.bank.message}</span>
        )}
      </div>

      <div className="my-4">
        <label htmlFor="file" className="block text-sm font-medium text-black">
          Choose file to upload
          <span className="text-red-600">*</span>
        </label>
        <input
          type="file"
          id="file"
          name="file"
          accept=".xls, .xlsm, .xlsx, .csv, .txt"
          className="mt-1 p-2 border rounded-md w-full"
          onChange={(e) => handleFileChange(e)}
        />
        {errors.file && (
          <span className="text-red-500 text-xs">{errors.file.message}</span>
        )}
      </div>

      <button
        disabled={isSubmitting}
        className="col-span-2 h-10 bg-blue-500 text-white rounded-md uppercase hover:opacity-95 disabled:opacity-85 w-full"
      >
        {isSubmitting ? "Please Wait..." : "Submit"}
      </button>
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
    </form>
  );
};

export default BankWiseData;
