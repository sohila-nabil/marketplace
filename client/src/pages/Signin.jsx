import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { url } from "../data";
import { useSelector, useDispatch } from "react-redux";
import {
  signinStart,
  signInSuccess,
  signInFailuer,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
const Signin = () => {
  const [formData, setFormData] = useState({});
  const user = useSelector((state) => state.user);
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signinStart);
      const res = await fetch(`${url}/api/auth/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailuer(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
      console.log(data);
    } catch (error) {
      dispatch(signInFailuer(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="border border-transparent bg-white p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="username"
          className="border border-transparent bg-white p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 cursor-pointer disabled:opacity-90"
        >
          {loading ? "Loading ..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default Signin;
