import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from "react-icons/fa";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);

        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);

        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="'text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-red-700 text-center my-7 text-xl">
          Something went wrong! Go to{" "}
          <Link className="text-blue-500 underline hover:opacity-45" to={"/"}>
            Home Page
          </Link>{" "}
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageURLs.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex flex-col  max-w-5xl mx-auto p-3 my-7 gap-4">
            <p className="text-3xl font-semibold">
              {listing.name} -${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}{" "}
              {listing.type === "rent" && " / month"}
            </p>
            <p className="flex text-slate-700 items-center text-xl mt-6 gap-2 ">
              <FaMapMarkerAlt className="text-red-500 text-xl" />
              {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-700 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}

              </p>
              {listing.offer && (
                <p className="bg-green-700 text-white max-w-[200px] w-full rounded-md text-center p-1">${+listing.regularPrice - +listing.regularPrice} OFF</p>
              )}
            </div>
            <p className="text-xl text-slate-700">
              <span className="text-black font-semibold ">Description - </span>
              {listing.description}
            </p>
            <ul className="text-blue-600 flex gap-4 text-sm flex-wrap">
              <li className="flex items-center text-xl gap-2">
                <FaBed className="text-2xl text-blue-800 " />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className="flex items-center text-xl gap-2">
                <FaBath className="text-2xl text-blue-800 " />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className="flex items-center text-xl gap-2">
                <FaParking className="text-2xl text-blue-800 " />
                {listing.parking > 1
                  ? 'With Parking'
                  : 'No Parking'}
              </li>
              <li className="flex items-center text-xl gap-2">
                <FaChair className="text-2xl text-blue-800 " />
                {listing.furnished > 1
                  ? 'Furnished'
                  : 'Unfurnished'}
              </li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
