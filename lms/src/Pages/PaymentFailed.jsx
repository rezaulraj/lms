import React from "react";

const PaymentFailed = () => {
  return (
    <div className=" h-screen">
      <div className="bg-white p-6 flex flex-col items-center justify-center h-full md:mx-auto">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          className="text-red-600 w-16 h-16 mx-auto my-6 bg-gray-300 p-2 rounded-full"
        >
          <path
            fill="currentColor"
            d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
          />
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
            Payment Failed !
          </h3>
          <p className="text-gray-600 my-2">
            Sorry Your payment are Falied Try Again
          </p>
          <p> Have a great day! </p>
          <div className="py-10 text-center">
            <a
              href="/"
              className="px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
            >
              GO BACK
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
