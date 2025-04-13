import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

import { useTheme } from "../../components/ThemeContext";
import RatingStars from "../../components/RatingStars";
import axiosInstance from "../../components/axiosInstance";
import Sidebar from "../../components/Sidebar";
import { RotatingLines } from "react-loader-spinner";
import { Footer } from "../../components";
import HelpSection from "../../components/HelpSection";
import LoadingCard from "../../components/LoadingCard";

const AddCourse = () => {
  const navigate = useNavigate();
  const [Subject, setSubject] = useState([]);
  const [course, setCourse] = useState([]);
  const [feedback, setFeedBack] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [subjectName, setSubjetName] = useState("");
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [enroleCourese, setEnrolledCourses] = useState(null);
  const userId = localStorage.getItem("userid");
  const [courseId, setCourseId] = useState(null);
  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const response = await axiosInstance.get("/subjects/getAll");
        setSubject(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/courses/getAll");
        const courseIds = response.data.map((course) => course.idCourses);
        setCourseId(courseIds);
        setCourse(response.data);

        console.log("courser id", courseIds);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchReview = async () => {
      try {
        const response = await axiosInstance.get("/feedbacks/getAll");
        setFeedBack(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    const fetchEnroleCourse = async () => {
      try {
        const response = await axiosInstance.get(
          `/transaction/getTransactionByUserId?idUsers=${userId}`
        );
        const data = response.data.map((course) => course.Course.idCourses);

        setEnrolledCourses(data);
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
      }
    };

    fetchSubject();
    fetchCourse();
    fetchReview();
    fetchEnroleCourse();
  }, [userId]);

  // const enRole = course.filter((courseItem) =>
  //   enroleCourese.includes(courseItem.idCourses)
  // );

  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handlenextPage = (id) => {
    navigate(`/course-details/${id}`);
  };

  function countRatings(ratingsArray) {
    const counts = {};
    for (let i = 1; i <= 5; i++) {
      counts[i] = 0;
    }
    ratingsArray.forEach((item) => {
      const rating = parseInt(item.rating, 10);
      if (counts[rating] !== undefined) {
        counts[rating]++;
      }
    });
    return counts;
  }

  function calculateAverageRating(ratings) {
    let totalRating = 0;
    let totalRatingsCount = 0;
    for (const [star, count] of Object.entries(ratings)) {
      totalRating += star * count;
      totalRatingsCount += count;
    }
    const averageRating =
      totalRatingsCount === 0 ? 0 : totalRating / totalRatingsCount;
    return {
      average: averageRating.toFixed(1),
      count: totalRatingsCount,
    };
  }

  const filter = (item) => {
    const result = feedback.filter((data) => data.idCourses === item.idCourses);
    const ratingCounts = countRatings(result);
    return calculateAverageRating(ratingCounts);
  };

  const handleChangeSubject = (e) => {
    setLoading(true);
    const name = e.target.value;
    const filter = course.filter((data) => data.Subject?.name === name);
    setFilterData(filter);
    setSubjetName(name);
    setInterval(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Sidebar>
      <div className=" px-5  m-auto pb-4">
        <div
          className={`flex items-center mt-3 justify-center border-b flex-col gap-2  `}
        >
          <div className="bg-[#caf3c8] md:w-[40vw] uppercase justify-center gap-2   w-[100%] mb-4 px-2 py-3 flex  items-center rounded">
            <div className="w-10">
              <img
                src="https://cdn-icons-png.flaticon.com/128/8521/8521795.png"
                alt=""
              />
            </div>
            <h2 className="text-3xl font-semibold text-[#2b5727]">
              Course List
            </h2>
          </div>
          <div className="flex w-full md:flex-row items-center justify-center flex-col md:gap-5">
            <div className="md:w-[25vw] w-full">
              <select
                onChange={handleChangeSubject}
                value={subjectName}
                className="w-full bg-slate-100 outline-none px-3 py-2 mb-6 rounded-md shadow-sm"
              >
                <option value={""}>All Subject</option>
                {Subject &&
                  Subject.map((data, index) => (
                    <option key={index}>{data.name}</option>
                  ))}
              </select>
            </div>
            <div className="md:w-[25vw] w-full">
              <select className="w-full bg-slate-100 outline-none px-3 py-2 mb-6 rounded-md shadow-sm">
                <option>All Course</option>
                <option>Paid Course</option>
                <option>Free Course</option>
              </select>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-3">
            {Array.from({ length: 8 }, (_, index) => (
              <LoadingCard key={index} />
            ))}
          </div>
        ) : (
          <div>
            {subjectName ? (
              <div className="flex items-center justify-center w-full">
                {filterData.length === 0 ? (
                  <div className="h-[30vw] flex items-center justify-center">
                    <h3 className="text-xl text-[#258335]">
                      There is no course to enroll
                    </h3>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-3">
                    {filterData.map((d) => {
                      const { average, count } = filter(d);
                      return (
                        <div
                          key={d.id}
                          className="relative h-[320px] flex w-full flex-col px-2 py-2 gap-0 rounded-lg items-start bg-trcae-color overflow-hidden  border footer-border-color hover:border-ostad-black-40 hover:outline-1 hover:outline-ostad-black-40 hover:shadow"
                          onClick={() => handlenextPage(d.course_name)}
                        >
                          <div className="h-40 w-full flex justify-center items-center rounded-t-xl  ">
                            <img
                              src={d.Image?.image_url}
                              alt={d.course_name}
                              className="h-40 rounded-md w-full"
                            />
                          </div>

                          <div className="flex flex-col items-start justify-center gap-1 mt-2">
                            <p className=" font-semibold ">{d.course_name}</p>
                            {count > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{average}</span>
                                <span>
                                  <RatingStars rating={average} />
                                </span>
                                <span className="text-gray-600">({count})</span>
                              </div>
                            )}
                            <p className="text-left font-semibold">
                              {d.price} BDT
                            </p>
                          </div>
                          <div className="flex items-center justify-center w-full absolute bottom-0 left-0 px-2 py-2">
                            <button className="uppercase text-sm bg-[#2e9e28] text-white w-full py-2 rounded-md">
                              Enroll
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {Subject &&
                  Subject.map((data, index) => (
                    <div key={index} className="mt-2 ">
                      <h4 className={` font-semibold text-center text-xl`}>
                        {data?.name}
                      </h4>
                      <div className=" px-5 2xl:w-[80vw] lg:w-[74vw] mt-3">
                        <Slider {...settings}>
                          {course
                            .filter((d) => d.Subject?.name === data?.name)
                            .map((d) => {
                              const { average, count } = filter(d);

                              return (
                                <div
                                  key={d.id}
                                  className="bg-white cursor-pointer h-[320px] sm:w-[301px] w-full   py-2 px-2 text-black  transition-shadow duration-300 relative  flex  flex-col  gap-0 rounded-lg  items-start   overflow-hidden  !border    hover:shadow"
                                  onClick={() => handlenextPage(d.course_name)}
                                >
                                  <div className="h-[50%] w-full flex justify-center items-center rounded-t-xl  ">
                                    <img
                                      src={d.Image?.image_url}
                                      alt={d.course_name}
                                      className="h-full rounded-md w-full"
                                    />
                                  </div>

                                  <div className="flex flex-col items-start justify-center gap-1 mt-2">
                                    <p className=" font-semibold sm:text-sm md:text-base">
                                      {d.course_name}
                                    </p>
                                    {count > 0 && (
                                      <div className="flex items-center gap-2 sm:text-sm md:text-base">
                                        <span className="font-semibold">
                                          {average}
                                        </span>
                                        <span>
                                          <RatingStars rating={average} />
                                        </span>
                                        <span className="text-gray-600">
                                          ({count})
                                        </span>
                                      </div>
                                    )}
                                    <p className="text-left font-semibold sm:text-sm md:text-base">
                                      {d.price} BDT
                                    </p>
                                  </div>
                                  <div className="flex items-center justify-center w-full absolute bottom-0 left-0 px-2 py-2 ">
                                    <button className="uppercase text-sm bg-[#2e9e28] text-white w-full py-2 rounded-md">
                                      Enroll
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                        </Slider>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="px-5 mt-2">
        <HelpSection />
      </div>
    </Sidebar>
  );
};

export default AddCourse;
