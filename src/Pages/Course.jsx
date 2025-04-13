import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../components/axiosInstance";
import { useTheme } from "../components/ThemeContext";
import RatingStars from "../components/RatingStars";
import LoadingCard from "../components/LoadingCard";
const Course = () => {
  const navigate = useNavigate();
  const [Subject, setSubject] = useState([]);
  const [course, setCourse] = useState([]);
  const [feedback, setFeedBack] = useState([]);
  const [Search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [FilterData, setFilterData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const { theme } = useTheme();

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
      setLoading(true);
      try {
        const response = await axiosInstance.get("/courses/getAll");
        setCourse(response.data);
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

    fetchSubject();
    fetchCourse();
    fetchReview();
  }, []);

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
          slidesToShow: 3,
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

  const handlenextPage = (name) => {
    navigate(`/course-details/${name}`);
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

  const handleChangeSubject = () => {
    setLoading(true);
    let filter = [];

    if (Search && subjectName) {
      filter = course.filter(
        (data) =>
          data.course_name.toLowerCase().includes(Search.toLowerCase()) &&
          data.Subject?.name === subjectName
      );
    } else if (Search) {
      filter = course.filter((data) =>
        data.course_name.toLowerCase().includes(Search.toLowerCase())
      );
    } else if (subjectName) {
      filter = course.filter((data) => data.Subject?.name === subjectName);
    }

    if (filter.length > 0) {
      setFilterData(filter);
      setIsSearch(true);
    } else if ((Search || subjectName) && filter.length === 0) {
      setFilterData([]);
      setIsSearch(true);
    } else {
      setFilterData([]);
      setIsSearch(false);
    }

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  console.log("courses", course);
  return (
    <div className="container  md:px-0 m-auto pt-20 pb-4">
      <div
        className={`flex items-center mt-3 justify-center border-b flex-col gap-2 ${
          theme === "light" ? "border-gray-200" : "border-gray-500"
        } `}
      >
        <div className="bg-[#caf3c8] md:w-[40vw] uppercase justify-center gap-2 w-[100%] mb-4 px-2 py-3 flex items-center rounded">
          <div className="w-10">
            <img
              src="https://cdn-icons-png.flaticon.com/128/8521/8521795.png"
              alt=""
            />
          </div>
          <h2 className="text-3xl font-semibold text-[#2b5727]">Course List</h2>
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
          {isSearch ? (
            <div className="flex items-center justify-center w-full">
              {FilterData.length === 0 ? (
                <div className="h-[30vw] flex flex-col gap-2 items-center justify-center">
                  <img
                    className="w-[80px] h-[80px] z-5"
                    src="/Images/warning.png"
                    alt="Warning"
                  />
                  <h3 className="text-2xl font-semibold text-[#258335]">
                    Nothing found
                  </h3>
                  <p className="text-gray-500">Instead try searching</p>
                </div>
              ) : (
                <div className=" w-full !grid grid-cols-1 lg:!grid-cols-3 xl:!grid-cols-4 gap-2 md:!gap-3 py-3">
                  {FilterData.map((d) => {
                    const { average, count } = filter(d);
                    return (
                      <div
                        key={d.id}
                        className=" relative flex w-full flex-col  gap-0 rounded-lg  items-start shadow-md bg-trace-color overflow-hidden h-[330px] md:h-[300px] !border footer-border-color hover:!outline-1 hover:shadow"
                        onClick={() => handlenextPage(d.course_name)}
                      >
                        <div className="h-40 w-full flex justify-center items-center  ">
                          <img
                            src={d.Image?.image_url}
                            alt={d.course_name}
                            className="h-40 rounded-t-md w-full"
                          />
                        </div>

                        <div className="flex flex-col items-start justify-center gap-1 mt-2 px-2">
                          <p className="font-semibold">{d.course_name}</p>
                          {count > 0 && (
                            <div className="flex items-center md:gap-2">
                              <span className="font-semibold">{average}</span>
                              <span>
                                <RatingStars rating={average} />
                              </span>
                              <span className="">({count})</span>
                            </div>
                          )}
                          <p className="text-left font-semibold">
                            {d.price} BDT
                          </p>
                        </div>
                        <div className="flex items-center justify-center w-full absolute bottom-2 px-2">
                          <button
                            className={` ${
                              theme === "light"
                                ? "bg-gray-200 hover:bg-gray-300"
                                : "border text-white border-gray-800 hover:bg-gray-800 "
                            } uppercase font-semibold text-sm  text-black w-full py-2 rounded-md `}
                          >
                            See The Details
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
                    <h4
                      className={`${
                        theme === "light" ? "text-black " : "text-white "
                      } font-semibold text-center text-xl`}
                    >
                      {data?.name}
                    </h4>
                    <div className=" px-5 2xl:w-[80vw] lg:w-[74vw]  ">
                      {/* Removed the container and added overflow-hidden */}
                      <Slider {...settings}>
                        {course
                          .filter((d) => d.Subject?.name === data?.name)
                          .map((d) => {
                            const { average, count } = filter(d);

                            return (
                              <div
                                key={d.id}
                                className=" bg-trace-color !border footer-border-color shadow-md cursor-pointer h-[300px] w-full  m-2    transition-shadow duration-300 relative flex flex-col gap-0 rounded-lg items-start overflow-hidden   hover:shadow"
                                onClick={() => handlenextPage(d.course_name)}
                              >
                                <div className="h-40 w-full flex justify-center items-center">
                                  <img
                                    src={d.Image?.image_url}
                                    alt={d.course_name}
                                    className="h-40 rounded-t-md w-full"
                                  />
                                </div>

                                <div className="flex flex-col items-start justify-center gap-1 mt-2 px-2">
                                  <p className=" font-semibold ">
                                    {d.course_name}
                                  </p>
                                  {count > 0 && (
                                    <div className="flex items-center gap-2">
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
                                  <p className="text-left font-semibold">
                                    {d.price} BDT
                                  </p>
                                </div>
                                <div className="flex items-center justify-center w-full absolute bottom-2 px-2">
                                  <button
                                    className={` ${
                                      theme === "light"
                                        ? "bg-gray-200 hover:bg-gray-300"
                                        : "border text-white border-gray-800 hover:bg-gray-800 "
                                    } uppercase font-semibold text-sm  text-black w-full py-2 rounded-md `}
                                  >
                                    See The Details
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
  );
};

export default Course;
