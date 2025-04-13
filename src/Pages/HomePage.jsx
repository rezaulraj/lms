import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import img1 from "../assets/download.svg";
import img4 from "../assets/peep1.f4841716.svg";
import Instructor from "../assets/Ibrahim.jpg";
import Review1 from "../assets/23.jpeg";
import Merinasoft from "../assets/merinasoft.png";
import { useTheme } from "../components/ThemeContext";
import axiosInstance from "../components/axiosInstance";
import RatingStars from "../components/RatingStars";
import { IoIosArrowDown } from "react-icons/io";
import SupportButton from "../components/SupportButton";
import DownloadAppBanner from "../components/DownloadAppBanner ";
import LoadingCard from "../components/LoadingCard";
import Faqs from "./faq/FaqsCard";
import BookCard from "./book/BookCard";

const imageStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  boxSizing: "border-box",
  padding: 0,
  border: "none",
  margin: "auto",
  display: "block",
  width: 0,
  height: 0,
  minWidth: "100%",
  maxWidth: "100%",
  minHeight: "100%",
  maxHeight: "100%",
  objectFit: "cover",
};
const HomePage = () => {
  const [visible, setVisible] = useState(false);
  const { theme } = useTheme();
  const [feedBackData, setFeedBack] = useState([]);
  const containerRef = useRef(null);
  const [visibleButton, setvisibleButton] = useState(false);
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState([]);

  const handleReview = () => {
    setVisible(true);
  };
  const fetchReveiw = async () => {
    try {
      const response = await axiosInstance.get("api/get_room/");

      setFeedBack(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/courses/getAll");
      setCourse(response.data);
      setInterval(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  useEffect(() => {
    fetchReveiw();
    fetchCourse();
  }, []);

  useEffect(() => {
    const checkHeight = () => {
      if (containerRef.current) {
        setvisibleButton(containerRef.current.scrollHeight > 700);
      }
    };
    checkHeight();
    window.addEventListener("resize", checkHeight);
    return () => window.removeEventListener("resize", checkHeight);
  }, [feedBackData, theme]);

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

  console.log("coruse data", course);
  return (
    <div className="py-20 container m-auto">
      <section
        id="Home"
        className="grid sm:grid-cols-10 gap-10 justify-center items-center"
      >
        <div className="bg-coching-nav_color col-span-4 rounded-full flex justify-center items-center">
          <div className="w-90 h-90 rounded-full overflow-hidden">
            <img
              src={"/Images/banner.png"}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
        </div>
        <div className="col-span-5 flex flex-col justify-center items-center">
          <h1 className="text_theme text-5xl sm:w-[400px] items-center font-bold sm:mb-3">
            Improve Your Online Learning Expreience Better Instantly
          </h1>
          <p
            className={`${
              theme === "light" ? "text-black" : "text-white"
            }  text-xl mt-6 text-left sm:ml-20`}
          >
            We Have 7+ Online Courses more then 1000+ Online Registered
            Students. Find your desiered course from them.
          </p>

          <div className="mt-8 sm:ml-[-100px]">
            <div className="flex items-center">
              <span className="w-[30px] h-[30px] bg-slate-200 rounded-full">
                <img
                  src={"/Images/img1.png"}
                  className="w-full h-full object-cover rounded-full"
                  alt=""
                />
              </span>
              <span className="w-[30px] h-[30px] bg-slate-200 rounded-full ml-[-15px] z-10">
                <img
                  src={"/Images/img2.jpg"}
                  className="w-full h-full object-cover rounded-full"
                  alt=""
                />
              </span>
              <span className="w-[30px] h-[30px] bg-slate-200 rounded-full ml-[-15px] z-20">
                <img
                  src={"/Images/img3.png"}
                  className="w-full h-full object-cover rounded-full"
                  alt=""
                />
              </span>
              <p
                className={`${
                  theme === "light" ? "text-black" : "text-white"
                } text-md text-left`}
              >
                1000+ Student Already truested us.
              </p>
              <Link
                to={"/course"}
                className="text-coching-text_color ml-3 font-bold"
              >
                View Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="Course" className="grid justify-center items-center">
        <span className="text-[40px] text_theme font-bold flex justify-center items-center mt-8 divide-y divide-yellow-300 ">
          Our <span className="ml-3 text-coching-text_color"> Courses</span>
        </span>
        <div className=" w-full !grid grid-cols-2 md:!grid-cols-3 lg:!grid-cols-4 gap-2 md:!gap-3 py-3 mt-5 justify-center">
          {loading
            ? Array.from({ length: 8 }, (_, index) => (
                <LoadingCard key={index} />
              ))
            : course.slice(0, 8).map((d, index) => {
                const { average, count } = filter(d);
                return (
                  <Link key={index} to={`/course-details/${d.course_name}`}>
                    <div className=" relative flex w-full flex-col gap-0 rounded-lg items-start shadow-md bg-trace-color overflow-hidden h-[330px] md:h-[315px] !border footer-border-color hover:!outline-1 hover:shadow">
                      <div className="h-40 w-full flex justify-center items-center">
                        <img
                          src={d.Image?.image_url}
                          alt={d.course_name}
                          className="h-40 rounded-t-md w-full"
                        />
                      </div>

                      <div className="flex flex-col items-start justify-center gap-1 mt-2 px-2">
                        <p className=" font-semibold ">{d.course_name}</p>
                        {count > 0 && (
                          <div className="flex items-center md:gap-2">
                            <span className="font-semibold">{average}</span>
                            <span>
                              <RatingStars rating={average} />
                            </span>
                            <span className="">({count})</span>
                          </div>
                        )}
                        <p className="text-left font-semibold">{d.price} BDT</p>
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
                  </Link>
                );
              })}
        </div>

        <div className="flex justify-center items-center mt-3">
          <div className="w-1/2 md:w-1/4">
            <Link
              to={"/course"}
              className={`btn  uppercase font-medium ${
                theme === "light"
                  ? "bg-gray-200"
                  : " border border-gray-800 text-white"
              }`}
              style={{
                borderRadius: "5px",
                height: "40px",
                padding: "8px 24px",
                fontSize: "14px",
              }}
            >
              <div className="flex justify-center items-center gap-2">
                <p className="whitespace-nowrap">See More</p>
                <div className="flex justify-center items-center">
                  <IoIosArrowDown size={18} />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Book Corners */}
      <section className="border-b-4 border-t-4 border-lmsfontend-text_color mt-8">
        <span className="text-[40px] text_theme font-bold flex justify-center items-center mt-8 divide-y divide-yellow-300 ">
          Book <span className="ml-3 text-coching-text_color"> Corners</span>
        </span>
        <BookCard />
        <BookCard />
      </section>

      {/* Vocab Corners Start*/}
      <section>
        <span className="text-[40px] text_theme font-bold flex justify-center items-center mt-8 divide-y divide-yellow-300 ">
          Vocab <span className="ml-3 text-coching-text_color"> Corners</span>
        </span>
        {/*  */}
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center bg-lmsfontend-secondary_color p-8 rounded-3xl">
            <div className="md:col-span-3 space-y-6">
              <h1 className="text-4xl font-semibold font-serif">
                Boost Your Vocab Skill With Us
              </h1>
              <p className="font-light text-xl">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum,
                porro.
              </p>
              <Link to={"/vocabulary"}>
                <button className="bg-black text-white font-bold text-xl mt-4 px-6 py-3">
                  Try In Here
                </button>
              </Link>
            </div>
            <div className="md:col-span-9 flex items-start justify-start md:items-center md:justify-center">
              <img src="/vocab.png" alt="" className="w-[35rem] h-[25rem]" />
            </div>
          </div>
        </div>
        {/* <VocabCard /> */}
      </section>

      {/* Vocab Corners End */}

      {/* Founder Corners  */}
      <section
        className={`wrapper border-t  ${
          theme === "light" ? "border-gray-100" : "border-gray-700"
        }    !bg-primary1 mt-10`}
      >
        <div className=" space-y-14">
          <h1
            className={`${
              theme === "light" ? "text-black " : "text-white"
            } text-center text-4xl font-semibold`}
          >
            A few words about the founder
          </h1>
          <div className="flex flex-col gap-y-10 lg:flex-row">
            <div className="relative w-full text-center ">
              <div className="nextjs-image rounded-1 !shadow-1 relative z-10 mx-auto h-[300px] w-[200px] origin-bottom-right -rotate-6 transform !border-4 lg:h-[360px] lg:w-[280px]">
                <span className="style_course_instructor">
                  <span className="style_course_first_span">
                    <img src={img1} alt="" className="img_instructor" />
                  </span>

                  <img
                    alt="Sumit Saha - Instructor"
                    src={`./admin.jpg`} // Remove the "&amp;" and replace it with "&"
                    decoding="async"
                    data-nimg="intrinsic"
                    className="instructor_second"
                  />
                  <noscript>
                    <img
                      alt="Sumit Saha - Instructor"
                      srcSet={`${Merinasoft}&w=640&q=75 1x, ${Merinasoft}&w=828&q=75 2x`}
                      src={`${Merinasoft}?w=828&q=75`}
                      decoding="async"
                      data-nimg="intrinsic"
                      style={imageStyle}
                      loading="lazy"
                    />
                  </noscript>
                </span>
              </div>
              <div className="rounded-1 absolute right-[25%] md:-top-[-20px] -bottom-3 z-0 mx-auto h-[300px] w-[200px] border-4 border-white !bg-[#8E6AC8] lg:h-[350px] lg:w-[280px]"></div>
            </div>
            <div
              className="w-full self-center p-6 lg:border-l-2 lg:border-yellow-400
            "
            >
              <p className="text-normal font-medium text-gray-500 dark:text-slate-400">
                Shampod Bhowmick is a technology entrepreneur. In 2008, he
                founded Merinasoft, the Software Company in Bangladesh, while
                studying computer science and engineering at BUET. His passion
                for programming and interest in teaching people led him to
                establish the Trace Academi platform in 2020, where there are
                over 350 programming-related video tutorials. Trace Academi's
                YouTube channel and public Facebook group have attracted more
                than a million people who are learning programming for free.
              </p>
              <p className="text-normal font-medium mt-2 text-gray-500	 dark:text-slate-400">
                He is also a full-stack web developer and software architect
                with over 3 years of experience in web development and software
                professions.
              </p>
              <h1 className="text-small mt-8 font-bold text-slate-50">
                Shampod Bhowmick
              </h1>
              <p className="text-small text-white">
                Founder - Crowning English
              </p>
              <div className="nextjs-image mt-4 pb-3 h-15 w-[60px]">
                <span
                  style={{
                    boxSizing: "border-box",
                    display: "inline-block",
                    overflow: "hidden",
                    width: "initial",
                    height: "initial",
                    background: "none",
                    opacity: 1,
                    border: 0,
                    margin: 0,
                    padding: 0,
                    position: "relative",
                    maxWidth: "100%",
                  }}
                >
                  <span className="style_course_first_span">
                    <img
                      src={"./Logomark.png"}
                      alt=""
                      className="img_instructor "
                    />
                  </span>

                  <img src={"./Logomark.png"} alt="" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="Feedback" className="divide-y-4 divide-green-200">
        <span className="text-[40px] font-bold flex justify-center items-center mt-4 text_theme divide-y divide-yellow-300 ">
          প্রায়শই জিজ্ঞাসিত
          <span className="ml-3 text-coching-text_color">
            {" "}
            প্রশ্ন এবং উত্তর
          </span>
        </span>
        {/* <div className="grid sm:grid-cols-12 mt-10">
          <div className="col-span-5 items-center">
            <img
              src={"/Images/feedback.png"}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="col-span-5 mt-10 flex flex-col justify-center">
            <h2
              className={`${
                theme === "light" ? "text-black" : "text-violet-100"
              } text-3xl  font-bold sm:mb-3`}
            >
              Our Students Are
              <span className="text-coching-text_color"> Our Strength </span>See
              What They Say About Us.
            </h2>
            <p
              className={`${
                theme === "light" ? "text-black" : "text-violet-100"
              }`}
            >
              Learners have always expressed their love for Trace Accademy.
            </p>
          </div>
        </div> */}
        <Faqs />
      </section>

      {/* <section className="wrapper bg-1 gradient-primary border-general scroll-mt-16">
        <div className=" space-y-14">
          <div className="mantine-Container-root px relative md:px-8 lg:px-16 mantine-akkprt">
            <div
              className={` ${
                visible
                  ? "mantine-SimpleGrid-root "
                  : "mantine-SimpleGrid-root h-[700px] overflow-y-hidden  "
              } `}
              ref={containerRef}
            >
              <div className=" mantine-c577qn gap-2">
                {feedBackData.map((data, index) => (
                  <div
                    className={`mantine-Paper-root  border-general border dark:bg-slate-800/[0.6] ${
                      theme === "light"
                        ? "text-black bg-white "
                        : "text-violet-100 "
                    }  mantine-1jdao0l`}
                    key={index}
                  >
                    <div className="mantine-Group-root mantine-6y1794">
                      <span
                        style={{
                          boxSizing: "border-box",
                          display: "inline-block",
                          overflow: "hidden",
                          width: "initial",
                          height: "initial",
                          background: "none",
                          opacity: 1,
                          border: 0,
                          margin: 0,
                          padding: 0,
                          position: "relative",
                          maxWidth: "10%",
                        }}
                      >
                        <span
                          style={{
                            boxSizing: "border-box",
                            display: "block",
                            width: "initial",
                            height: "initial",
                            background: "none",
                            opacity: 1,
                            border: 0,
                            margin: 0,
                            padding: 0,
                            maxWidth: "100%",
                          }}
                        >
                          <img
                            style={{
                              display: "block",
                              maxWidth: "100%",
                              width: "initial",
                              height: "initial",
                              background: "none",
                              opacity: 1,
                              border: 0,
                              margin: 0,
                              padding: 0,
                            }}
                            alt=""
                            aria-hidden="true"
                            src={img1}
                          />
                        </span>
                        <img
                          alt="Masud Pervez"
                          src={`${Review1}?w=50&q=75`}
                          decoding="async"
                          data-nimg="intrinsic"
                          className="mantine-gnzaph mantine-Group-child rounded-full"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            boxSizing: "border-box",
                            padding: 0,
                            border: "none",
                            margin: "auto",
                            display: "block",
                            width: 0,
                            height: 0,
                            minWidth: "100%",
                            maxWidth: "100%",
                            minHeight: "100%",
                            maxHeight: "100%",
                          }}
                        />
                        <noscript>
                          <img
                            alt="Masud Pervez"
                            src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F23.5bbb3c7c.jpg&amp;w=96&amp;q=75"
                            decoding="async"
                            data-nimg="intrinsic"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              boxSizing: "border-box",
                              padding: 0,
                              border: "none",
                              margin: "auto",
                              display: "block",
                              width: 0,
                              height: 0,
                              minWidth: "100%",
                              maxWidth: "100%",
                              minHeight: "100%",
                              maxHeight: "100%",
                            }}
                            className="mantine-gnzaph mantine-Group-child rounded-full"
                            loading="lazy"
                          />
                        </noscript>
                      </span>
                      <div className="mantine-gnzaph mantine-Group-child space-y-1">
                        <div className="mantine-Text-root mantine-1jcp2pl">
                          {data.Student?.name}
                        </div>
                        <div className="flex space-x-0.5">
                          {Array.from({ length: data.rating }, (_, index) => (
                            <svg
                              key={index}
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 1024 1024"
                              color="orange"
                              style={{ color: "orange" }}
                              height="14"
                              width="14"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3z"></path>
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mantine-TypographyStylesProvider-root mantine-1ctjcu4">
                      <div
                        className={`${
                          theme === "light" ? "text-black " : "text-violet-100"
                        } mantine-1ob529b `}
                      >
                        {data.feedback}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {!visible && visibleButton && (
              <div
                className={`${
                  theme === "light" ? "from-white " : "from-slate-900 "
                } absolute inset-x-0 lg:inset-x-16 bottom-0 flex justify-center bg-gradient-to-t from-slate-900 pt-32 pb-8  false `}
              >
                <button
                  className="mantine-Button-filled  bg-secondary2  hover:bg-secondary1  mantine-Button-root mantine-button"
                  type="button"
                  onClick={handleReview}
                >
                  <div className="mantine-review ">
                    <span className="mantine-qo1k2 ">
                      <div className="flex justify-between gap-2">
                        <span>আরো রিভিউ দেখুন</span>
                      </div>
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </section> */}

      {/* <DownloadAppBanner /> */}
    </div>
  );
};

export default HomePage;
