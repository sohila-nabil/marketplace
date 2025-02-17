import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { url } from "../data";
import { FaArrowRightLong, FaArrowLeftLong } from "react-icons/fa6";
import Contact from "../components/Contact";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import ImageCarousel from "../components/ImageCarousel";

const OneListing = () => {
  const [listingData, setListingData] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser?.data);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current image index
  const { id } = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${url}/api/listing/get-listing/${id}`);
        const res = await response.json();
        if (!res.success) {
          setError(true);
          setLoading(false);
          return;
        }
        setListingData(res.listing);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  // Handle previous image
  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listingData.images.length - 1 : prevIndex - 1
    );
  };

  // Handle next image
  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listingData.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading ...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong</p>
      )}
      {listingData && !error && !loading && (
        <>
          <ImageCarousel images={listingData.images} showIndex={false} />

          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listingData.name} - ${" "}
              {listingData.offer
                ? listingData.discountPrice.toLocaleString("en-US")
                : listingData.regularPrice.toLocaleString("en-US")}
              {listingData.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listingData.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listingData.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listingData.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listingData.regularPrice - +listingData.discountPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800 break-all">
              <span className="font-semibold text-black">Description - </span>
              {listingData.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {listingData.bedrooms > 1
                  ? `${listingData.bedrooms} beds `
                  : `${listingData.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {listingData.bathrooms > 1
                  ? `${listingData.bathrooms} baths `
                  : `${listingData.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {listingData.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {listingData.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
            {currentUser.success &&
              listingData.user !== currentUser.data._id &&
              !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                >
                  Contact landlord
                </button>
              )}
            {contact && <Contact listingData={listingData} />}
          </div>
        </>
      )}
    </main>
  );
};

export default OneListing;
