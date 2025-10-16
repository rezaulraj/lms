/* eslint-disable react/no-unescaped-entities */
import img1 from "../assets/download.svg";
import img3 from "../assets/peep4.d500693a.svg";
import img4 from "../assets/peep1.f4841716.svg";
import img5 from "../assets/faq.8116aa7d.svg";
import Instructor from "../assets/Ibrahim.jpg";
import Review1 from "../assets/23.jpeg";
import Merinasoft from "../assets/merinasoft.png";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import content from "../assets/content.svg";
import { useState, useEffect, useRef } from "react";

import { Modal } from "antd";

import "@dotlottie/player-component";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";
import { useTheme } from "../components/ThemeContext";
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
function ExamEnrollment() {
  const [visible, setVisible] = useState(false);
  const [visibleButton, setvisibleButton] = useState(false);
  const [Openvisible, setOpenVisible] = useState(false);
  const { theme } = useTheme();
  const { name } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState([]);
  const [Course, setCourse] = useState([]);
  const [userCourse, setUserCourse] = useState([]);
  const [feedBackData, setFeedBack] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const [iframeKey, setIframeKey] = useState(0);

  const [Previewid, setPreviewId] = useState(null);
  const [id, setId] = useState(null);
  const username = localStorage.getItem("username");
  const useremail = localStorage.getItem("email");
  const userid = localStorage.getItem("userid");
  const handleReview = () => {
    setVisible(true);
  };

  const handlePreviewReply = (item) => {
    if (Previewid === item) {
      console.log(item);

      setPreviewId(null);
      setOpenVisible(false);
    } else {
      setPreviewId(item);
      setOpenVisible(true);
    }
  };

  const handleviewReply = (item) => {
    if (id === item) {
      setId(null);
      setOpenVisible(false);
    } else {
      setId(item);
      setOpenVisible(true);
    }
  };
  const [modal1Open, setModal1Open] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [otp, setOtp] = useState("");
  const [playbackInfo, setPlaybackInfo] = useState("");

  const handlecancel = () => {
    setModal1Open(false);
    setOtp(null);
    setPlaybackInfo(null);
    setIframeKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    if (!modal1Open) {
      // Pause the video when the modal is closed
      const videoElement = document.getElementById("shaka-video");
      if (videoElement) {
        videoElement.pause();
      }
    }
  }, [modal1Open]);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/courses/getAll");
        const filter = response.data.find((data) => data.course_name === name);
        console.log("response", filter);
        localStorage.setItem("idCourse", filter.idCourses);
        localStorage.setItem("cPrice", filter.price);
        try {
          const response = await axiosInstance.post(
            "/chapters/getVideosByChapters",
            {
              idCourses: filter?.idCourses,
            }
          );
          setVideoData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
        setCourse(filter);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchReveiw = async () => {
      try {
        const response = await axiosInstance.get("/feedbacks/getAll");

        setFeedBack(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCourse();
    fetchReveiw();
  }, []);

  useEffect(() => {
    const checkHeight = () => {
      if (containerRef.current) {
        setvisibleButton(containerRef.current.scrollHeight > 700);
      }
    };
    // Check height on mount
    checkHeight();
    // Check height on window resize
    window.addEventListener("resize", checkHeight);
    // Cleanup event listener
    return () => window.removeEventListener("resize", checkHeight);
  }, [feedBackData, theme]);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await axiosInstance.post(
          "/videos/getOtpFromVideoCipher",
          {
            videoId: videoId,
          }
        );
        setOtp(response.data.otp);
        setPlaybackInfo(response.data.playbackInfo);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching video data", error);
      }
    };

    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    if (Course && feedBackData.length > 0) {
      const filter = feedBackData.filter(
        (data) => data.idCourses === Course?.idCourses
      );
      setFeedBack(filter);
      console.log(filter);
    }
  }, [Course]);

  console.log("course name", Course);
  console.log("name", name);
  useEffect(() => {
    const fetchEnroleCourse = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/transaction/getTransactionByUserId?idUsers=${userid}`
        );
        const responseData = response.data;
        setUserCourse(responseData);
        console.log("userdata in here", responseData);
      } catch (error) {
        console.error("Error fetching enrole courses:", error);
      }
    };

    fetchEnroleCourse();
  }, [userid]);

  console.log("userdata", userCourse);

  const handleNavigate = () => {
    const currentCourseId = Number(localStorage.getItem("idCourse"));
    const currentExamId = Number(localStorage.getItem("idExams"));

    const isUserEnrolled = userCourse?.some(
      (course) => course?.idCourses === currentCourseId
    );

    const isUserExamEnrolled = userCourse?.some(
      (course) => course?.idExams === currentExamId
    );

    console.log("isUserEnrolled", isUserEnrolled);
    console.log("isUserExamEnrolled", isUserExamEnrolled);
    console.log("currentCourseId", currentCourseId);
    console.log("currentExamId", currentExamId);

    if (useremail && username) {
      if (currentCourseId === 66 && isUserExamEnrolled) {
        navigate("/user/my-exams");
      } else if (isUserEnrolled && currentCourseId !== 66) {
        navigate("/user/my-courses");
      } else if (isUserExamEnrolled) {
        navigate("/user/my-exams");
      } else {
        navigate("/enroll");
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <>
      <div
        className={`${
          theme === "light" ? "text-black bg-slate-50" : "text-white "
        } w-full relative  bg-pattern md:h-full py-10 dark:bg-dpattern lg:flex lg:h-full lg:items-center lg:justify-center lg:py-0`}
      >
        <div className="absolute right-[28%] top-0  h-[100px] w-[200px] rotate-12 rounded-3xl bg-gradient-to-l from-blue-600 to-sky-400 opacity-20 blur-3xl filter dark:block dark:opacity-30 lg:top-44 lg:right-20 lg:h-72 lg:w-[350px] xl:h-80 "></div>
        <div className="absolute left-[28%] top-28  rotate-12 rounded-3xl bg-sky-800  blur-3xl filter opacity-30 lg:h-32 lg:w-[450px] lg:block xl:h-44 xl:w-[600px]"></div>
        <div className="absolute bottom-44 -left-64  h-[150px] w-[200px] -rotate-45 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-800 opacity-30 blur-3xl filter  lg:bottom-24 lg:-left-20 lg:h-28 lg:w-[250px] lg:-rotate-12 lg:opacity-20 xl:h-40 xl:w-[400px]"></div>
        {loading ? (
          <div className="text-center">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="container container_div opacity-100">
            <div className="mt-16  flex flex-col gap-10 lg:mt-0 lg:flex-row lg:gap-28">
              <div className="flex flex-col space-y-4 text-center lg:text-left">
                <h1 className="hero-title">
                  <span className="text-[#31972a]">{Course?.course_name}</span>
                </h1>
                <p className="text-1 text-medium mt-8 text-center lg:text-left">
                  {Course?.course_desc}
                </p>
                <div className="mx-auto mt-10 flex gap-4 lg:mx-0">
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={handleNavigate}
                      className="mantine-Button-filled mt-4   hover:bg-secondary1 text-white mantine-Button-root mantine-1ogymfb"
                    >
                      <div className="mantine-3xbgk5 mantine-Button-inner">
                        <span className="mantine-qo1k2 mantine-Button-label">
                          <div className="flex justify-between items-center gap-2">
                            <span>
                              <MdOutlineWatchLater size={20} />
                            </span>
                            <span>{Course?.price}</span>
                            <span className="flex items-center text-secondary1 text-secondary1">
                              |
                            </span>
                            <span className="flex items-center">Enroll</span>
                          </div>
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative flex-1 items-center justify-center">
                <div className="aspect-video scale-100 overflow-hidden rounded-md ring-2 ring-[#61D0D7] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(97,208,215,.5)] lg:!h-[350px] lg:!w-[600px]">
                  <img
                    src={`${Course?.Image?.image_url}`}
                    alt=""
                    className=" w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <section className="wrapper scroll-mt-16 bg-left bg-no-repeat dark:bg-none lg:bg-shape2_filpped">
        <div className="container relative space-y-14">
          <div className="w-full text-center">
            <div className="flex h-full w-full items-center justify-center">
              <div className="opacity: 1; transform: none;"></div>
              <span className="style_haeding">
                <span className="style_2">
                  <img
                    src={img1}
                    style={{
                      display: "block",
                      maxWidth: "100%",
                      width: "initial",
                      height: "initial",
                      background: "none",
                      opacity: "1",
                      border: "0px",
                      margin: "0px",
                      padding: "0px",
                    }}
                    alt=""
                  />
                </span>
                <img
                  src={content}
                  alt=""
                  style={{
                    position: "absolute",
                    inset: "0px",
                    boxSizing: "border-box",
                    padding: "0px",
                    border: "none",
                    margin: "auto",
                    display: "block",
                    width: "0px",
                    height: "0px",
                    minWidth: "100%",
                    maxWidth: "100%",
                    minHeight: "100%",
                    maxHeight: "100%",
                  }}
                />
              </span>
            </div>
            <h1 className="section-title">
              <span className="text-[#31972a]">Course</span> content
            </h1>
            <p className="subtitle">
              101 sections • 636 lectures • 58h 19m total length
            </p>
          </div>
        </div>
      </section>

      <section className="wrapper bg-1 gradient-primary border-general scroll-mt-16 border-t dark:bg-none">
        <div className="container space-y-5">
          <div className="w-full text-center">
            <div className="flex h-full w-full items-center justify-center">
              <div className="opacity: 1; transform: none;">
                <span className="style_haeding">
                  <span className="style_2">
                    <img
                      src={img1}
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: "1",
                        border: "0px",
                        margin: "0px",
                        padding: "0px",
                      }}
                      alt=""
                    />
                  </span>
                  <img
                    src={img3}
                    alt=""
                    style={{
                      position: "absolute",
                      inset: "0px",
                      boxSizing: "border-box",
                      padding: "0px",
                      border: "none",
                      margin: "auto",
                      display: "block",
                      width: "0px",
                      height: "0px",
                      minWidth: "100%",
                      maxWidth: "100%",
                      minHeight: "100%",
                      maxHeight: "100%",
                    }}
                  />
                </span>
              </div>
            </div>
            <h1 className="section-title ">
              <span className="text-[#31972a]">How will</span>{" "}
              <span
                className={`${theme === "light" ? "text-black" : "text-white"}`}
              >
                {" "}
                the course work?
              </span>
            </h1>
            <p className="subtitle">
              How we can help you become a skilled in this subject
            </p>
          </div>
          <div className="relative mx-auto max-w-7xl space-y-1 lg:px-20">
            <div className="flex-col-reverse lg:flex-row-reverse relative flex flex-col-reverse lg:flex-row lg:items-center lg:gap-12">
              <div className="grid w-full place-items-center lg:min-h-[536px]">
                <div className="w-full">
                  <div
                    className="w-full"
                    style={{ opacity: "1", transform: "none" }}
                  >
                    <dotlottie-player
                      autoplay="true"
                      loop
                      src="https://lottie.host/62d97240-a368-4af5-93bb-1f2b599b80a1/EPpq393L3T.lottie"
                      background="transparent"
                      style={{ width: "100%", height: "100" }}
                    >
                      <div className="main">
                        <div
                          className="animation"
                          style={{ background: "transparent" }}
                        ></div>
                      </div>
                    </dotlottie-player>
                  </div>
                </div>
              </div>
              <div className="h-full w-full space-y-6">
                <div
                  className="relative z-10 mx-auto grid w-24 place-items-center py-10 lg:mx-px "
                  style={{ transform: "none" }}
                >
                  <h1 className="section-title  relative z-10 text-3xl !text-white drop-shadow-[3px_3px_0px_#1e293b]">
                    1
                  </h1>
                  <svg
                    className="absolute top-0 z-0 opacity-50 dark:opacity-100"
                    width="100%"
                    height="100%"
                    viewBox="0 0 602 473"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M290.806 463.188C374.905 469.353 468.778 492.629 529.757 434.517C597.098 370.239 616.804 266.193 591.202 177.098C566.996 92.3192 491.898 30.0454 407.023 5.07419C335.338 -15.8893 270.48 32.9741 202.363 62.8779C128.971 95.248 31.0635 104.651 6.54775 180.797C-18.899 259.873 34.0116 342.956 93.1287 401.839C144.488 453.014 218.345 457.793 290.806 463.188Z"
                      fill="#FF8731"
                    ></path>
                  </svg>
                </div>
                <h1 className="title text-center lg:text-left">
                  Step by step project based teaching method
                </h1>
                <svg
                  className="absolute left-[20%] top-[85%] hidden lg:block"
                  width="432"
                  height="125"
                  fill="none"
                  data-reveal="in-fade"
                >
                  <path
                    d="M1.633 1.29c.308 12.988-3.497 38 10.01 54.328 14.885 19.842 32.162 24.39 52.725 28.521 36.088 7.25 72.202 8.779 109.27 1.774 11.033-2.085 21.968-8.278 32.723-12.617 11.066-4.465 22.127-8.914 33.321-12.404 23.822-7.426 47.443-7.882 71.079-5.229 20.514 2.303 41.669 2.608 61.157 11.122 30.981 6.832 49.838 47.155 58.34 57.199"
                    stroke="#F0B9DD"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 8 4 8"
                  ></path>
                </svg>
                <p className="text-1 text-medium text-center lg:!text-left ">
                  One to two modules will be released every week and each module
                  will have 10-12 pre-recorded videos so that you can learn one
                  topic at a time step by step. The videos are based on React
                  and NextJS documentation. Also, each module has a project
                  tutorial to follow the project based learning process. You
                  will have a whole week to watch the weekly videos. A live
                  session will be held on one day of the week to take your
                  questions. If you can watch the videos in a short time, you
                  will have more time during the week for assignments.
                </p>
              </div>
            </div>
            <div className=" relative flex flex-col-reverse lg:flex-row lg:items-center lg:gap-12">
              <div className="grid w-full place-items-center lg:min-h-[536px]">
                <div
                  className="w-full"
                  style={{ opacity: "1", transform: "none" }}
                >
                  <dotlottie-player
                    autoplay="true"
                    loop
                    src="https://lottie.host/44ae28c3-920a-4787-b211-c5ac28bd0136/AGJgnExlx4.lottie"
                    background="transparent"
                    style={{ width: "100%", height: "100" }}
                  >
                    <div className="main">
                      <div
                        className="animation"
                        style={{ background: "transparent" }}
                      ></div>
                    </div>
                  </dotlottie-player>
                </div>
              </div>
              <div className="h-full w-full space-y-6">
                <div
                  className="relative z-10 mx-auto grid w-24 place-items-center py-10 lg:mx-px"
                  style={{ transform: "none" }}
                >
                  <h1 className="section-title relative z-10 text-3xl !text-white drop-shadow-[3px_3px_0px_#1e293b]">
                    2
                  </h1>
                  <svg
                    className="absolute top-0 z-0 opacity-50 dark:opacity-100"
                    width="100%"
                    height="100%"
                    viewBox="0 0 602 473"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M290.806 463.188C374.905 469.353 468.778 492.629 529.757 434.517C597.098 370.239 616.804 266.193 591.202 177.098C566.996 92.3192 491.898 30.0454 407.023 5.07419C335.338 -15.8893 270.48 32.9741 202.363 62.8779C128.971 95.248 31.0635 104.651 6.54775 180.797C-18.899 259.873 34.0116 342.956 93.1287 401.839C144.488 453.014 218.345 457.793 290.806 463.188Z"
                      fill="#3FB8A9"
                    ></path>
                  </svg>
                </div>
                <h1 className="title text-center lg:text-left">
                  A chance to test yourself through exams
                </h1>
                <svg
                  className="absolute left-[10%] top-[79%] z-0 hidden h-[268.09px] w-full -rotate-6 transform lg:block"
                  width="100%"
                  height="268.09px"
                  fill="none"
                  data-reveal="in-fade"
                >
                  <path
                    d="M595 1c-5.312 32.44-14.005 32.911-28.493 54.17-14.488 22.676-40.566 37.32-86.927 53.383-16.359 9.183-58.29 17.919-77.329 20.941-27.961 4.438-57.257 4.44-85.565 4.82-22.571.303-45.071.327-67.53-2.002-48.556-5.035-97.306-19.13-146.184-19.13-21.265 0-43.185 6.042-63.875 10.529C21.527 127.522 16.22 128.888 1 138"
                    stroke="#B5CAF9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 8 4 8"
                  ></path>
                </svg>
                <p className="text-1 text-medium text-center lg:!text-left ">
                  There are quizzes with each video and assignments at the end
                  of each module to test what you have learned by watching the
                  videos. You can answer the quizzes instantly and you will have
                  48-72 hours to complete each assignment. We have to submit the
                  github link of the source code and the live link of the
                  project by assignment. Scores for each quiz and assignment
                  will be tallied and final results will be given at the end of
                  the course. However, the quiz marks will be added to the
                  leaderboard but will not be added to the final result.
                </p>
              </div>
            </div>
            <div className="flex-col-reverse lg:flex-row-reverse relative flex flex-col-reverse lg:flex-row lg:items-center lg:gap-12">
              <div className="grid w-full place-items-center lg:min-h-[536px]">
                <div className="w-full">
                  <div
                    className="w-full"
                    style={{ opacity: "1", transform: "none" }}
                  >
                    <dotlottie-player
                      autoplay="true"
                      loop
                      src="https://lottie.host/39045941-4c89-47ae-89e4-9c42267bf009/7d3aCvz8LI.lottie"
                      background="transparent"
                      style={{ width: "100%", height: "100" }}
                    >
                      <div className="main">
                        <div
                          className="animation"
                          style={{ background: "transparent" }}
                        ></div>
                      </div>
                    </dotlottie-player>
                  </div>
                </div>
              </div>
              <div className="h-full w-full space-y-6">
                <div
                  className="relative z-10 mx-auto grid w-24 place-items-center py-10 lg:mx-px "
                  style={{ transform: "none" }}
                >
                  <h1 className="section-title relative z-10 text-3xl !text-white drop-shadow-[3px_3px_0px_#1e293b]">
                    3
                  </h1>
                  <svg
                    className="absolute top-0 z-0 opacity-50 dark:opacity-100"
                    width="100%"
                    height="100%"
                    viewBox="0 0 602 473"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M290.806 463.188C374.905 469.353 468.778 492.629 529.757 434.517C597.098 370.239 616.804 266.193 591.202 177.098C566.996 92.3192 491.898 30.0454 407.023 5.07419C335.338 -15.8893 270.48 32.9741 202.363 62.8779C128.971 95.248 31.0635 104.651 6.54775 180.797C-18.899 259.873 34.0116 342.956 93.1287 401.839C144.488 453.014 218.345 457.793 290.806 463.188Z"
                      fill="#0168FB"
                    ></path>
                  </svg>
                </div>
                <h1 className="title text-center lg:text-left">
                  After the exam there is the correct solution of the question
                </h1>
                <svg
                  className="absolute left-[55%] -bottom-[20%] hidden h-[150px] w-[580px] -translate-x-1/2 -translate-y-1/2 transform lg:block"
                  fill="none"
                  data-reveal="in-fade"
                >
                  <path
                    d="M1 1c7.255 23.316 12.132 49.428 31.848 67.45 11.32 10.349 16.684 18.72 32.52 24.395 13.96 5.003 51.325 18.606 66.469 5.364 7.463-6.526 16.624-20.318 3.781-26.82-6.446-3.262-17.016-2.214-24.201-1.616-5.314.443-6.954 5.964-8.739 9.258-5.374 9.922-2.814 24.311 4.874 32.256 17.363 17.942 41.593 32.2 69.242 35.71 22.248 2.823 45.197 1.977 67.561 4.041 34.213 3.157 70.887 7.217 104.031 15.577 18.72 4.721 37.381 9.547 56.133 14.18 10.798 2.669 27.801 6.337 37.726 11.137C463.073 201.574 473.557 214.827 479 218"
                    stroke="#AAD1B6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 8 4 8"
                  ></path>
                </svg>
                <p className="text-1 text-medium text-center lg:!text-left ">
                  At the end of each quiz you can see the correct answer with
                  explanation. All assignment solutions will be shared on GitHub
                  at the end of the course so that you can check the best
                  practices and methods better. We will manually code review
                  your submitted assignments and mark them. Once the marksheet
                  is generated, you can check it from the personal dashboard on
                  the website.
                </p>
              </div>
            </div>
            <div className=" relative flex flex-col-reverse lg:flex-row lg:items-center lg:gap-12">
              <div className="grid w-full place-items-center lg:min-h-[536px]">
                <div className="w-full">
                  <div
                    className="w-full"
                    style={{ opacity: "1", transform: "none" }}
                  >
                    <dotlottie-player
                      autoplay="true"
                      loop=""
                      src="https://lottie.host/fe5dd5e4-b323-4a30-b553-fa127c7a7e5f/ciF9UEoast.lottie"
                      background="transparent"
                      style={{ width: "100%", height: "100%" }}
                    ></dotlottie-player>
                  </div>
                </div>
              </div>
              <div className="h-full w-full space-y-6">
                <div
                  className="relative z-10 mx-auto grid w-24 place-items-center py-10 lg:mx-px "
                  style={{ transform: "none" }}
                >
                  <h1 className="section-title relative z-10 text-3xl !text-white drop-shadow-[3px_3px_0px_#1e293b]">
                    4
                  </h1>
                  <svg
                    className="absolute top-0 z-0 opacity-50 dark:opacity-100"
                    width="100%"
                    height="100%"
                    viewBox="0 0 602 473"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M290.806 463.188C374.905 469.353 468.778 492.629 529.757 434.517C597.098 370.239 616.804 266.193 591.202 177.098C566.996 92.3192 491.898 30.0454 407.023 5.07419C335.338 -15.8893 270.48 32.9741 202.363 62.8779C128.971 95.248 31.0635 104.651 6.54775 180.797C-18.899 259.873 34.0116 342.956 93.1287 401.839C144.488 453.014 218.345 457.793 290.806 463.188Z"
                      fill="#309ee8"
                    ></path>
                  </svg>
                </div>
                <h1 className="title text-center lg:text-left">
                  There is a Discord support group for help if you get stuck
                </h1>
                <svg
                  className="absolute -bottom-[35%] right-[40%] hidden h-[135px] w-[550px] -rotate-6 lg:block"
                  fill="none"
                  data-reveal="in-fade"
                >
                  <path
                    d="M595 1c-5.312 32.44-14.005 32.911-28.493 54.17-14.488 22.676-40.566 37.32-86.927 53.383-16.359 9.183-58.29 17.919-77.329 20.941-27.961 4.438-57.257 4.44-85.565 4.82-22.571.303-45.071.327-67.53-2.002-48.556-5.035-97.306-19.13-146.184-19.13-21.265 0-43.185 6.042-63.875 10.529C21.527 127.522 16.22 128.888 1 138"
                    stroke="#B5CAF9"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="4 8 4 8"
                  ></path>
                </svg>
                <p className="text-1 text-medium text-center lg:!text-left ">
                  If you face any problem during the course, get stuck or don't
                  understand, you can post your question in our Discord support
                  channel. If a critical issue cannot be resolved through the
                  Discord Support Channel, a call to the Discord Voice Channel /
                  Google Meet will also be attempted. We will be with you
                  throughout the course and will try our best to cooperate.
                  However, no device related issues will be resolved
                </p>
              </div>
            </div>
            <div className="flex-col-reverse lg:flex-row-reverse relative flex flex-col-reverse lg:flex-row lg:items-center lg:gap-12">
              <div className="grid w-full place-items-center lg:min-h-[536px]">
                <div className="w-full">
                  <div
                    className="w-full"
                    style={{ opacity: "1", transform: "none" }}
                  >
                    <dotlottie-player
                      autoplay="true"
                      loop=""
                      src="https://lottie.host/7a1a7db2-0437-4dd7-95f0-d0ab76848cde/FWXzFbPSNr.lottie"
                      background="transparent"
                      style={{ width: "100%", height: "100%" }}
                    ></dotlottie-player>
                  </div>
                </div>
              </div>
              <div className="h-full w-full space-y-6">
                <div
                  className="relative animate-[wiggle_1s_ease-in-out_infinite] z-10 mx-auto grid w-24 place-items-center py-10 lg:mx-px "
                  style={{ transform: "none" }}
                >
                  <h1 className="section-title relative z-10 text-3xl !text-white drop-shadow-[3px_3px_0px_#1e293b]">
                    5
                  </h1>
                  <svg
                    className="absolute top-0 z-0 opacity-50 dark:opacity-100"
                    width="100%"
                    height="100%"
                    viewBox="0 0 602 473"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M290.806 463.188C374.905 469.353 468.778 492.629 529.757 434.517C597.098 370.239 616.804 266.193 591.202 177.098C566.996 92.3192 491.898 30.0454 407.023 5.07419C335.338 -15.8893 270.48 32.9741 202.363 62.8779C128.971 95.248 31.0635 104.651 6.54775 180.797C-18.899 259.873 34.0116 342.956 93.1287 401.839C144.488 453.014 218.345 457.793 290.806 463.188Z"
                      fill="#F8BD48"
                    ></path>
                  </svg>
                </div>
                <h1 className="title text-center lg:text-left">
                  There are also weekly live discussions
                </h1>{" "}
                <p className="text-1 text-medium text-center lg:!text-left ">
                  Every week we will organize at least one live session where we
                  will discuss what has been taught throughout the week, explain
                  assignment solutions and answer your questions directly. We
                  will be notified in advance on the Discord support channel
                  during the live session.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className={`wrapper border-t border-b ${
          theme === "light" ? "border-gray-100" : "border-gray-700	"
        }    !bg-primary1 dark:!bg-slate-800 dark:bg-none`}
      >
        <div className="container space-y-14">
          <h1 className="section-title text-center text-4xl ">
            Course Instructor
          </h1>
          <div className="flex flex-col gap-y-10 lg:flex-row">
            <div className="relative w-full text-center">
              <div className="nextjs-image rounded-1 !shadow-1 relative z-10 mx-auto h-[300px] w-[200px] origin-bottom-right -rotate-6 transform !border-4 lg:h-[360px] lg:w-[280px]">
                <span className="style_course_instructor">
                  <span className="style_course_first_span">
                    <img src={img1} alt="" className="img_instructor" />
                  </span>

                  <img
                    alt="Sumit Saha - Instructor"
                    src={`${Instructor}?w=828&q=75`} // Remove the "&amp;" and replace it with "&"
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
              <div className="rounded-1 absolute right-[25%] md:-bottom-[-50px] -bottom-3 z-0 mx-auto h-[300px] w-[200px] border-4 border-white !bg-[#8E6AC8] lg:h-[350px] lg:w-[280px]"></div>
            </div>
            <div
              className="w-full self-center p-6 lg:border-l-2 lg:border-yellow-400
            "
            >
              <p className="text-normal font-medium text-gray-500	 dark:text-slate-400">
                Md. Mahfuzur Rahman is a technology entrepreneur. In 2008, he
                founded Merinasoft, the Software Company in Bangladesh, while
                studying computer science and engineering at BUET. His passion
                for programming and interest in teaching people led him to
                establish the Trace Academi platform in 2020, where there are
                over 350 programming-related video tutorials. Trace Academi's
                YouTube channel and public Facebook group have attracted more
                than a million people who are learning programming for free.
              </p>
              <p className="text-normal font-medium mt-2 text-gray-500 dark:text-slate-400">
                He is also a full-stack web developer and software architect
                with over 14 years of experience in web development and software
                professions.
              </p>
              <h1 className="text-small mt-8 font-bold text-slate-50">
                Mahfuzur Rahman Tusar
              </h1>
              <p className="text-small text-white">Founder - Trace Academy</p>
              <p className="text-small text-white">CEO - Merinasoft</p>
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
                    <img src={img1} alt="" className="img_instructor " />
                  </span>

                  <img src={Merinasoft} alt="" />
                </span>
              </div>
              <div className="text-small text-gray-500 text-2 mt-2">
                ট্রেড লাইসেন্স - TRAD/DNCC/009595/2022
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="wrapper bg-1 gradient-primary border-general scroll-mt-16 dark:bg-none">
        <div className="container space-y-14">
          <div className="w-full text-center">
            <div className="flex h-full w-full items-center justify-center">
              <div style={{ opacity: "1", transform: " none" }}>
                <span className="style_haeding">
                  <span className="style_2">
                    <img
                      src={img1}
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: "1",
                        border: "0px",
                        margin: "0px",
                        padding: "0px",
                      }}
                      alt=""
                    />
                  </span>
                  <img
                    src={img4}
                    alt=""
                    style={{
                      position: "absolute",
                      inset: "0px",
                      boxSizing: "border-box",
                      padding: "0px",
                      border: "none",
                      margin: "auto",
                      display: "block",
                      width: "0px",
                      height: "0px",
                      minWidth: "100%",
                      maxWidth: "100%",
                      minHeight: "100%",
                      maxHeight: "100%",
                    }}
                  />
                </span>
              </div>
            </div>
            <h1 className="section-title">
              <span className="primary-highlighter">Learners'</span> opinions
              about the course
            </h1>
            <p className="subtitle">
              Learners have always expressed their love for Trace Accademy
            </p>
          </div>
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
                    className={`mantine-Paper-root border-general border dark:bg-slate-800/[0.6] ${
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
                } absolute inset-x-0 lg:inset-x-16 bottom-0 flex justify-center bg-gradient-to-t from-slate-900 pt-32 pb-8 false `}
              >
                <button
                  className="mantine-Button-filled bg-secondary2 hover:bg-secondary1 mantine-Button-root mantine-button"
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
      </section>
      <section className="wrapper gradient-primary border-general scroll-mt-24 border-t dark:bg-slate-900 dark:bg-none">
        <div className="container lg:p-7">
          <div className="flex h-full flex-col gap-10 lg:flex-row lg:gap-28">
            <div className="flex h-full w-full flex-col justify-center">
              <div className="next-image">
                <span className="style_haeding">
                  <span className="style_2 w-100">
                    <img
                      src={img1}
                      style={{
                        display: "block",
                        maxWidth: "100%",
                        width: "initial",
                        height: "initial",
                        background: "none",
                        opacity: "1",
                        border: "0px",
                        margin: "0px",
                        padding: "0px",
                      }}
                      alt=""
                    />
                  </span>
                  <img
                    src={img5}
                    alt=""
                    style={{
                      position: "absolute",
                      inset: "0px",
                      boxSizing: "border-box",
                      padding: "0px",
                      border: "none",
                      margin: "auto",
                      display: "block",
                      width: "0px",
                      height: "0px",
                      minWidth: "100%",
                      maxWidth: "100%",
                      minHeight: "100%",
                      maxHeight: "100%",
                    }}
                  />
                </span>
              </div>
              <h1 className="section-title text-4xl lg:w-2/3">
                <span className="primary-highlighter">Answers </span>to
                frequently asked questions
              </h1>
              <p className="text-medium text-1 mt-8">
                We have listed here the answers to some of your common
                questions. Please read this list once before asking questions.
                Then you don't have to wait for our reply and save your precious
                time.
              </p>
            </div>
            <div className="relative flex h-full w-full items-center justify-center">
              <div
                className="mantine-ScrollArea-root w-full mantine-jghxib"
                style={{
                  position: "relative",
                  "--radix-scroll-area-corner-width": "10px",
                  "--radix-scroll-area-corner-height": "10px",
                  height: "400px",
                }}
              >
                <div className="lg:w-11/12 border-b border-neutral-700">
                  <div
                    className="flex transition duration-300 ease-in-out hover:bg-cyan-600 faq_hover lg:pt-4 lg:pl-2 pr-3 pb-4 justify-between cursor-pointer gap-14 items-center"
                    onClick={(event) => {
                      handleviewReply(2);
                      event.preventDefault();
                      window.getSelection().removeAllRanges(); // Deselect text
                    }}
                    style={{
                      backgroundColor:
                        Openvisible && id === 2 ? " rgb(2 132 199)" : "",
                    }}
                  >
                    <h3
                      className={`${
                        theme == "light" ? "text-[#334451]" : "text-slate-300"
                      }   mantine-hgwlez `}
                      style={{
                        color: Openvisible && id === 2 ? "white" : "",
                      }}
                    >
                      কোর্সটি করার জন্য আগে থেকে কি কি জানতে হবে?
                    </h3>
                    <div
                      className={`lg:ml-28 ${
                        theme == "light" ? "text-[#334451]" : "text-white"
                      } `}
                      style={{
                        color: Openvisible && id === 2 ? "white" : "",
                      }}
                    >
                      {Openvisible && id === 2 ? (
                        <IoIosArrowUp size={20} />
                      ) : (
                        <IoIosArrowDown size={20} />
                      )}
                    </div>
                  </div>
                  {Openvisible && id === 2 && (
                    <div
                      className={` mt-4 pb-3 ${
                        theme == "light" ? "text-[#334155]" : "text-slate-400"
                      } `}
                      style={{
                        opacity: 1,
                        transition: "opacity 500ms ease 0s",
                      }}
                    >
                      কোর্সটি অন-ডিমান্ড ভিডিও অনলি কোর্স হিসেবে থাকবে এবং আপনি
                      যেকোন সময় কিনে সাথে সাথেই ভিডিও গুলো এক্সেস করতে পারবেন।
                      এটি কোন ব্যাচ সিস্টেম কোর্স নয়।
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Modal
        title="Course Preview"
        centered
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={handlecancel}
        closable
        width={600}
        footer={false}
      >
        <div className="mb-5 lg:text-xl">
          100 Days of Code: The Complete Python Pro Bootcamp
        </div>
        <div style={{ position: "relative" }}>
          {otp && playbackInfo ? (
            <iframe
              key={iframeKey}
              src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
              width="100%"
              height="360"
              allow="encrypted-media"
              allowFullScreen
            ></iframe>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </Modal>
    </>
  );
}

export default ExamEnrollment;
