import React from "react";

const MyAccount = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-[50px] h-[50px] rounded-full">
        <img
          src={"../public/images/img1.png"}
          className="w-[50px] h-[50px] rounded-full"
          alt=""
        />
      </div>
      <div className="mt-10">
        <div className="flex flex-col mt-2">
          <label htmlFor="" className="text-white font-semibold">
            Full Name
          </label>
          <input
            type="text"
            className="w-[300px] h-[30px] bg-coching-nav_color text-white p-2 rounded"
          />
        </div>
        <div className="flex flex-col mt-2">
          <label htmlFor="" className="text-white font-semibold">
            Email Address
          </label>
          <input
            type="text"
            className="w-[300px] h-[30px] bg-coching-nav_color text-white p-2 rounded"
          />
        </div>
        <button className="bg-coching-text_color w-[150px] mt-10 text-black rounded shadow-md font-bold">
          Update
        </button>
      </div>
    </div>
  );
};

export default MyAccount;
