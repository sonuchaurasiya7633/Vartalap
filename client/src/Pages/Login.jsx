import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../redux/slices/auth";
import { setUserDetails } from "../redux/slices/user";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onchangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submithandler = async (e) => {
    e.preventDefault();
    const tosatId = toast.loading("login...");
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        formData
      );

      if (!response.data.success) {
        throw new Error("Error occur during login");
      }
      dispatch(setToken(response.data.token));
      dispatch(setUserDetails(response.data.userDeatils));
      toast.dismiss(tosatId);
      navigate("/home");
      toast.success(response.data.message);
      setLoading(false);
    } catch (error) {
    toast.dismiss(tosatId);
      console.log(error);
      setLoading(false);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };
  return (
    <div className="min-w-[550px]">
      <div
        className="bg-gray-800  px-2 py-4 
        flex justify-center flex-col items-center rounded-[20px]"
      >
        <div className="flex gap-2 flex-col items-center">
          <h2 className="text-4xl">Login</h2>
          <p>Welcome back! Please enter your details</p>
        </div>

        {/* login form  */}
        <form
          className="mt-6 w-[96%] flex flex-col gap-2 items-center justify-center"
          onSubmit={submithandler}
        >
          {/* email  */}
          <label className="flex flex-col w-full gap-1">
            <p className="text-[18px]">Email</p>
            <input
              type="text"
              className="w-full outline-none  bg-transparent text-white border
      border-gray-600 rounded-md  px-4 py-2"
              placeholder="Enter your email"
              required
              name="email"
              onChange={onchangeHandler}
            />
          </label>

          {/* password  */}
          <label className="flex flex-col w-full gap-1">
            <p className="text-[18px]">Password</p>
            <input
              type="password"
              className="w-full outline-none  bg-transparent text-white border
      border-gray-600 rounded-md  px-4 py-2"
              placeholder="Enter your password"
              required
              name="password"
              onChange={onchangeHandler}
            />
          </label>

          {/* button  */}

          <div className="flex items-center w-full">
            <button
              disabled={loading}
              className="bg-yellow-400 px-6 py-2 w-full text-black font-semibold mt-2 mb-2 rounded-md
        transition-all duration-300 hover:bg-yellow-300"
              type="submit"
            >
             Log in
            </button>

            {loading && (
              <i class="fa-solid fa-spinner -ml-8 text-black animate-spin"></i>
            )}
          </div>

        </form>
      </div>
      <div className="flex items-center gap-2 justify-center mt-2 text-gray-100">
        <p>Don't have an account? </p>
        <Link to={"/"} className="underline text-blue-700">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
