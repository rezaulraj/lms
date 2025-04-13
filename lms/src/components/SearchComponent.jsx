import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import TrendingSearches from "./TrendingSearches";
import { IoMdClose } from "react-icons/io";
import { CiSearch } from "react-icons/ci";

// Utility function to highlight matching text
const highlightText = (text, highlight) => {
  if (!highlight.trim()) {
    return text;
  }

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === highlight.toLowerCase() ? (
      <mark key={index}>{part}</mark>
    ) : (
      part
    )
  );
};

const SearchComponent = ({
  handleClose,
  searchInputRef,
  searchInputMobileRef,
}) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [searchValue, setSearchValue] = useState(query || "");
  const [subject, setSubject] = useState([]);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [subjectFilterData, setSubjectFilterData] = useState([]);
  const navigate = useNavigate();

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
        const response = await axiosInstance.get("/courses/getAll");
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchSubject();
    fetchCourse();
  }, []);

  useEffect(() => {
    const handleInputChange = () => {
      if (searchValue) {
        setLoading(true);

        const filter1 = course.filter((data) =>
          data.course_name.toLowerCase().includes(searchValue.toLowerCase())
        );
        const filter2 = subject.filter((data) =>
          data.name.toLowerCase().includes(searchValue.toLowerCase())
        );

        setSubjectFilterData(filter2);
        setFilterData(filter1);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
      }
    };
    handleInputChange();
  }, [course, searchValue, subject]);

  const clearSearch = (e) => {
    e.preventDefault();
    setSearchValue("");
    searchInputRef.current.focus(); // Refocus input after clearing
    searchInputMobileRef.current.focus(); // Refocus input after clearing
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      handleClose();
    }
  };

  return (
    <>
      {/* Desktop View */}
      <div className="relative z-50 w-full hidden md:flex flex-col gap-2 p-1.5 rounded-t-xl bg-white ">
        <div className="w-full flex items-center gap-1">
          <div className="grow rounded-full smx:!border-0 smx:!rounded-none smx:!p-0">
            <form
              onSubmit={handleSearch}
              className="w-full flex justify-between items-center gap-2 !pl-1.5"
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search for courses"
                className="flex-grow outline-none text-black py-1"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {loading ? (
                <span className="loader"></span>
              ) : (
                searchValue && (
                  <button
                    className="w-6 h-6"
                    title="Clear"
                    type="button"
                    onClick={clearSearch}
                  >
                    <IoMdClose className="w-full h-full opacity-50 text-black hover:opacity-100 transition-all duration-300" />
                  </button>
                )
              )}
            </form>
          </div>
          <div className="w-full absolute top-10 left-0 bg-white min-h-[198px] border-t px-2 rounded-b-xl">
            <div className="w-full flex flex-col gap-1">
              {searchValue ? (
                <>
                  {subjectFilterData.length === 0 && filterData.length === 0 ? (
                    <div className="w-full flex flex-col gap-1.5 items-center py-6">
                      <div className="flex flex-col items-center">
                        <img
                          className="w-16 h-16 mb-1"
                          src="/Images/notFound.svg"
                          alt="No results found"
                        />
                        <p className="text-h5 text-trace-black-40">
                          Nothing found
                        </p>
                        <p className="text-base text-trace-black-20">
                          Instead, try searching this way
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {subjectFilterData.map((data, index) => (
                        <a
                          key={index}
                          href={`/search?q=${encodeURIComponent(data.name)}`}
                          onClick={handleClose}
                        >
                          <div className="w-full flex items-center gap-2 p-1 rounded-sm cursor-pointer hover:bg-gray-100">
                            <CiSearch
                              className=" text-black opacity-50"
                              size={19}
                              alt="Search icon"
                            />
                            <div className="text-body-b2 text-black">
                              {highlightText(data.name, searchValue)}
                            </div>
                          </div>
                        </a>
                      ))}
                      {filterData.map((data, index) => (
                        <Link
                          key={index}
                          to={`/course-details/${data.course_name}`}
                          className="hover:bg-gray-100"
                          onClick={handleClose}
                        >
                          <div className="w-full flex items-center justify-between gap-4 p-1.5 rounded-sm hover:bg-gray-100 cursor-pointer">
                            <div className="grow flex items-center gap-1.5">
                              <img
                                className="w-10 h-7 object-cover rounded"
                                src={data.Image?.image_url}
                                alt="Course"
                              />
                              <div className="grow text-body-b2 text-black line-clamp-2">
                                {highlightText(data.course_name, searchValue)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <TrendingSearches handleClose={handleClose} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="grow md:hidden flex items-center gap-0 md:gap-4 justify-end md:justify-start">
        <div className="w-[100vw] absolute top-0 left-0 smx:static smx:grow smx:h-10 h-full">
          <div className="relative z-20 w-full h-screen smx:h-fit flex flex-col gap-2 p-1.5 smx:rounded-2xl smx:border border-ostad-black-overlay bg-white">
            <div className="w-full flex items-center gap-1">
              <button className="smx:hidden" onClick={handleClose}>
                <img
                  className="w-5 h-5"
                  src="https://cdn.ostad.app/public/icons/arrow-left-line.svg"
                  alt="Back"
                />
              </button>
              <div className="grow border  rounded-full p-1 smx:border-0 smx:rounded-none smx:p-0">
                <form
                  onSubmit={handleSearch}
                  className="w-full flex justify-between items-center gap-2 !pl-1.5 "
                >
                  <input
                    ref={searchInputMobileRef}
                    type="text"
                    placeholder="Search for courses"
                    className="flex-grow outline-none text-black py-1  "
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  {loading ? (
                    <span className="loader"></span>
                  ) : (
                    searchValue && (
                      <button
                        className="w-6 h-6"
                        title="Clear"
                        type="button"
                        onClick={clearSearch}
                      >
                        <IoMdClose className="w-full h-full opacity-50 text-black hover:opacity-100 transition-all duration-300" />
                      </button>
                    )
                  )}
                </form>
              </div>
            </div>
            <div className="w-full h-px border-b border-grabg-gray-100"></div>
            <div className="w-full min-h-[198px]">
              <div className="w-full flex flex-col gap-1">
                {searchValue ? (
                  <>
                    {subjectFilterData.length === 0 &&
                    filterData.length === 0 ? (
                      <div className="w-full flex flex-col gap-1.5 items-center py-6">
                        <div className="flex flex-col items-center">
                          <img
                            className="w-16 h-16 mb-1"
                            src="/Images/notFound.svg"
                            alt="No results found"
                          />
                          <p className="text-h5 text-trace-black-40">
                            Nothing found
                          </p>
                          <p className="text-base text-trace-black-20">
                            Instead, try searching this way
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {subjectFilterData.map((data, index) => (
                          <Link
                            key={index}
                            to={`/search?q=${encodeURIComponent(data.name)}`}
                            onClick={handleClose}
                          >
                            <div className="w-full flex items-center gap-2 p-1 rounded-sm cursor-pointer hover:bg-gray-100">
                              <CiSearch
                                className=" text-black opacity-50"
                                size={19}
                                alt="Search icon"
                              />
                              <div className="text-body-b2 text-black">
                                {highlightText(data.name, searchValue)}
                              </div>
                            </div>
                          </Link>
                        ))}
                        {filterData.map((data, index) => (
                          <Link
                            key={index}
                            to={`/course-details/${data.course_name}`}
                            className="hover:bg-gray-100"
                            onClick={handleClose}
                          >
                            <div className="w-full flex items-center justify-between gap-4 p-1.5 rounded-sm hover:bg-gray-100 cursor-pointer">
                              <div className="grow flex items-center gap-1.5">
                                <img
                                  className="w-10 h-7 object-cover rounded"
                                  src={data.Image?.image_url}
                                  alt="Course"
                                />
                                <div className="grow text-body-b2 text-black line-clamp-2">
                                  {highlightText(data.course_name, searchValue)}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <TrendingSearches handleClose={handleClose} />
                )}
              </div>
            </div>
          </div>
          <div className="absolute top-16 md:top-[72px] left-0 w-full h-full min-h-screen bg-ostad-black-60/60"></div>
        </div>
      </div>
    </>
  );
};

export default SearchComponent;
