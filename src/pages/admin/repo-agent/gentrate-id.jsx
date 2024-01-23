import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "../../..";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = z.object({
  agentName: z.string().min(1, "Agent name is required"),
  fatherName: z.string().min(1, "Father name is required"),
  mobile: z.string().min(1, "Mobile is required"),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  validFrom: z.string().min(1, "Valid From is required"),
  validTo: z.string().min(1, "Valid To is required"),
  status: z.string().min(1, "Status is required"),
  qrCode: z.string().optional(),
  photo: z
    .instanceof(FileList, "Photo is required")
    .refine((files) => files.length > 0, { message: "Photo is required" }),
  signature: z
    .instanceof(FileList, "Signature is required")
    .refine((files) => files.length > 0, { message: "Signature is required" }),
});
const RepoAgentIdCard = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });
  const token = localStorage.getItem("token");

  const [cardId, setCardId] = useState("");

  const fetchStaffId = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cardId`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setCardId(response.data.cardId);
      }
    } catch (error) {
      console.error("Error fetching Staff ID:", error.message);
    }
  };
  useEffect(() => {
    fetchStaffId();
  }, [token]);

  // eslint-disable-next-line no-unused-vars
  const [file, setFile] = useState(null);
  const values = getValues();

  const onSubmit = async (data) => {
    try {
      // making api call to submit form data
      const response = await axios.post(
        `${BASE_URL}/create-id-card`,
        { ...data, photo: data.photo[0], signature: data.signature[0] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
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
      if (error.response) {
        console.error("Server responded with:", error.response.data);
        const errorMessage =
          error.response.data.message || "Error form submitting";
        toast.error(errorMessage);
      } else if (error.request) {
        console.error("No response received:", error.request);
        toast.error("Server didn't respond. Please try again!");
      } else {
        // something went wrong
        console.error("Error setting up the request:", error.message);
        toast.error("Something went wrong :(");
      }
    }
  };

  const [genQr, setGenQr] = useState(false);
  const onGenerateQr = async () => {
    setGenQr(true);
    axios
      .post(`${BASE_URL}/generate-qr/${cardId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        setValue("qrCode", response.data.qrCodeImage);

        setGenQr(false);
      });
  };
  const handleFileChange = (e) => {
    const file = e.target.files;
    console.log({ file });
    setFile(file);
    // setValue("file", URL.createObjectURL(file));
    setValue("photo", file);
    console.log({ values });
  };
  const handleSignatureChange = (e) => {
    const file = e.target.files;
    console.log({ file });
    setFile(file);
    setValue("signature", file);
    console.log({ values });
  };
  // const value = getValues(); // check this if you want to use the values

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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Id</label>
          <input
            type="id"
            value={cardId}
            disabled
            className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 `}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Agent Name
          </label>
          <input
            type="agentName"
            {...register("agentName", { required: "agentName is required" })}
            className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
              errors.agentName ? "border-red-500" : ""
            }`}
          />
          {errors.agentName && (
            <span className="text-red-500 text-xs">
              {errors.agentName.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Father Name
          </label>
          <input
            type="fatherName"
            {...register("fatherName", { required: "fatherName is required" })}
            className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
              errors.fatherName ? "border-red-500" : ""
            }`}
          />
          {errors.fatherName && (
            <span className="text-red-500 text-xs">
              {errors.fatherName.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Mobile Number
          </label>
          <input
            type="number"
            {...register("mobile", { required: "mobile number is required" })}
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            addressLine1
          </label>
          <input
            type="text"
            {...register("addressLine1", {
              required: "addressLine1 is required",
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            addressLine2
          </label>
          <input
            type="text"
            {...register("addressLine2", {
              required: "addressLine2 is required",
            })}
            className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
              errors.addressLine2 ? "border-red-500" : ""
            }`}
          />
          {errors.addressLine2 && (
            <span className="text-red-500 text-xs">
              {errors.addressLine2.message}
            </span>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            validFrom
          </label>
          <input
            type="date"
            {...register("validFrom", { required: "validFrom is required" })}
            className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
              errors.validFrom ? "border-red-500" : ""
            }`}
          />
          {errors.validFrom && (
            <span className="text-red-500 text-xs">
              {errors.validFrom.message}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            validTo
          </label>
          <input
            type="date"
            {...register("validTo", { required: "validTo is required" })}
            className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
              errors.validTo ? "border-red-500" : ""
            }`}
          />
          {errors.validTo && (
            <span className="text-red-500 text-xs">
              {errors.validTo.message}
            </span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            status
          </label>
          <select
            {...register("status", { required: "status is required" })}
            className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
              errors.status ? "border-red-500" : ""
            }`}
          >
            <option value={"active"}>Active</option>
            <option value={"inactive"}>InActive</option>
          </select>
          {errors.status && (
            <span className="text-red-500 text-xs">
              {errors.status.message}
            </span>
          )}
        </div>

        <div className="p-4">
          <button
            type="button"
            className="h-12  bg-blue-500 text-white  rounded-md uppercase hover:opacity-95 disabled:opacity-85 w-full"
            onClick={onGenerateQr}
          >
            {genQr ? "Genrating Qr" : "Gentrate Qr"}{" "}
          </button>
          <h5>Qr Code</h5>

          <img
            className="w-full aspect-square bg-black border border-black "
            src={values.qrCode}
          />
        </div>
        <div className="p-4">
          <input
            type="file"
            onChange={(e) => handleFileChange(e)}
            className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
              errors.photo ? "border-red-500" : ""
            }`}
          />
          {errors.photo && (
            <span className="text-red-500 text-xs">{errors.photo.message}</span>
          )}

          <h5>Photo</h5>
          <img
            className="w-full aspect-square bg-white border border-black "
            src={
              values.photo &&
              values.photo[0] &&
              URL.createObjectURL(values.photo[0])
            }
          />
        </div>

        <div className="p-4">
          <input
            type="file"
            onChange={(e) => handleSignatureChange(e)}
            className={`mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 ${
              errors?.photo ? "border-red-500" : ""
            }`}
          />
          {errors.signature && (
            <span className="text-red-500 text-xs">
              {errors.signature.message}
            </span>
          )}

          <h5>Signature</h5>
          <img
            className="w-full aspect-square bg-white border border-black "
            src={
              values.signature &&
              values.signature[0] &&
              URL.createObjectURL(values.signature[0])
            }
          />
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="h-10 btn col-span-3 bg-blue-500 text-white  rounded-md uppercase hover:opacity-95 disabled:opacity-85 w-full"
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
export default RepoAgentIdCard;
