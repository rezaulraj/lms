import { useState, useEffect } from "react";

import Sidebar from "../../components/Sidebar";

import axiosInstance from "../../components/axiosInstance";
const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState([]);
  const userid = localStorage.getItem("userid");
  useEffect(() => {
    const fetchEnroleCourse = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/transaction/getTransactionByUserId?idUsers=${userid}`
        );
        const responseData = response.data;
        setCourse(responseData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching enrole courses:", error);
      }
    };

    fetchEnroleCourse();
  }, []);

  console.log(course);

  return (
    <Sidebar>
      <div className="container m-auto w-full px-5 items-center justify-center flex flex-col gap-10 my-5">
        <div className="flex md:flex-row w-full flex-col items-center gap-5">
          <div className="md:w-[20.9vw] w-full h-[30vh] border bg-red-600 rounded-md shadow-md gap-2 flex flex-col items-center justify-center">
            <img
              className="w-[104px] h-[104px]"
              src="https://cdn.ostad.app/public/upload/2023-05-27T08-52-03.886Z-Image.png"
              alt="Course Image"
            />
            <p className="text-white text-lg font-medium">Enroll Course</p>
            <h2 className="text-white font-bold text-2xl">{course.length || 0}</h2>
          </div>
          <div className="md:w-[20.9vw] w-full h-[30vh] border bg-[#367a34] rounded-md shadow-md flex flex-col items-center justify-center">
            <img
              className="w-[104px] h-[104px]"
              src="https://cdn-icons-png.flaticon.com/128/5526/5526508.png"
              alt="Course Image"
            />
            <p className="text-white text-lg font-medium">Enroll Subject (0)</p>
          </div>
          <div className="md:w-[20.9vw] w-full h-[30vh] border bg-cyan-700 rounded-md shadow-md flex flex-col items-center justify-center">
            <img
              className="w-[104px] h-[104px]"
              src="https://cdn.ostad.app/public/upload/2023-01-26T06-51-20.600Z-warning-1.png"
              alt="Warning"
            />
            <p className="text-white text-lg font-medium">
              Total Transactions (0)
            </p>
          </div>
        </div>
        {/* <div className="w-full flex p-4 md:!p-6 flex-col items-center gap-6 md:!gap-8 self-stretch rounded-lg md:!rounded-2xl border bg-white shadow-md">
          {loading ? (
            <p className="text-[20px] md:!text-[25px] font-bold leading-[130%] text-center">
              Loading...
            </p>
          ) : roomDetails && roomDetails.length > 0 ? (
            <>
              <img
                className="w-[104px] h-[104px]"
                src="https://cdn-icons-png.flaticon.com/128/2931/2931300.png"
                alt="Live Class"
              />
              <div className="flex flex-col gap-2 items-center">
                <p className="text-[20px] md:!text-[25px] font-bold leading-[130%] text-center">
                  <Link
                    to={`${roomDetails[0]?.live_link}`}
                    className="text-blue-500"
                  >
                    Join Now
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center flex-col justify-center gap-3">
              <img
                className="w-[104px] h-[104px]"
                src="https://cdn-icons-png.flaticon.com/128/2931/2931300.png"
                alt="Live Class"
              />
              <p className="text-[20px] md:!text-[25px] font-bold leading-[130%] text-center">
                Not Live Class Yet
              </p>
            </div>
          )}
        </div> */}

        {/* <div className="px-10">
        <HelpSection />
        </div> */}
      </div>
    </Sidebar>
  );
};

export default Dashboard;
