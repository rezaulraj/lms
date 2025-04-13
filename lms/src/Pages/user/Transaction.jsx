import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaCheck } from "react-icons/fa6";

const Transactions = () => {
  const [transactionData, setTransactionData] = useState([]);

  return (
    <Sidebar>
      <div className="w-full container m-auto px-2 xl:px-0">
        <div className="flex items-center justify-center border bg-white py-2 shadow-sm rounded-md">
          <h1 className="md:text-3xl text-xl font-semibold ml-1 ">
            Transactions
          </h1>
        </div>
        {transactionData.length === 0 ? (
          <div className="flex flex-col justify-center items-center gap-4 mt-10 relative p-4 bg-[url('https://cdn.ostad.app/public/upload/2023-01-26T06-50-03.600Z-empty-backgrnd.svg')] bg-center bg-no-repeat">
            <img
              className="w-[80px] h-[80px] z-5"
              src="https://cdn.ostad.app/public/upload/2023-01-26T06-51-20.600Z-warning-1.png"
              alt="Warning"
            />
            <div className="flex flex-col items-center z-5">
              <p className="subtitle-s1 text-ostad-yellow-110">
                No Transactions Found
              </p>
              <p className="over-line text-ostad-black-80">
                Currently there is no info
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-center gap-5 py-4">
            <div className="h-auto w-full border  shadow-sm  bg-white rounded-md">
              <div className="relative overflow-x-auto max-h-[70vh] h-auto  ">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                  <thead className="text-sm text-gray-700 uppercase bg-gray-200 0 ">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Course
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                      <th>Payment Method</th>
                      <th scope="col" className="px-6 py-3">
                        amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b ">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium  text-gray-900 whitespace-nowrap "
                      >
                        Apple MacBook Pro 17
                      </th>
                      <td className="px-6 py-4">August 27, 6:57 pm </td>
                      <td className="px-6 py-4 text-red-700">Failed</td>
                      <td className="px-6 py-4">Bkash</td>
                      <td className="px-6 py-4">$2999</td>
                    </tr>
                    <tr className="bg-white border-b  ">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        Microsoft Surface Pro
                      </th>
                      <td className="px-6 py-4">August 27, 6:57 pm </td>
                      <td className="px-6 py-4">panding</td>
                      <td className="px-6 py-4">Card</td>
                      <td className="px-6 py-4">$1999</td>
                    </tr>
                    <tr className="bg-white ">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                      >
                        Full Stack Web Development with JavaScript (MERN)
                      </th>
                      <td className="px-6 py-4">August 27, 6:57 pm </td>
                      <td className="px-6 py-4">complete</td>
                      <td className="px-6 py-4">Bkash</td>
                      <td className="px-6 py-4">$99</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default Transactions;
