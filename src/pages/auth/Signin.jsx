import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setError, setMessage } from "../../redux/user/userSlice";
import logo from "../../assets/logo.jpeg";
import { BASE_URL } from "../..";
import { useForm } from "react-hook-form";

import { object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const schema = object({
  email: string().email(),
  password: string().min(3), // min 6
});

const Signin = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const dispatch = useDispatch();

  const [apiError, setApiError] = useState(null);

  const onSubmit = async (data) => {
    setApiError(null); // Clear any previous errors
    await axios
      .post(`${BASE_URL}/login-user`, data)
      .then((res) => {
        const userToken = res.data.user.token;
        localStorage.setItem("token", userToken);
        dispatch(setMessage("logged in successfully"));
      })
      .catch((err) => {
        console.log(err.data.message);
        dispatch(setError(err.data.message));
        setApiError("Invalid email or password. Please try again.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      {/* Logo Section */}
      <div className="w-full max-w-md text-center mb-6">
        <img src={logo} alt="Logo" className="mx-auto" />
      </div>

      {/* Sign In Form */}
      <form
        className="w-full max-w-md p-8 bg-white rounded shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email")}
            className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:border-blue-300"
          />
          <p className="text-red-500">{errors.email?.message}</p>
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="w-full p-2 mt-2 border rounded-md focus:outline-none focus:border-blue-300"
          />
          <p className="text-red-500">{errors.password?.message}</p>
        </div>

        {apiError && <p className="text-red-500">{apiError}</p>}

        <button
          type="submit"
          className="w-full p-2 mt-4 bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring focus:border-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="flex justify-between gap-2 mt-5">
        <div className=" font-semibold">
          <span className="text-black">Don&apos;t have an account?</span>
          <Link to="/register">
            <span className="text-blue-700"> Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signin;
