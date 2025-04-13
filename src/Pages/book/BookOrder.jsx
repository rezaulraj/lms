import React, { useEffect } from "react";
import { useAuth } from "../../components/Auth";
import { Link } from "react-router-dom";

const BookOrder = () => {
  const { cart, setCart } = useAuth();
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleDecressQuantity = (index) => {
    const updateCart = [...cart];
    updateCart[index].quantity -= 1;
    setCart(updateCart);
  };

  const handleIncressQuantity = (index) => {
    const updateCart = [...cart];
    updateCart[index].quantity += 1;
    setCart(updateCart);
  };
  const handelDeleteProduct = (index) => {
    const updateCart = [...cart];
    updateCart.splice(index, 1);
    setCart(updateCart);
  };

  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  const calculateOverAllTotal = () => {
    let total = 0;
    cart.forEach((item) => {
      total += calculateItemTotal(item);
    });
    return total;
  };

  return (
    <div className="font-sans max-w-5xl max-md:max-w-xl mx-auto bg-white py-4 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 text-center">
        Shopping Cart
      </h1>
      {cart.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="md:col-span-2 space-y-4">
            {cart &&
              cart.length > 0 &&
              cart.map((c, index) => (
                <div
                  key={c.id}
                  className="grid grid-cols-3 items-start gap-4 borderb-gray-300"
                >
                  <div className="col-span-2 flex items-start gap-4">
                    <div className="w-28 h-28 max-sm:w-24 max-sm:h-24 shrink-0 bg-gray-100 p-2 rounded-md">
                      <img
                        src={c.img}
                        alt={c.title}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex flex-col">
                      <h3 className="text-base font-bold text-gray-800">
                        {c.title}
                      </h3>
                      {/* <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    Size: MD
                  </p> */}

                      <button
                        onClick={() => handelDeleteProduct(index)}
                        type="button"
                        className="mt-6 font-semibold text-red-500 text-xs flex items-center gap-1 shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 fill-current inline"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                            data-original="#000000"
                          ></path>
                          <path
                            d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                            data-original="#000000"
                          ></path>
                        </svg>
                        REMOVE
                      </button>
                    </div>
                  </div>

                  <div className="ml-auto">
                    <h4 className="text-lg max-sm:text-base font-bold text-gray-800">
                      {c.price} BDT
                    </h4>

                    <button
                      type="button"
                      className="mt-6 flex items-center px-3 py-1.5 border border-gray-300 text-gray-800 text-xs outline-none bg-transparent rounded-md"
                    >
                      <button
                        onClick={() => handleDecressQuantity(index)}
                        disabled={c.quantity === 0}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-2.5 fill-current"
                          viewBox="0 0 124 124"
                        >
                          <path
                            d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z"
                            data-original="#000000"
                          ></path>
                        </svg>
                      </button>

                      <span className="mx-3 font-bold">{c.quantity}</span>
                      <button onClick={() => handleIncressQuantity(index)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-2.5 fill-current"
                          viewBox="0 0 42 42"
                        >
                          <path
                            d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z"
                            data-original="#000000"
                          ></path>
                        </svg>
                      </button>
                    </button>
                  </div>
                </div>
              ))}

            <hr />
          </div>

          {/* order summary */}
          <div className="bg-gray-100 rounded-md p-4 h-max">
            <h3 className="text-lg max-sm:text-base font-bold text-gray-800 border-b border-gray-300 pb-2">
              Order Summary
            </h3>

            <form className="mt-6">
              <div>
                <h3 className="text-base text-gray-800  font-semibold mb-4">
                  Enter Details
                </h3>
                <div className="space-y-3">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="px-4 py-2.5 bg-white text-gray-800 rounded-md w-full text-sm border-b focus:border-gray-800 outline-none"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-4 h-4 absolute right-4"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="10"
                        cy="7"
                        r="6"
                        data-original="#000000"
                      ></circle>
                      <path
                        d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="email"
                      placeholder="Email"
                      className="px-4 py-2.5 bg-white text-gray-800 rounded-md w-full text-sm border-b focus:border-gray-800 outline-none"
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#bbb"
                      stroke="#bbb"
                      className="w-4 h-4 absolute right-4"
                      viewBox="0 0 682.667 682.667"
                    >
                      <defs>
                        <clipPath id="a" clipPathUnits="userSpaceOnUse">
                          <path
                            d="M0 512h512V0H0Z"
                            data-original="#000000"
                          ></path>
                        </clipPath>
                      </defs>
                      <g
                        clip-path="url(#a)"
                        transform="matrix(1.33 0 0 -1.33 0 682.667)"
                      >
                        <path
                          fill="none"
                          stroke-miterlimit="10"
                          stroke-width="40"
                          d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                          data-original="#000000"
                        ></path>
                        <path
                          d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                          data-original="#000000"
                        ></path>
                      </g>
                    </svg>
                  </div>

                  <div className="relative flex items-center">
                    <input
                      type="number"
                      placeholder="Phone No."
                      className="px-4 py-2.5 bg-white text-gray-800 rounded-md w-full text-sm border-b focus:border-gray-800 outline-none"
                    />
                    <svg
                      fill="#bbb"
                      className="w-4 h-4 absolute right-4"
                      viewBox="0 0 64 64"
                    >
                      <path
                        d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
                        data-original="#000000"
                      ></path>
                    </svg>
                  </div>
                  <div>
                    <select
                      name=""
                      id=""
                      className="px-4 py-2.5 bg-white text-gray-800 rounded-md w-full text-sm border-b focus:border-gray-800 outline-none"
                    >
                      <option className="outline-none bg-white">
                        Select Shoping Area
                      </option>
                      <option value="dhaka">Inside Dhaka</option>
                      <option value="outsite">OutSite Dhaka</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>

            <ul className="text-gray-800 mt-6 space-y-3">
              <li className="flex flex-wrap gap-4 text-sm">
                Subtotal{" "}
                <span className="ml-auto font-bold">
                  {calculateOverAllTotal()}
                </span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Shipping <span className="ml-auto font-bold">$2.00</span>
              </li>
              <li className="flex flex-wrap gap-4 text-sm">
                Tax <span className="ml-auto font-bold">$4.00</span>
              </li>
              <hr className="border-gray-300" />
              <li className="flex flex-wrap gap-4 text-sm font-bold">
                Total <span className="ml-auto">$206.00</span>
              </li>
            </ul>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-gray-800 hover:bg-gray-900 text-white rounded-md"
              >
                Checkout
              </button>
              <button
                type="button"
                className="text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md"
              >
                Continue Shopping{" "}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-screen-xl mx-auto px-4 flex items-center justify-start h-screen md:px-8">
          <div className="max-w-lg mx-auto space-y-3 text-center">
            <h3 className="text-gray-800 text-4xl font-semibold sm:text-5xl">
              Product not found
            </h3>
            <p className="text-gray-600">Sorry, Please buy the then return</p>
            <Link
              to={"/books"}
              className="bg-lmsfontend-text_color text-gray-100 duration-150 hover:text-gray-200 px-4 py-2 rounded-md font-medium inline-flex items-center gap-x-1"
            >
              Go back Product Page
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookOrder;
