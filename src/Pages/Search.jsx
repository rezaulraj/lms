import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { Link, useSearchParams } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import RatingStars from "../components/RatingStars";
import { WiTime4 } from "react-icons/wi";
import { MdFilterList } from "react-icons/md";
import { MdOutlineStarHalf, MdOutlineStarOutline } from "react-icons/md";
import { MdOutlineStarPurple500 } from "react-icons/md";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { RotatingLines } from "react-loader-spinner";

const renderStars = (fullStars, halfStar) => {
  return (
    <>
      {Array.from({ length: fullStars }, (_, index) => (
        <MdOutlineStarPurple500
          key={`full-${index}`}
          color="#b4690e"
          size={18}
        />
      ))}
      {halfStar && <MdOutlineStarHalf color="#b4690e" size={18} />}
      {Array.from(
        { length: 5 - fullStars - (halfStar ? 1 : 0) },
        (_, index) => (
          <MdOutlineStarOutline key={`empty-${index}`} color="gray" size={18} />
        )
      )}
    </>
  );
};
const FilterTag = ({ label, value, onRemove }) => (
  <div className="text-sm text-gray-500 border footer-border-color px-2 py-1 rounded-md flex items-center gap-1">
    {label}: {value}
    <XMarkIcon className="w-4 cursor-pointer" onClick={onRemove} />
  </div>
);

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q"); // Extract the 'q' parameter from the URL

  const [course, setCourse] = useState([]);
  const [courseCopyData, setCourseCopyData] = useState([]);
  const [feedBackData, setFeedBackData] = useState([]);
  const [subject, setSubject] = useState([]);
  const [ratingVisible, setRatingVisible] = useState(true);
  const [subjectVisible, setSubjectVisible] = useState(true);
  const [levelVisible, setLevelVisible] = useState(false);
  const [priceVisible, setPriceVisible] = useState(false);
  const [levelShowMore, setLevelShowMore] = useState(false);
  const [subjectCheck, setSubjectCheck] = useState("");
  const [ratingCheck, setRatingCheck] = useState("");
  const [priceCheck, setPriceCheck] = useState("");
  const [levelCheck, setLevelCheck] = useState("");
  const [filteredSubject, setfilteredSubject] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/courses/getAll");
        const filter = response.data.filter(
          (data) =>
            data.Subject?.name.toLowerCase() === query.toLowerCase() ||
            data.course_name.toLowerCase().includes(query.toLocaleLowerCase())
        );

        setCourse(filter);
        setCourseCopyData(filter);
        setInterval(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    const fetchSubject = async () => {
      try {
        const response = await axiosInstance.get("/subjects/getAll");
        setSubject(response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    const fetchReveiw = async () => {
      try {
        const response = await axiosInstance.get("/feedbacks/getAll");
        setFeedBackData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchCourse();
    fetchReveiw();
    fetchSubject();
  }, [query]);

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
    const result = feedBackData.filter(
      (data) => data.idCourses === item.idCourses
    );
    const ratingCounts = countRatings(result);
    return calculateAverageRating(ratingCounts);
  };

  const [visibleFilter, setVisibleFilter] = useState(true);

  useEffect(() => {
    const applyFilters = () => {
      setLoading(true);
      let filtered = courseCopyData;

      if (subjectCheck) {
        filtered = filtered.filter(
          (course) => course.Subject?.name === subjectCheck
        );
      }

      if (ratingCheck) {
        filtered = filtered.filter((course) => {
          const courseRatings = feedBackData.filter(
            (rating) => rating.Course?.idCourses === course.idCourses
          );

          return courseRatings.some((review) => review.rating == ratingCheck);
        });
      }

      if (priceCheck) {
        filtered = filtered.filter((course) => course.price <= priceCheck);
      }

      if (levelCheck) {
        filtered = filtered.filter((course) => course.level === levelCheck);
      }

      setCourse(filtered);
      setInterval(() => {
        setLoading(false);
      }, 5000);
    };

    applyFilters();
  }, [
    subjectCheck,
    ratingCheck,
    priceCheck,
    levelCheck,
    feedBackData,
    courseCopyData,
  ]);
  const [FilterSidebarVisible, setFilterSidebarVisible] = useState(false);
  const FilterSidebarVisibleRef = useRef();

  const handleClickOutside = useCallback((event) => {
    if (
      FilterSidebarVisibleRef.current &&
      !FilterSidebarVisibleRef.current.contains(event.target)
    ) {
      setFilterSidebarVisible(false);
    }
  }, []);

  useEffect(() => {
    // Prevent scrolling when the menu is open
    if (FilterSidebarVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    // Close menu on outside click

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("no-scroll"); // Clean up no-scroll class
    };
  }, [FilterSidebarVisible, handleClickOutside]);

  useEffect(() => {
    const filter = subject.find((data) => data.name == query);
    setfilteredSubject(filter);
  }, [query, subject]);

  const handleClearFilter = () => {
    setPriceCheck("");
    setRatingCheck("");
    setLevelCheck("");
    setSubjectCheck("");
    setFilterSidebarVisible(false);
  };

  return (
    <div className="container m-auto w-full py-20 md:!py-24 ">
      <div>
        {courseCopyData.length > 0 ? (
          <>
            <h1 className="text-2xl font-medium pb-3 text_theme">
              {course.length} results for “{query}”
            </h1>
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center justify-between w-full gap-2 md:text-base text-sm  ">
                <div className="flex items-center gap-4">
                  <button
                    className=" hidden bg-trace-color footer-border-color  px-3 py-2 border md:flex items-center justify-center "
                    onClick={() => {
                      setVisibleFilter(!visibleFilter);
                    }}
                  >
                    <MdFilterList size={20} />{" "}
                    <p className="text-lg font-semibold">Filter </p>
                  </button>
                  <button
                    className="md:hidden bg-trace-color footer-border-color  px-3 py-1 border flex items-center justify-center"
                    onClick={() => {
                      setFilterSidebarVisible(!FilterSidebarVisible);
                    }}
                  >
                    <MdFilterList size={20} />{" "}
                    <p className="text-lg font-semibold">Filter</p>
                  </button>
                  <div className="md:flex items-center gap-2 hidden">
                    {ratingCheck && (
                      <FilterTag
                        label="Rating"
                        value={`${ratingCheck} & up`}
                        onRemove={() => setRatingCheck("")}
                      />
                    )}
                    {subjectCheck && (
                      <FilterTag
                        label="Subject"
                        value={subjectCheck}
                        onRemove={() => setSubjectCheck("")}
                      />
                    )}
                    {levelCheck && (
                      <FilterTag
                        label="Level"
                        value={levelCheck}
                        onRemove={() => setLevelCheck("")}
                      />
                    )}
                    {priceCheck && (
                      <FilterTag
                        label="Price"
                        value={priceCheck}
                        onRemove={() => setPriceCheck("")}
                      />
                    )}

                    {(priceCheck ||
                      levelCheck ||
                      ratingCheck ||
                      subjectCheck) && (
                      <div
                        onClick={() => {
                          handleClearFilter();
                        }}
                        className="text-xs text-coching-text_color  px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer "
                      >
                        Clear All
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text_theme">
                  <h3 className="text-sm">Sort by : </h3>
                  <select
                    id="select"
                    className=" outline-none rounded-md bg-trace-color footer-border-color border px-3 py-2 flex flex-col items-start  cursor-pointer"
                  >
                    <option value="">Most Relevent</option>
                    <option value="">Most Reviewd</option>
                    <option value="">Highest Rated</option>
                    <option value="">Newest</option>
                  </select>
                </div>
              </div>
            </div>
            {FilterSidebarVisible && (
              <div className="absolute w-[100vw] z-50 top-0 md:top-[60px] right-0 h-full min-h-screen bg-ostad-black-60">
                <div className="flex items-center justify-center absolute right-24 top-3 w-10 h-10  bg-white rounded-full transition-all">
                  <XMarkIcon s className=" cursor-pointer  h-7  text-black" />
                </div>
              </div>
            )}
            <div className="flex items-start w-full gap-5">
              {visibleFilter && (
                <div
                  ref={FilterSidebarVisibleRef}
                  className={`fixed top-0  left-0 h-full rounded-tr-lg bg-trace-color transition-transform duration-300 ${
                    FilterSidebarVisible
                      ? "translate-x-0 z-50  md:z-0 shadow-lg w-[60%] px-3 "
                      : "translate-x-[-100%]  z-50 md:z-0"
                  } md:translate-x-0 md:relative md:block md:shadow-none  md:mt-4 md:w-[22%]`}
                >
                  <div className="border-t  py-4 ">
                    <button
                      className="flex items-center justify-between w-full"
                      onClick={() => setRatingVisible(!ratingVisible)}
                    >
                      <h3 className="md:text-xl text-sm  font-semibold">
                        Ratings
                      </h3>
                      {ratingVisible ? (
                        <IoIosArrowUp size={18} />
                      ) : (
                        <IoIosArrowDown size={18} />
                      )}
                    </button>
                    {ratingVisible && (
                      <div className="flex flex-col gap-1 py-2">
                        <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer ">
                          <input
                            type="radio"
                            id="radio1"
                            checked={ratingCheck === 5}
                            onChange={() => setRatingCheck(5)}
                            value={5}
                          />
                          <label
                            htmlFor="radio1"
                            className="flex items-center cursor-pointer"
                          >
                            {renderStars(4, true)}
                            <div className="ml-2">4.5 & up</div>
                          </label>
                        </div>
                        <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                          <input
                            type="radio"
                            id="radio2"
                            checked={ratingCheck === 4}
                            onChange={() => setRatingCheck(4)}
                            value={4}
                          />
                          <label
                            htmlFor="radio2"
                            className="flex items-center cursor-pointer"
                          >
                            {renderStars(4)}
                            <div className="ml-2">4.0 & up</div>
                          </label>
                        </div>
                        <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                          <input
                            type="radio"
                            id="radio3"
                            checked={ratingCheck === 3}
                            onChange={() => setRatingCheck(3)}
                            value={3}
                          />
                          <label
                            htmlFor="radio3"
                            className="flex items-center cursor-pointer"
                          >
                            {renderStars(3)}
                            <div className="ml-2">3.0 & up</div>
                          </label>
                        </div>
                        <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                          <input
                            type="radio"
                            id="radio4"
                            checked={ratingCheck === 2}
                            onChange={() => setRatingCheck(2)}
                            value={2}
                          />
                          <label
                            htmlFor="radio4"
                            className="flex items-center cursor-pointer"
                          >
                            {renderStars(2)}
                            <div className="ml-2">2.0 & up</div>
                          </label>
                        </div>
                        <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                          <input
                            type="radio"
                            id="radio5"
                            checked={ratingCheck === 1}
                            onChange={() => setRatingCheck(1)}
                            value={1}
                          />
                          <label
                            htmlFor="radio5"
                            className="flex items-center cursor-pointer"
                          >
                            {renderStars(1)}
                            <div className="ml-2">1.0 & up</div>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="border-t  py-4">
                    <button
                      className="flex items-center justify-between w-full"
                      onClick={() => setSubjectVisible(!subjectVisible)}
                    >
                      <h3 className="md:text-xl text-sm font-semibold">
                        Subject
                      </h3>
                      {subjectVisible ? (
                        <IoIosArrowUp size={18} />
                      ) : (
                        <IoIosArrowDown size={18} />
                      )}
                    </button>
                    {filteredSubject ? (
                      <div className="py-2">{filteredSubject.name}</div>
                    ) : (
                      <div>
                        {subjectVisible && (
                          <div className="flex flex-col gap-2 py-2">
                            {subject &&
                              subject.map((data, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 md:text-base text-sm cursor-pointer "
                                >
                                  <input
                                    type="checkbox"
                                    id={`subject_${data.name}`}
                                    value={data.name}
                                    checked={subjectCheck === data.name}
                                    onChange={(e) =>
                                      setSubjectCheck(e.target.value)
                                    }
                                  />
                                  <label
                                    htmlFor={`subject_${data.name}`}
                                    className="cursor-pointer"
                                  >
                                    {data.name}
                                  </label>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="border-t  py-4">
                    <button
                      className="flex items-center justify-between w-full"
                      onClick={() => setLevelVisible(!levelVisible)}
                    >
                      <h3 className="md:text-xl text-sm font-semibold">
                        Level
                      </h3>
                      {levelVisible ? (
                        <IoIosArrowUp size={18} />
                      ) : (
                        <IoIosArrowDown size={18} />
                      )}
                    </button>
                    {levelVisible && (
                      <>
                        <div
                          className={`flex flex-col gap-2 py-2  ${
                            levelShowMore
                              ? "h-auto"
                              : "overflow-y-hidden h-[16vh]"
                          } `}
                        >
                          <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              id="class 6"
                              onChange={(e) => setLevelCheck(e.target.value)}
                              checked={levelCheck === "class 6"}
                              value={"class 6"}
                              className="cursor-pointer"
                            />
                            <label htmlFor="class 6" className="cursor-pointer">
                              Class 6
                            </label>
                          </div>
                          <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              id="class 7"
                              onChange={(e) => setLevelCheck(e.target.value)}
                              checked={levelCheck === "class 7"}
                              value={"class 7"}
                              className="cursor-pointer"
                            />
                            <label htmlFor="class 7">Class 7</label>
                          </div>
                          <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              id="class 8"
                              onChange={(e) => setLevelCheck(e.target.value)}
                              checked={levelCheck === "class 8"}
                              value={"class 8"}
                              className="cursor-pointer"
                            />
                            <label htmlFor="class 8">Class 8</label>
                          </div>
                          <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              id="checkbox"
                              onChange={(e) => setLevelCheck(e.target.value)}
                              checked={levelCheck === "class 9"}
                              value={"class 9"}
                              className="cursor-pointer"
                            />
                            <div>Class 9</div>
                          </div>
                          <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              id="checkbox"
                              onChange={(e) => setLevelCheck(e.target.value)}
                              checked={levelCheck === "class 10"}
                              value={"class 10"}
                              className="cursor-pointer"
                            />
                            <div>Class 10</div>
                          </div>
                          <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              id="checkbox"
                              onChange={(e) => setLevelCheck(e.target.value)}
                              checked={levelCheck === "HSC"}
                              value={"HSC"}
                            />
                            <div>HSC</div>
                          </div>
                          <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                            <input
                              type="checkbox"
                              id="checkbox"
                              onChange={(e) => setLevelCheck(e.target.value)}
                              checked={levelCheck === "Addmission"}
                              value={"Addmission"}
                            />
                            <div>Addmission</div>
                          </div>
                        </div>
                        <button
                          className="mt-2 text-sm flex gap-3 items-center text-coching-text_color font-medium"
                          onClick={() => setLevelShowMore(!levelShowMore)}
                        >
                          {levelShowMore ? (
                            <div className="flex gap-3 items-center">
                              Less More
                              <IoIosArrowUp size={17} />
                            </div>
                          ) : (
                            <div className="flex gap-3 items-center">
                              Show More
                              <IoIosArrowDown size={17} />
                            </div>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                  <div className="border-t border-b  py-4">
                    <button
                      className="flex items-center justify-between w-full"
                      onClick={() => setPriceVisible(!priceVisible)}
                    >
                      <h3 className="md:text-xl text-sm font-semibold">
                        Price
                      </h3>
                      {priceVisible ? (
                        <IoIosArrowUp size={18} />
                      ) : (
                        <IoIosArrowDown size={18} />
                      )}
                    </button>
                    {priceVisible && (
                      <div className="flex flex-col gap-2 py-2">
                        <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            id="checkbox"
                            onChange={(e) => setLevelCheck(e.target.value)}
                            checked={levelCheck === "class 7"}
                          />
                          <div>Paid</div>
                        </div>
                        <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            id="checkbox"
                            onChange={(e) => setLevelCheck(e.target.value)}
                            checked={levelCheck === "class 7"}
                          />
                          <div>Free</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full md:hidden flex">
                    <button
                      className="border px-2 py-2 bg-yellow-600 text-white w-[50%] "
                      onClick={handleClearFilter}
                    >
                      Reset
                    </button>
                    <button
                      className="border px-2 py-2 bg-coching-text_color text-white w-[50%]"
                      onClick={() => setFilterSidebarVisible(false)}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
              <div className={` ${visibleFilter ? "md:w-[77%]" : "w-full"} `}>
                <div className="w-full flex flex-col gap-6">
                  <div className="flex items-center gap-2 md:text-base text-sm cursor-pointer smx:gap-4">
                    <img
                      className="w-8 h-8 smx:w-10 smx:h-10"
                      src="/Images/Webinar.png"
                      alt="Webinar"
                    />
                    <p className="text-h5 smx:text-h3 whitespace-nowrap title">
                      Courses
                    </p>
                    <div className="grow h-px border-b footer-border-color"></div>
                  </div>
                  {loading ? (
                    <div className="h-[30vw] flex items-center justify-center">
                      <h3 className="text-xl text-[#258335]">
                        <RotatingLines
                          visible={true}
                          height="96"
                          width="70"
                          color="grey"
                          strokeWidth="5"
                          animationDuration="0.75"
                          ariaLabel="rotating-lines-loading"
                        />
                      </h3>
                    </div>
                  ) : (
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-3">
                      {course &&
                        course.map((data, index) => {
                          const { average, count } = filter(data);
                          return (
                            <div key={index}>
                              <Link
                                id=""
                                className="w-full h-full"
                                to={`/course-details/${data.course_name}`}
                              >
                                <div
                                  className="relative flex w-full flex-col gap-0 rounded-lg items-start bg-trcae-color overflow-hidden h-full border footer-border-color hover:border-ostad-black-40 hover:outline-1 hover:outline-ostad-black-40 hover:shadow"
                                  title={data.course_name}
                                >
                                  <div className="w-full h-auto aspect-video overflow-hidden">
                                    <img
                                      src={data.Image?.image_url}
                                      className="w-full h-auto aspect-video object-fill"
                                      alt={data.course_name}
                                      loading="lazy"
                                    />
                                  </div>

                                  <div className="flex flex-col w-full justify-between gap-1 grow">
                                    <div className="pb-0 px-2 pt-2 md:py-2 md:px-4 flex flex-col gap-1 text_theme">
                                      <p className="text-body-b2 font-bold md:text-h5  line-clamp-3">
                                        {data.course_name}
                                      </p>
                                      {count > 0 && (
                                        <div className="flex items-center md:gap-2">
                                          <span className="font-semibold">
                                            {average}
                                          </span>
                                          <span>
                                            <RatingStars rating={average} />
                                          </span>
                                          <span className="">({count})</span>
                                        </div>
                                      )}
                                      <p className="text-left font-semibold text-sm">
                                        {data.price} BDT
                                      </p>
                                    </div>
                                    <div className="w-full bg-none md:bg-ostad-black-bg px-2 pt-0 pb-2 md:px-4 md:py-3">
                                      {/* Mobile button */}
                                      <div className="w-full sm:hidden">
                                        <button
                                          id=""
                                          type="button"
                                          className="group w-full flex gap-2 justify-center border footer-border-color items-center transition-all duration-200 active:scale-98 h-8 px-3 py-2 rounded bg-trace-20 text_theme"
                                          style={{ padding: "8px 12px" }}
                                        >
                                          <p className="uppercase whitespace-nowrap transition-all duration-200 text-nav-menu ">
                                            See The Details
                                          </p>
                                          <img
                                            className="transition-all duration-200 w-5 h-5 min-w-[20px] invert brightness-0"
                                            src="https://cdn.ostad.app/public/icons/arrow-right-line.svg"
                                            alt="Arrow Right"
                                          />
                                        </button>
                                      </div>
                                      {/* Desktop button */}
                                      <div className="w-full hidden sm:block">
                                        <button
                                          id=""
                                          type="button"
                                          className="group w-full flex gap-2 justify-center items-center transition-all duration-200 active:scale-98 h-10 px-6 py-2 rounded-md bg-trace-20  border footer-border-color text_theme"
                                          style={{ padding: "8px 12px" }}
                                        >
                                          <p className="uppercase whitespace-nowrap transition-all duration-200 text-button ">
                                            See The Details
                                          </p>
                                          <IoMdArrowForward className="transition-all duration-200 w-5 h-5 min-w-[20px]" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
                {(ratingCheck || subjectCheck || priceCheck || levelCheck) &&
                  course.length == 0 &&
                  !loading && (
                    <div className="w-full flex flex-col gap-1.5 items-center md:py-14 py-12 ">
                      <div className="flex flex-col items-center">
                        <img
                          className="w-16 h-16 mb-1"
                          src="/Images/notFound.svg"
                          alt="No results found"
                        />
                        <p className="text-h5 text-center text-trace-black-40">
                          We're sorry. We cannot find any matches for your
                          search term.
                        </p>
                        <p className="text-base text-trace-black-20 mt-2">
                          Instead, try searching this way
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col gap-1.5 items-center md:py-14 py-12 ">
            <div className="flex flex-col items-center">
              <img
                className="w-16 h-16 mb-1"
                src="/Images/notFound.svg"
                alt="No results found"
              />
              <p className="text-h5 text-center text-trace-black-40">
                We're sorry. We cannot find any matches for "{query}""
              </p>
              <p className="text-base text-trace-black-20 mt-2">
                Instead, try searching this way
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
