import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { url } from "../data";
const ListingsList = ({ list, setListings }) => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleDeleteListing = async () => {
    try {
      const response = await fetch(
        `${url}/api/listing/delete-listing/${list._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const res = await response.json();
      console.log(res);
      setListings((prev) => prev.filter((item) => list._id !== item._id));
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  return (
    <div className="border rounded-lg p-2 border-gray-500 flex justify-between items-center my-2 gap-4">
      <Link to={`/listing/${list._id}`}>
        <img
          src={list.images[0].url}
          alt="imags"
          className="h-16 w-16 object-contain"
        />
      </Link>
      <Link
        to={`/listing/${list._id}`}
        className="flex-1 text-slate-700 font-semibold  hover:underline truncate"
      >
        <p>{list.name}</p>
      </Link>
      <div className="flex flex-col items-center">
        <button
          onClick={handleDeleteListing}
          className="text-red-700 uppercase cursor-pointer"
        >
          Delete
        </button>
        <button
          onClick={() => navigate(`/edit-listing/${list._id}`)}
          className="text-green-700 uppercase cursor-pointer"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default ListingsList;
