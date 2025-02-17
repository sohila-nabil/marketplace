import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { url } from "../data";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";
import ListingsList from "../components/ListingsList";
const Profile = () => {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const user = currentUser.data;
  const [data, setData] = useState({});
  const [listings, setListings] = useState([]);
  const [listingsErrors, setListingsErrors] = useState(null);
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(undefined);
  const [image, setImage] = useState(user.avatar.url || user.avatar);
  const fileRef = useRef(null);

  const handlePreview = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
    };
  };
  useEffect(() => {
    if (file) {
      handlePreview(file);
    }
  }, [file]);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (data.username) formData.append("username", data.username);
    if (data.email) formData.append("email", data.email);
    if (data.password) formData.append("password", data.password);
    if (file) formData.append("photo", file);
    try {
      dispatch(updateUserStart());
      const response = await fetch(`${url}/api/user/update/${user._id}`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      const res = await response.json();
      if (!res.success) {
        dispatch(updateUserFailure(res.message));
        return;
      }
      dispatch(updateUserSuccess(res));
      setMsg(res.message);
      console.log(msg);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`${url}/api/user/delete/${user._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const res = response.json();
      dispatch(deleteUserSuccess(res));
      if (res.success === false) {
        dispatch(deleteUserFailure(res.message));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signoutStart());
      const response = await fetch(`${url}/api/auth/sign-out`, {
        method: "GET",
        credentials: "include",
      });
      const res = response.json();
      if (!res.success) {
        dispatch(signoutFailure(res.message));
      }
      dispatch(signoutSuccess(res));
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      const response = await fetch(`${url}/api/user/listings/${user._id}`, {
        method: "GET",
        credentials: "include",
      });
      const res = await response.json();
      console.log(res);
      if (res.success) {
        setListings(res.listings);
      }
    } catch (error) {
      console.log(error);
      setListingsErrors(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={image}
          alt="profile"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center"
        />
        <input
          type="text"
          placeholder="username"
          className="border border-transparent bg-white p-3 rounded-lg"
          id="username"
          onChange={handleChange}
          defaultValue={user.username}
        />
        <input
          type="email"
          placeholder="email"
          className="border border-transparent bg-white p-3 rounded-lg"
          id="email"
          onChange={handleChange}
          defaultValue={user.email}
        />
        <input
          type="password"
          placeholder="password"
          className="border border-transparent bg-white p-3 rounded-lg"
          id="password"
          onChange={handleChange}
          defaultValue={user.password}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 cursor-pointer disabled:opacity-90"
        >
          {loading ? "Loading ..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="bg-green-700 text-center text-white p-3 rounded-lg uppercase hover:opacity-95 cursor-pointer disabled:opacity-90"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
      {msg !== " " ? <p className="text-green-500 mt-5">{msg}</p> : ""}
      <button
        onClick={handleShowListings}
        className="text-green-700 w-full cursor-pointer hover:underline"
      >
        Show Listings
      </button>
      <div className="flex flex-col gap-4 mt-4">
        <h1 className="text-center font-semibold mt-7 text-2xl">
          Your Listings
        </h1>
        {listings.length > 0 &&
          listings.map((list, index) => (
            <ListingsList
              key={list._id}
              list={list}
              setListings={setListings}
            />
          ))}
      </div>
    </div>
  );
};

export default Profile;
