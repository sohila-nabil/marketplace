import React, { useState, useEffect } from "react";
import TopHome from "../components/TopHome"
import ImageCarousel from "../components/ImageCarousel"; 
import ListingItem from "../components/ListingItem"
import { Link } from "react-router-dom";
import {url}  from '../data'
const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);


  const fetchOfferListings = async () => {
    try {
      const res = await fetch(
        `${url}/api/listing/get-listings?offer=true&limit=4`
      );
      const data = await res.json();
      setOfferListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRentListings = async () => {
    try {
      const res = await fetch(
        `${url}/api/listing/get-listings?type=rent&limit=4`
      );
      const data = await res.json();
      setRentListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSaleListings = async () => {
    try {
      const res = await fetch(
        `${url}/api/listing/get-listings?type=sale&limit=4`
      );
      const data = await res.json();
      setSaleListings(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOfferListings();
    fetchSaleListings();
    fetchRentListings(); 
  }, []); 

  console.log("Offer Listings:", offerListings);
  console.log("Rent Listings:", rentListings);
  console.log("Sale Listings:", saleListings);

  return (
    <div>
      <TopHome />
      {offerListings.length > 0 && (
        <ImageCarousel images={offerListings[0].images} height="600px" />
      )}
      {/* listing results for offer, sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
