import React, { useState } from "react";
import { useTheme } from "../components/ThemeContext";
import LoadingCard from "../components/LoadingCard";

import BookCard from "./book/BookCard";

const Books = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  return (
    <div className="container md:px-0 m-auto pt-20 pb-4">
      <div
        className={`flex items-center mt-3 justify-center border-b flex-col gap-2 ${
          theme === "light" ? "border-gray-200" : "border-gray-500"
        } `}
      >
        <div className="bg-[#caf3c8] md:w-[40vw] uppercase justify-center gap-2   w-[100%] mb-4 px-2 py-3 flex  items-center rounded">
          <div className="w-10">
            <img
              src="https://cdn-icons-png.flaticon.com/128/8521/8521795.png"
              alt=""
            />
          </div>
          <h2 className="text-3xl font-semibold text-[#2b5727]">Book Store</h2>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-3">
            {Array.from({ length: 8 }, (_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <>
            <BookCard />
            <BookCard />
          </>
        )}
      </div>
    </div>
  );
};

export default Books;
