import React, { useState } from "react";
import {
  createListingStart,
  createListingSuccess,
  createListingFailure,
} from "../redux/listing/listing";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { url } from "../data";
const Listings = () => {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const { loading, listing } = useSelector((state) => state.listing);
  const [listingData, setListingData] = useState({
    name: "",
    description: "",
    address: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    type: "rent",
    offer: false,
    furnished: false,
    parking: false,
    user: currentUser.data._id,
    images: [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;
    setListingData((prevData) => {
      if (id === "sale" || id === "rent") {
        return { ...prevData, type: id };
      }
      return { ...prevData, [id]: type === "checkbox" ? checked : value };
    });
  };
 

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const imagesUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setImages(imagesUrls);
  };

  const handleDeleteImage = (id) => {
    setImages(images.filter((_, index) => index !== id));
    setFiles(images.filter((_, index) => index !== id));
  };

  const handleImageValidate = () => {
    if (files.length < 1) {
      setError("you must upload at least one one image");
      return false;
    }
    if (+listingData.regularPrice < +listingData.discountPrice) {
      setError("Discount price must be lower than Regular Price");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
    Object.keys(listingData).forEach((key) =>
      formData.append(key, listingData[key])
    );
    files.forEach((file) => formData.append("images", file));
    e.preventDefault();
    if (!handleImageValidate()) {
      return;
    }
    try {
      dispatch(createListingStart());
      const response = await fetch(`${url}/api/listing/create-listing`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const res = await response.json();
      console.log(res);
      if (!res.success) {
        dispatch(createListingFailure(res.message));
      }
      dispatch(createListingSuccess(res));
      navigate(`/listing/${res.listing._id}`);
    } catch (error) {
      console.log(error);
      dispatch(createListingFailure(error.message));
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center  my-7">
        Create Listings
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg bo border-transparent bg-white"
            id="name"
            value={listingData.name}
            onChange={handleChange}
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg border-transparent bg-white"
            id="description"
            onChange={handleChange}
            value={listingData.description}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg border-transparent bg-white"
            id="address"
            onChange={handleChange}
            value={listingData.address}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={listingData.type === "sale"}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={listingData.type === "rent"}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={listingData.parking}
                type="checkbox"
                id="parking"
                className="w-5"
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={listingData.furnished}
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input
                onChange={handleChange}
                checked={listingData.offer}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className=" flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-2 border border-gray-300 rounded-lg w-15"
                type="number"
                id="bedrooms"
                onChange={handleChange}
                value={listingData.bedrooms}
                minLength="1"
                maxLength="10"
                required
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="p-2 border border-gray-300 rounded-lg w-15"
                type="number"
                id="bathrooms"
                value={listingData.bathrooms}
                onChange={handleChange}
                minLength="1"
                maxLength="10"
                required
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                className="p-2 border border-gray-300 rounded-lg w-15"
                type="number"
                id="regularPrice"
                onChange={handleChange}
                value={listingData.regularPrice}
                minLength="1"
                maxLength="10000000"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {listingData.offer && (
              <div className="flex items-center gap-2">
                <input
                  className="p-2 border border-gray-300 rounded-lg w-15"
                  type="number"
                  id="discountPrice"
                  onChange={handleChange}
                  value={listingData.discountPrice}
                  minLength="1"
                  maxLength="1000000"
                  required
                />
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-semibold mb-3">
            Images:
            <span className="font-normal text-gray-700 ml-2">
              the first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              onChange={handleImageChange}
              multiple
            />
            <button
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              type="button"
            >
              Upload
            </button>
          </div>
          {images?.map((img, index) => {
            return (
              <div
                className="flex items-center justify-between mt-5"
                key={index}
              >
                <img className="w-30" src={img} alt="listing" />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="text-red-700 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            );
          })}
          <button className="p-3 mt-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
            Create Listing
          </button>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
};

export default Listings;
