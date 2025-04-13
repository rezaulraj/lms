import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeContext";
import { IoMdArrowForward } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { useAuth } from "./Auth";
import LogoutModal from "./LogoutModal";
import { IoIosArrowForward } from "react-icons/io";
import { IoHomeOutline } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi2";

import { FaRegAddressBook } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { CiLight } from "react-icons/ci";
import SearchComponent from "./SearchComponent";

const ThemeToggleIcon = ({ theme, toggleTheme }) => (
  <div onClick={toggleTheme} className="cursor-pointer ">
    {theme === "light" ? (
      // SVG for light theme
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 16 16"
        height="1em"
        width="1em"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"></path>
      </svg>
    ) : (
      // Icon for dark theme
      <CiLight size={20} />
    )}
  </div>
);

const Navber = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [SearchVisible, setSearchVisible] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { logout, isLoggedIn, cart } = useAuth();
  const handleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);
  const handleFalse = () => {
    setIsMenuOpen(false);
  };
  const menuRef = useRef();

  useEffect(() => {
    // Prevent scrolling when the menu is open
    if (isMenuOpen || isVisible || SearchVisible) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Close menu on outside click
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove("no-scroll"); // Clean up no-scroll class
    };
  }, [SearchVisible, isMenuOpen, isVisible]);

  const handleprofile = () => {
    navigate("/user/profile");
  };

  const handleClickOutside = useCallback((event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
    }
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setSearchVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const name = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const onClose = () => {
    setIsVisible(false);
  };
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop = window.scrollY;
      if (currentScrollTop > lastScrollTop) {
        // Scrolling down
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }
      setLastScrollTop(currentScrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  const searchInputRef = useRef(null);
  const searchInputMobileRef = useRef(null);

  useEffect(() => {
    if (SearchVisible) {
      requestAnimationFrame(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
        if (searchInputMobileRef.current) {
          searchInputMobileRef.current.focus();
        }
      });
    }
  }, [SearchVisible]);

  const handleClose = () => {
    setSearchVisible(false);
  };

  return (
    <div
      className={`h-[60px] fixed z-50 top-0 w-full flex justify-evenly gap-5 items-center bg-coching-nav_color text-white transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="relative container h-[60px] flex justify-between items-center bg-coching-nav_color gap-4 text-white ">
        <div className="flex items-start">
          <Link onClick={handleFalse} to={"/"}>
            <img
              className="h-[50px] w-[150px] object-cover cursor-pointer"
              src="./mainlogo.png"
              alt="Logo"
            />
          </Link>
        </div>

        <div className="hidden relative md:flex grow justify-end lg:gap-0 xl:gap-20">
          <ul className="flex items-center gap-4 text-sm xl:text-sm font-bold">
            <li>
              <button
                onClick={() => setSearchVisible(!SearchVisible)}
                className="w-8 h-8 md:!w-[177px] md:!min-w-[177px] md:h-10 flex items-center justify-center md:!justify-start md:gap-2 rounded-full md:!rounded-[48px] md:!pl-3 md:!pr-1.5 border active:scale-90 transition-all duration-300 cursor-text"
              >
                <img
                  alt="search-icon"
                  className="w-6 h-6 md:!w-[28px] md:!h-[28px]"
                  src="/Images/search.svg"
                />
                <p className="!hidden md:!flex text-body-b2 text-ostad-black-60 md:!line-clamp-1">
                  Search for courses
                </p>
              </button>
            </li>
            <li>
              <Link onClick={() => setIsMenuOpen(false)} to={"/"}>
                Home
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsMenuOpen(false)} to={"/course"}>
                Courses
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsMenuOpen(false)} to={"/books"}>
                Books
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsMenuOpen(false)} to={"/vocabulary"}>
                Vocabulary
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsMenuOpen(false)} to={"/blog"}>
                Blogs
              </Link>
            </li>
            <li>
              <Link onClick={() => setIsMenuOpen(false)} to={"/contact"}>
                Contact
              </Link>
            </li>
            <li>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-2"
              >
                {theme === "light" ? (
                  // SVG for light theme
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 16 16"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z"></path>
                  </svg>
                ) : (
                  <CiLight size={20} />
                )}
              </button>
            </li>
          </ul>

          {/* Render other elements like Dashboard and User Profile */}
          <div className="flex items-center ml-4 relative">
            {isLoggedIn ? (
              <>
                <div className="hidden md:block">
                  <Link
                    id="nav_btn_login"
                    to={"/user/add-courses"}
                    className="group w-full flex gap-2 text-sm bg-black rounded-md justify-center items-center transition-all duration-200 h-10 px-6 py-2 rounded-mdbg-[#000]"
                  >
                    <p className="uppercase font-medium whitespace-nowrap transition-all duration-200 text-button">
                      Dashboard
                    </p>
                    <MdOutlineDashboard size={20} />
                  </Link>
                </div>
                <Link
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  ref={buttonRef}
                >
                  <span className="w-[40px] h-[40px] bg-slate-400 rounded-full flex justify-center items-end ml-2 cursor-pointer">
                    <img
                      src={"/Images/img1.png"}
                      className="w-[40px] h-[40px] object-cover rounded-full"
                      alt="User"
                    />
                  </span>
                </Link>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="w-[calc(100vw-48px)] sm:!w-[343px] fixed sm:!absolute bg-trace-color border footer-border-color top-[55px] right-0 rounded-lg overflow-hidden z-[15] shadow-lg"
                  >
                    <div className="w-full p-2 flex flex-col justify-center items-center gap-2">
                      <div className="p-2 flex items-center gap-2 self-stretch rounded-lg border footer-border-color shadow-[0px_1px_1px_0px_rgba(0,0,0,0.12)]">
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
                          className="btn rounded-md uppercase font-semibold bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
                          onClick={handleprofile}
                        >
                          <div className="flex justify-center items-center gap-2 text-black">
                            <FaRegUserCircle size={18} />
                            <p className="whitespace-nowrap">Profile</p>
                          </div>
                        </button>
                        <button
                          onClick={() => {
                            setIsVisible(!isVisible);
                          }}
                          type="button"
                          className="btn uppercase font-semibold rounded-md bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
                        >
                          <div className="flex justify-center items-center gap-2 text-black">
                            <p className="whitespace-nowrap">Logout</p>
                            <RiLogoutBoxRLine size={18} />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="hidden md:block">
                <Link
                  id="nav_btn_login"
                  to={"/login"}
                  className="group w-full flex gap-2 justify-center items-center transition-all duration-200 active:scale-[98%] h-10 px-6 py-2 rounded-md bg-[#2e9e28] hover:bg-[#3dc037]"
                >
                  <p className="uppercase whitespace-nowrap transition-all duration-200 text-button">
                    LOGIN/SIGNUP
                  </p>
                  <IoMdArrowForward size={20} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {SearchVisible && (
          <div
            ref={searchRef}
            className="md:absolute md:left-32 lg:left-44 2xl:w-[65%] xl:w-[60%] md:w-[52%] flex items-center"
          >
            <SearchComponent
              handleClose={handleClose}
              searchInputRef={searchInputRef}
              SearchVisible={SearchVisible}
              searchInputMobileRef={searchInputMobileRef}
            />
          </div>
        )}

        {/* Mobile Search Button */}
        <button
          onClick={() => setSearchVisible(!SearchVisible)}
          className="w-8 h-8 md:!w-[177px] md:!min-w-[177px] md:hidden md:h-10 flex items-center justify-center md:!justify-start md:gap-2 rounded-full md:!rounded-[48px] md:!pl-3 md:!pr-1.5 border active:scale-90 transition-all duration-300 cursor-text"
        >
          <img
            alt="search-icon"
            className="w-6 h-6 md:!w-[28px] md:!h-[28px]"
            src="/Images/search.svg"
          />
          <p className="!hidden md:!flex md:!line-clamp-1">
            Search for courses
          </p>
        </button>

        {/* Cart item start */}

        <Link to={"/book-order"} className="relative">
          <HiOutlineShoppingCart className="text-2xl text-green-400" />
          <span className="absolute top-[-16px] right-[-8px] rounded-full border-2 border-green-400 text-sm w-5 h-5 flex items-center justify-center text-white">
            {cart.length}
          </span>
        </Link>

        {/* Cart item end */}
      </div>

      {/* Hamburger Menu Button */}
      <button className="md:hidden" onClick={handleMenu}>
        {isMenuOpen ? (
          <>
            <div className="absolute w-[100vw] top-0 md:top-[60px] left-0 h-full min-h-screen bg-ostad-black-60">
              <div className="flex items-center justify-center absolute left-10 top-3 w-10 h-10  bg-white rounded-full transition-all">
                <XMarkIcon s className=" cursor-pointer  h-7  text-black" />
              </div>
            </div>
          </>
        ) : (
          <div className="flex gap-2 pr-2">
            <Bars3Icon className="h-[30px] cursor-pointer" />
          </div>
        )}
      </button>

      {/* Sidebar Menu */}

      <div
        ref={menuRef}
        className={`lg:hidden fixed top-0 right-0 w-3/4 h-screen sm:w-2/5 rounded-l-md nav-sidebar p-5 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-start gap-6 text-base font-medium">
          {isLoggedIn && (
            <div className="md:hidden flex flex-col gap-3 w-full">
              <Link
                to={"/user/profile"}
                className="flex items-center justify-between w-full px-2"
              >
                <div className="flex items-center gap-2">
                  <span className="w-[30px] h-[30px] bg-slate-400 rounded-full flex justify-center items-end cursor-pointer">
                    <img
                      src={"/Images/img1.png"}
                      className="w-[30px] h-[30px] object-cover rounded-full"
                      alt="User"
                    />
                  </span>
                  <p>{name}</p>
                </div>
                <IoIosArrowForward size={25} />
              </Link>
              <Link
                id="nav_btn_login"
                to={"/user/add-courses"}
                className="group w-full flex gap-2 text-sm bg-lmsfontend-text_color text-white py-2 px-2 rounded-md items-center justify-between transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <MdOutlineDashboard size={20} />
                  <p className="uppercase font-medium whitespace-nowrap transition-all duration-200 text-button">
                    Dashboard
                  </p>
                </div>
                <IoIosArrowForward size={25} />
              </Link>
            </div>
          )}

          <Link
            className="flex w-full items-center justify-between px-2"
            onClick={() => setIsMenuOpen(false)}
            to="/"
          >
            <div className="flex items-center gap-2">
              <IoHomeOutline size={19} /> Home
            </div>
            <IoIosArrowForward size={25} />
          </Link>
          <Link
            className="flex w-full items-center justify-between px-2"
            onClick={() => setIsMenuOpen(false)}
            to={"/course"}
          >
            <div className="flex items-center gap-2">
              <FaRegBookmark size={17} /> Courses
            </div>
            <IoIosArrowForward size={25} />
          </Link>
          {/* <Link
            className="flex w-full items-center justify-between px-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="flex items-center gap-2">
              <BiInfoSquare size={19} />
              About
            </div>
            <IoIosArrowForward size={25} />
          </Link> */}
          <Link
            className="flex w-full items-center justify-between px-2"
            onClick={() => setIsMenuOpen(false)}
            to={"/books"}
          >
            <div className="flex items-center gap-2">
              <FaRegBookmark size={17} /> Books
            </div>
            <IoIosArrowForward size={25} />
          </Link>
          <Link
            className="flex w-full items-center justify-between px-2"
            onClick={() => setIsMenuOpen(false)}
            to={"/vocabulary"}
          >
            <div className="flex items-center gap-2">
              <FaRegBookmark size={17} /> Vocabulary
            </div>
            <IoIosArrowForward size={25} />
          </Link>
          <Link
            className="flex w-full items-center justify-between px-2"
            onClick={() => setIsMenuOpen(false)}
            to={"/blogs"}
          >
            <div className="flex items-center gap-2">
              <FaRegBookmark size={17} /> Blogs
            </div>
            <IoIosArrowForward size={25} />
          </Link>
          <Link
            className="flex w-full items-center justify-between px-2"
            onClick={() => setIsMenuOpen(false)}
            to={"/contact"}
          >
            <div className="flex items-center gap-2">
              <FaRegAddressBook size={17} />
              Contact
            </div>
            <IoIosArrowForward size={25} />
          </Link>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-2"
          >
            <ThemeToggleIcon theme={theme} toggleTheme={toggleTheme} />
            <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
          </button>
          {!isLoggedIn && (
            <Link
              onClick={() => setIsMenuOpen(false)}
              id="nav_btn_login"
              to={"/login"}
              className="group w-full text-white flex gap-2 justify-center items-center transition-all duration-200 active:scale-[98%] h-10 px-6 py-2 rounded-md bg-[#2e9e28] hover:bg-[#3dc037]"
            >
              <p className="uppercase whitespace-nowrap transition-all duration-200 text-button">
                LOGIN/SIGNUP
              </p>
              <IoMdArrowForward size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal isVisible={isVisible} onClose={onClose} logout={logout} />

      {/* Overlay for Search */}
      {SearchVisible && (
        <div className="absolute w-[100vw] top-16 md:top-[60px] left-0 h-full min-h-screen bg-ostad-black-60"></div>
      )}
    </div>
  );
};

export default Navber;
