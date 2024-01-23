import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import citiesData from "../../../Data/stateCityData (1).json";
import { BASE_URL } from "../../..";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialFormData = {
  name: "",
  mobile: "",
  alternativeMobile: "",
  email: "",
  panCard: "",
  aadharCard: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  pincode: "",
  username: "",
  password: "",
  photo: null, // or []
  signature: null, // or []
  aadhar: null, // or []
  pancard: null, // or []
  cheque: null, // or []
  licence: null,
  state: "",
};

const officeStaffSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z.string().min(1, "Mobile is required"),
  alternativeMobile: z.string().optional(),
  email: z.string().email().optional(),
  panCard: z.string().min(1, "PAN Card is required"),
  aadharCard: z.string().min(1, "Aadhar Card is required"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  photo: z
    .instanceof(FileList, "Photo is required")
    .refine((files) => files.length > 0, { message: "Photo is required" }),
  signature: z
    .instanceof(FileList, "Signature is required")
    .refine((files) => files.length > 0, { message: "Signature is required" }),
  aadhar: z
    .instanceof(FileList, "Aadhar card is required")
    .refine((files) => files.length > 0, {
      message: "Aadhar card is required",
    }),
  pancard: z
    .instanceof(FileList, "Pan card is required")
    .refine((files) => files.length > 0, { message: "Pan card is required" }),
  cheque: z
    .instanceof(FileList, "Cheque is required")
    .refine((files) => files.length > 0, { message: "Cheque is required" }),
  licence: z
    .instanceof(FileList, "License is required")
    .refine((files) => files.length > 0, { message: "License is required" }),
});

const AddStaffForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(officeStaffSchema),
    defaultValues: initialFormData,
  });

  const [staffId, setStaffId] = useState("");
  const [change, setChange] = useState("");

  // token related
  const token = localStorage.getItem("token");

  const [States, SetStates] = useState([]);
  const [Cities, SetCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  const fetchStaffId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/office-stafId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setStaffId(response.data.stafId);
      }
    } catch (error) {
      console.error("Error fetching Staff ID:", error.message);
    }
  };

  useEffect(() => {
    fetchStaffId();
  }, [token]);

  useEffect(() => {
    SetStates(Object.keys(citiesData));
  }, []);

  useEffect(() => {
    if (selectedState) {
      SetCities(citiesData[selectedState]);
    }
  }, [selectedState]);

  const onSubmit = async (data) => {
    try {
      // making api call to submit form data
      const response = await axios.post(
        `${BASE_URL}/create-staf`,
        {
          ...data,
          photo: data.photo[0],
          signature: data.signature[0],
          aadhar: data.aadhar[0],
          pancard: data.pancard[0],
          cheque: data.cheque[0],
          licence: data.licence[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Make sure to set the content type
          },
        }
      );

      // handling api response
      console.log("API Response:", response.data);
      // success toast
      reset();
      fetchStaffId();
      toast.success("Form submitted successfully");
    } catch (error) {
      //  api call error
      console.error("API Request Error:", error);

      if (error.response) {
        // if status code falls out of the range of 2xx
        console.error("Server responded with:", error.response.data);
        // error message from the response
        const errorMessage =
          error.response.data.message || "Error form submitting";
        // error toast showing the message
        toast.error(errorMessage);
      } else if (error.request) {
        // if no response was received
        console.error("No response received:", error.request);
        toast.error("Server didn't respond. Please try again!");
      } else {
        // something went wrong
        console.error("Error setting up the request:", error.message);
        toast.error("Something went wrong :(");
      }
    }
  };

  const value = getValues(); // check this if you want to use the values
  console.log({ value });

  const [isMobile, setIsMobile] = useState(true);
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
      <form
        className={`${
          isMobile
            ? "flex flex-col p-5 mt-5"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        } w-full `}
        onSubmit={handleSubmit(onSubmit)}
      >
        <>
          {/* Staff Name */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Staff Id
            </label>
            <input
              disabled
              value={staffId}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Staff Name */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Staff Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Mobile */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Mobile
            </label>
            <input
              {...register("mobile", { required: "Mobile is required" })}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.mobile ? "border-red-500" : ""
              }`}
            />
            {errors.mobile && (
              <span className="text-red-500 text-xs">
                {errors.mobile.message}
              </span>
            )}
          </div>

          {/* Alternative Mobile */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Alternative Mobile
            </label>
            <input
              {...register("alternativeMobile")}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.alternativeMobile ? "border-red-500" : ""
              }`}
            />
            {errors.alternativeMobile && (
              <span className="text-red-500 text-xs">
                {errors.alternativeMobile.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              {...register("email")}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* PAN Card */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              PAN Card
            </label>
            <input
              {...register("panCard", { required: "PAN Card is required" })}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.panCard ? "border-red-500" : ""
              }`}
            />
            {errors.panCard && (
              <span className="text-red-500 text-xs">
                {errors.panCard.message}
              </span>
            )}
          </div>

          {/* Aadhar Card */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Aadhar Card
            </label>
            <input
              {...register("aadharCard", {
                required: "Aadhar Card is required",
              })}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.aadharCard ? "border-red-500" : ""
              }`}
            />
            {errors.aadharCard && (
              <span className="text-red-500 text-xs">
                {errors.aadharCard.message}
              </span>
            )}
          </div>

          {/* Address Line 1 */}
          <div className="row-span-1 col-span-1  lg:col-span-2   mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Address Line 1
            </label>
            <input
              {...register("addressLine1", {
                required: "Address Line 1 is required",
              })}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.addressLine1 ? "border-red-500" : ""
              }`}
            />
            {errors.addressLine1 && (
              <span className="text-red-500 text-xs">
                {errors.addressLine1.message}
              </span>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="row-span-1 col-span-1 md:col-span-2 lg:col-span-3 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Address Line 2
            </label>
            <input
              {...register("addressLine2")}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.addressLine2 ? "border-red-500" : ""
              }`}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              State
            </label>
            <select
              {...register("state", { required: "State is required" })}
              onChange={(e) => {
                setValue("city", "");
                setValue("state", e.target.value);
                setSelectedState(e.target.value);
              }}
              className={`mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.state ? "border-red-500" : ""
              }`}
            >
              <option value="" disabled>
                Select State
              </option>
              {Object.keys(citiesData).map((State) => (
                <option className="" key={State} value={State}>
                  {State}
                </option>
              ))}
            </select>
            {errors.state && (
              <span className="text-red-500 text-xs">
                {errors.state.message}
              </span>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              City
            </label>
            <select
              {...register("city", { required: "City is required" })}
              className={`mt-1 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.city ? "border-red-500" : ""
              }`}
            >
              <option value="" disabled>
                Select City
              </option>
              {(citiesData[value.state] || []).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && (
              <span className="text-red-500 text-xs">
                {errors.city.message}
              </span>
            )}
          </div>

          {/* Pincode */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Pincode
            </label>
            <input
              {...register("pincode", { required: "Pincode is required" })}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.pincode ? "border-red-500" : ""
              }`}
            />
            {errors.pincode && (
              <span className="text-red-500 text-xs">
                {errors.pincode.message}
              </span>
            )}
          </div>

          {/* Username */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              {...register("username", { required: "Username is required" })}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.username ? "border-red-500" : ""
              }`}
            />
            {errors.username && (
              <span className="text-red-500 text-xs">
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <span className="text-red-500 text-xs">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="col-span-1 "></div>

          {/* Photo */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Photo
            </label>
            <input
              type="file"
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.photo ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                setValue("photo", e.target.files);
                setChange((prev) => !prev);
              }}
            />
            {errors.photo && (
              <span className="text-red-500 text-xs">
                {errors.photo.message}
              </span>
            )}
            <img
              className="w-full aspect-square bg-white border border-black "
              src={
                value.photo &&
                value.photo[0] &&
                URL.createObjectURL(value.photo[0])
              }
            />
          </div>

          {/* Signature */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Signature
            </label>
            <input
              type="file"
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.signature ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                setValue("signature", e.target.files);
                setChange((prev) => !prev);
              }}
            />
            {errors.signature && (
              <span className="text-red-500 text-xs">
                {errors.signature.message}
              </span>
            )}
            <img
              className="w-full aspect-square bg-white border border-black "
              src={
                value.signature &&
                value.signature[0] &&
                URL.createObjectURL(value.signature[0])
              }
            />
          </div>

          {/* Aadhar */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Aadhar
            </label>
            <input
              type="file"
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.aadhar ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                setValue("aadhar", e.target.files);
                setChange((prev) => !prev);
              }}
            />
            {errors.aadhar && (
              <span className="text-red-500 text-xs">
                {errors.aadhar.message}
              </span>
            )}
            <img
              className="w-full aspect-square bg-white border border-black "
              src={
                value.aadhar &&
                value.aadhar[0] &&
                URL.createObjectURL(value.aadhar[0])
              }
            />
          </div>

          {/* PAN Card */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              PAN Card
            </label>
            <input
              type="file"
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.pancard ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                setValue("pancard", e.target.files);
                setChange((prev) => !prev);
              }}
            />
            {errors.pancard && (
              <span className="text-red-500 text-xs">
                {errors.pancard.message}
              </span>
            )}
            <img
              className="w-full aspect-square bg-white border border-black "
              src={
                value.pancard &&
                value.pancard[0] &&
                URL.createObjectURL(value.pancard[0])
              }
            />
          </div>

          {/* Cheque */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Cheque
            </label>
            <input
              type="file"
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.cheque ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                setValue("cheque", e.target.files);
                setChange((prev) => !prev);
              }}
            />

            {errors.cheque && (
              <span className="text-red-500 text-xs">
                {errors.cheque.message}
              </span>
            )}
            <img
              className="w-full aspect-square bg-white border border-black "
              src={
                value.cheque &&
                value.cheque[0] &&
                URL.createObjectURL(value.cheque[0])
              }
            />
          </div>

          {/* Licence */}
          <div className="row-span-1 col-span-1 mb-4">
            <label className="block text-sm font-medium text-gray-600">
              License
            </label>
            <input
              type="file"
              className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
                errors.licence ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                setValue("licence", e.target.files);
                setChange((prev) => !prev);
              }}
            />
            {errors.licence && (
              <span className="text-red-500 text-xs">
                {errors.licence.message}
              </span>
            )}
            <img
              className="w-full aspect-square bg-white border border-black "
              src={
                value.licence &&
                value.licence[0] &&
                URL.createObjectURL(value.licence[0])
              }
            />
          </div>
        </>
        <button
          disabled={isSubmitting}
          className="w-full h-10  col-span-3 bg-blue-500 text-white  rounded-md uppercase hover:opacity-95 disabled:opacity-85"
        >
          {isSubmitting ? "Please Wait..." : "Submit"}
        </button>
      </form>
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
    </>
  );
};
export default AddStaffForm;
