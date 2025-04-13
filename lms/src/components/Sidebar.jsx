import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import Footer from "./Footer";
// import { IoMdNotificationsOutline } from "react-icons/io";
// import NotificationPanel from "./NotificationPanel";
import { useAuth } from "./Auth";
import { FaBookReader, FaUserCircle } from "react-icons/fa";
import LogoutModal from "./LogoutModal";
import { FaClipboardQuestion } from "react-icons/fa6";
import { MdMyLocation } from "react-icons/md";
// import { io } from "socket.io-client";
// import notificationSound from "../../public/notification/Excuse-Me-Boss-You-Have-A-Text-Message.mp3";
const Sidebar = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [isNotification, setIsNotification] = useState(false);
  const [isVisible, setIsVisble] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  // const notifiactionRef = useRef(null);
  // const notifiactionbuttonRef = useRef(null);
  // const socket = io(import.meta.env.VITE_SOCKET_IO_URL);
  // const [notificationdata, setNotifcationData] = useState([]);

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleprofile = () => {
    navigate("/user/profile");
  };
  // useEffect(() => {
  //   // Function to play notification sound
  //   const playNotificationSound = () => {
  //     const audio = new Audio(notificationSound);
  //     audio.play();
  //   };

  //   // Event listener for new room notifications
  //   socket.on("newRoomNotification", (roomData) => {
  //     console.log("not", roomData);

  //     playNotificationSound(); // Play sound
  //     setNotifcationData(roomData);
  //   });

  //   // Cleanup on component unmount
  //   return () => {
  //     socket.off("newRoomNotification");
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //     socket.disconnect();
  //   };
  // }, [socket]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
        // setIsNotification(false);
      }
    }
    // Attach the event listener to the document
    document.addEventListener("click", handleClickOutside);
    // Cleanup: Remove the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (
  //       notifiactionRef.current &&
  //       !notifiactionRef.current.contains(event.target) &&
  //       notifiactionbuttonRef.current &&
  //       !notifiactionbuttonRef.current.contains(event.target)
  //     ) {
  //       setIsDropdownOpen(false);
  //       setIsNotification(false);
  //     }
  //   }
  //   // Attach the event listener to the document
  //   document.addEventListener("click", handleClickOutside);
  //   // Cleanup: Remove the event listener on component unmount
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside);
  //   };
  // }, []);

  const name = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const onClose = () => {
    setIsVisble(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="  fixed top-0 z-50 w-full bg-white border-b border-gray-200  ">
        <div className=" relative px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 0  "
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>
              <Link to="/" className="flex ms-2 md:me-24">
                <img
                  className="h-[50px] w-[150px] object-cover cursor-pointer"
                  src="/Images/logo.png"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3 gap-2">
                {/* <button
                  ref={notifiactionbuttonRef}
                  className="bg-gray-100 px-1 py-1 rounded-full cursor-pointer"
                  onClick={() => {
                    setIsNotification(!isNotification);
                    setIsDropdownOpen(false);
                  }}
                >
                  <IoMdNotificationsOutline size={20} />
                </button>
                {isNotification && (
                  <NotificationPanel
                    notifiactionRef={notifiactionRef}
                    data={notificationdata}
                  />
                )} */}
                <div className="relative">
                  <button
                    ref={buttonRef}
                    type="button"
                    className="flex cursor-pointer text-sm  rounded-full  "
                    aria-expanded={isDropdownOpen}
                    onClick={() => {
                      setIsDropdownOpen(!isDropdownOpen);
                      // setIsNotification(false);
                    }}
                  >
                    <div className="rounded-full w-8 h-8 aspect-square object-cover  border flex items-center justify-center text-xl uppercase  ">
                      <FaUserCircle size={28} />
                    </div>
                  </button>
                  {isDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="w-[calc(100vw-48px)] sm:!w-[343px] fixed sm:!absolute bg-white top-[55px] right-0 smx:-right-4 left-4 sm:left-[-308px] rounded-lg overflow-hidden z-[15] shadow-[rgba(50,50,93,0.25)_0px_13px_27px_-5px,rgba(0,0,0,0.3)0px_8px_16px_-8px]"
                    >
                      <div className="w-full p-2 flex flex-col justify-center items-center gap-2">
                        <div className="p-2 flex items-center gap-2 self-stretch rounded-lg !border border-ostad-black-opac-2 bg-ostad-black-opac-2 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.12)]">
                          <div className="rounded-full w-12 h-12 relative overflow-hidden">
                            <div className="rounded-full aspect-square object-cover w-full border flex items-center justify-center text-xl uppercase text-white bg-green-600">
                              {name.charAt(0)}
                            </div>
                          </div>
                          <div className="flex flex-col justify-center items-start gap-0.5 flex-1">
                            <div className="flex gap-1 items-center">
                              <p className="text-subtitle-s1 text-ostad-black-80">
                                {name}
                              </p>
                            </div>
                            <p className="text-body-b2 text-ostad-black-40">
                              {email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2 self-stretch">
                          <button
                            type="button"
                            className="btn uppercase font-semibold text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
                            style={{
                              borderRadius: "5px",
                              color: "inherit",
                              height: "40px",
                              padding: "8px 24px",
                              fontSize: "14px",
                            }}
                            onClick={handleprofile}
                          >
                            <div className="flex justify-center items-center gap-2">
                              <div className="flex justify-center items-center">
                                <img
                                  src="https://cdn.ostad.app/public/icons/account-circle-line.svg"
                                  style={{
                                    width: "19px",
                                    minWidth: "19px",
                                    height: "19px",
                                    minHeight: "19px",
                                  }}
                                  alt="Profile"
                                />
                              </div>
                              <p className="whitespace-nowrap ">profile</p>
                            </div>
                          </button>
                          <button
                            onClick={() => setIsVisble(!isVisible)}
                            type="button"
                            className="btn uppercase font-semibold text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
                            style={{
                              borderRadius: "5px",
                              color: "inherit",
                              height: "40px",
                              padding: "8px 24px",
                              fontSize: "14px",
                            }}
                          >
                            <div className="flex justify-center items-center gap-2">
                              <p className="whitespace-nowrap">Logout</p>
                              <div className="flex justify-center items-center">
                                <img
                                  src="https://cdn.ostad.app/public/icons/logout-box-r-line.svg"
                                  style={{
                                    width: "19px",
                                    minWidth: "19px",
                                    height: "19px",
                                    minHeight: "19px",
                                  }}
                                  alt="Logout"
                                />
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <LogoutModal
            isVisible={isVisible}
            onClose={onClose}
            logout={logout}
          />
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-full pt-20 transition-transform ${
          isSidebarOpen ? "" : "-translate-x-full"
        } bg-white border-r border-gray-200 sm:translate-x-0   `}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white ">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/user/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 0 group-hover:text-gray-900 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user/my-courses"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 0 group-hover:text-gray-900 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.025.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">My Course</span>
              </Link>
            </li>

            <li>
              <Link
                to="/user/my-exams"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <FaClipboardQuestion className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 0 group-hover:text-gray-900 " />

                <span className="flex-1 ms-3 whitespace-nowrap">My Exams</span>
              </Link>
            </li>

            <li>
              <Link
                to="/user/my-quizs"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <MdMyLocation className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 0 group-hover:text-gray-900 " />

                <span className="flex-1 ms-3 whitespace-nowrap">My Quies</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user/my-books"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <FaBookReader className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 0 group-hover:text-gray-900 " />

                <span className="flex-1 ms-3 whitespace-nowrap">My Books</span>
              </Link>
            </li>
            <li>
              <Link
                to="/user/add-courses"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 0 group-hover:text-gray-900 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 16"
                >
                  <path d="M16.5 0h-15C.672 0 0 .672 0 1.5v13c0 .828.672 1.5 1.5 1.5h15c.828 0 1.5-.672 1.5-1.5v-13c0-.828-.672-1.5-1.5-1.5Zm0 1c.276 0 .5.224.5.5v1.5H1V1.5c0-.276.224-.5.5-.5h15Zm0 13H1V5h16v9.5c0 .276-.224.5-.5.5ZM9 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm5.5 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM3 7.5h2v1H3v-1Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Add Course
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/user/live-class"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group "
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 0 group-hover:text-gray-900 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M15 0H3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V3a3 3 0 0 0-3-3Zm1 15a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12Z" />
                  <path d="M9 2.75a.75.75 0 0 0-.75.75v6.19L5.47 7.16a.75.75 0 1 0-1.06 1.06l3.75 3.75a.75.75 0 0 0 1.06 0l3.75-3.75a.75.75 0 0 0-1.06-1.06L9.75 9.69V3.5a.75.75 0 0 0-.75-.75ZM7.75 14a.75.75 0 0 0-.75.75v.5c0 .69.56 1.25 1.25 1.25h1c.69 0 1.25-.56 1.25-1.25v-.5a.75.75 0 0 0-1.5 0v.5h-1v-.5a.75.75 0 0 0-.75-.75Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Live Class
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/user/transactions"
                className="flex items-center p-2 text-gray-900 rounded-lg  hover:bg-gray-100  group"
              >
                <svg
                  className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75  group-hover:text-gray-900 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
                  <path d="M12 5h-2v-.75C10 2.682 8.818 1.5 7.25 1.5S4.5 2.682 4.5 4.25V5H2.5A2.503 2.503 0 0 0 0 7.5v10A2.503 2.503 0 0 0 2.5 20h13A2.503 2.503 0 0 0 18 17.5v-10A2.503 2.503 0 0 0 15.5 5H13V4.25C13 2.682 11.818 1.5 10.25 1.5S7.5 2.682 7.5 4.25V5H6V4.25C6 2.073 7.823.25 10 .25S14 2.073 14 4.25V5h1.5A3.504 3.504 0 0 1 19 8.5v9A3.504 3.504 0 0 1 15.5 21h-13A3.504 3.504 0 0 1-1 17.5v-10A3.504 3.504 0 0 1 2.5 4H4.5v-.75C4.5 1.682 6.318 0 8.75 0S13 .682 13 2.25V5zM7 10c.828 0 1.5-.672 1.5-1.5S7.828 7 7 7 5.5 7.672 5.5 8.5 6.172 10 7 10zm4 0c.828 0 1.5-.672 1.5-1.5S11.828 7 11 7s-1.5.672-1.5 1.5S10.172 10 11 10zM1 12.5C.448 12.5 0 12.948 0 13.5V15h16v-1.5c0-.552-.448-1-1-1H1zm4-5C4.448 7.5 4 7.948 4 8.5V10h8V8.5c0-.552-.448-1-1-1H5zM5.5 12.5A1.5 1.5 0 0 1 7 11h4a1.5 1.5 0 0 1 1.5 1.5v.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-.5z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Transaction
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="flex-1 min-h-[90vh] h-auto sm:ml-64 mt-10 overflow-auto py-10 bg-gray-50">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;
