import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "./axiosInstance";
import { FiArrowUpRight } from "react-icons/fi";
import { IoIosTrendingUp } from "react-icons/io";

const TrendingSearches = ({ handleClose }) => {
  const [Subject, setSubject] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchSubject = async () => {
      try {
        const response = await axiosInstance.get("/subjects/getAll");
        setSubject(response.data);
        setInterval(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubject();
  }, []);

  return (
    <>
      {/* <div className="w-full flex flex-col gap-2 px-2 py-1.5">
        <p className="text-body-b2 text-[#989aa3]">Recent Searches</p>
        <div className="w-full flex flex-col gap-1.5">
          {recentSearches.map((search) => (
            <div
              key={search.id}
              className="w-full flex justify-between items-center gap-4 p-1 rounded-sm hover:bg-ostad-black-bg cursor-pointer"
            >
              <Link
                to={`/search?q=${encodeURIComponent(search.query)}`}
                className="w-full flex items-center gap-2"
              >
                <img
                  className="w-4 h-4"
                  src={search.imageUrl}
                  alt="Search icon"
                />
                <p className="text-body-b2 text-trace-black-60 line-clamp-1">
                  {search.query}
                </p>
              </Link>
              <button
                className="relative w-4 h-4 hover:outline outline-ostad-black-opac  hover:bg-ostad-black-opac hover:scale-125 transition-all"
                title="Delete"
              >
                <img
                  className="w-4 h-4"
                  src="https://cdn.ostad.app/public/upload/2024-03-06T09-55-33.815Z-delete-bin-line.svg"
                  alt="Delete icon"
                />
              </button>
            </div>
          ))}
        </div>
      </div> */}
      {loading ? (
        <div
          role="status"
          className=" p-4 space-y-4   divide-y divide-gray-200 rounded  animate-pulse  md:p-2 "
        >
          <div className="h-5 bg-gray-300  dark:bg-gray-600 w-20 "></div>
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="h-5 bg-gray-300 rounded-full  dark:bg-gray-600 w-5 "></div>
                <div className="h-5 bg-gray-300  dark:bg-gray-600 w-52 "></div>
              </div>
              <div className="h-5 bg-gray-300 rounded-full  w-5"></div>
            </div>
          ))}

          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-2 px-2 py-2">
          <p className="text-body-b2 text-[#989aa3]">Trending search</p>
          <div className="w-full flex flex-col gap-1.5">
            {Subject.map((item, index) => (
              <Link
                onClick={handleClose}
                key={index}
                to={`/search?q=${encodeURIComponent(item.name)}`}
              >
                <div className="w-full flex justify-between items-center gap-4 p-1 rounded-sm hover:bg-gray-100 cursor-pointer">
                  <div className="flex gap-2 items-center">
                    <IoIosTrendingUp size={18} color="gray" />
                    <p className="text-body-b2  text-trace-black-60 line-clamp-1">
                      {item.name}
                    </p>
                  </div>
                  <FiArrowUpRight size={18} color="gray" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default TrendingSearches;
