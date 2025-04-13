import React, { useState } from "react";
import { Link } from "react-router-dom";

const FreemiumVocab = ({ data }) => {
  const uniqueTitles = new Set();
  const uniqueTitleData = [];

  data.forEach((category) => {
    if (!uniqueTitles.has(category.title)) {
      uniqueTitles.add(category.title); // Add the unique title to the Set
      uniqueTitleData.push(category); // Add the category to the uniqueTitleData array
    }
  });
  console.log("data", uniqueTitleData);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 items-center justify-center group">
      {uniqueTitleData.map((category, index) => (
        <Link key={index} to="/word-page" state={{ category }}>
          <div className="flex flex-col bg-gray-300 hover:bg-gray-400 p-4 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition duration-500">
            <div className="relative">
              <h2 className="font-serif text-center">
                <span className="text-2xl font-semibold ">
                  {category.title}
                </span>
                <span className="inline-flex items-center justify-center rounded-full bg-blue-800 font-medium ml-2 px-2.5 py-0.5 text-white">
                  {category.data[0].Vocab.types}{" "}
                  {/* Use the first item's type */}
                </span>
              </h2>
              {/* Centered badge */}
              <span className="absolute left-1/2 transform -translate-x-1/2 -top-7 inline-flex items-center justify-center rounded-full bg-blue-500 px-2.5 py-0.5 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="-ms-1 me-1.5 size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="whitespace-nowrap text-sm font-semibold">free</p>
              </span>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-x-2 items-center justify-center">
              <div className="col-span-2 bg-green-100 w-full h-52 flex flex-col gap-2 items-center justify-center rounded-full">
                <h1 className="text-3xl font-bold text-black">
                  {category.data[0].Vocab.numberOfWords}{" "}
                  {/* Use the first item's numberOfWords */}
                </h1>
                <p className="text-3xl font-bold text-black">শব্দ</p>
              </div>
              <div className="col-span-3 w-full h-52 bg-emerald-200 flex flex-col gap-1 items-center justify-center rounded-full">
                <img src="./gre.png" alt="" className="size-32" />
                <span className="text-lg font-bold text-black text-justify">
                  {category.data[0].Vocab.forWhom}{" "}
                  {/* Use the first item's forWhom */}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FreemiumVocab;
