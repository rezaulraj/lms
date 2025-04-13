import React, { useEffect, useRef, useState } from "react";
import { IoMdCall } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import { FaWhatsapp } from "react-icons/fa";
import support from "../../public/Images/support.jpg"
export default function SupportButton() {
  const [visible, setIsVisble] = useState(false);
  const [visibleCall, setIsvisibleCall] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0); // To keep track of the last scroll position
  const dropdownRef = useRef();
  const buttonRef = useRef();
  useEffect(() => {
    if (!visible) {
      const handleScroll = () => {
        const currentScrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        if (currentScrollTop > lastScrollTop) {
          // Scrolling down
          setIsvisibleCall(false);
        } else {
          // Scrolling up
          setIsvisibleCall(true);
        }
        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop); // For Mobile or negative scrolling
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [lastScrollTop, visible]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsVisble(false);
      }
    }
    // Attach the event listener to the document
    document.addEventListener("click", handleClickOutside);
    // Cleanup: Remove the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="fixed right-4  flex flex-col justify-end items-end gap-[21px]"
      style={{ bottom: "70px" }}
    >
      {visible && (
        <div
          ref={dropdownRef}
          className="w-[291px] opacity-100 rounded-lg h-[400px] transition-all duration-[400ms] overflow-hidden border footer-border-color bg-trace-color"
        >
          <div className="relative w-[291px] flex">
            <div className="absolute z-0 opacity-0 -right-[291px] top-0 w-full  p-4 transition-all duration-[400ms]">
              <div className="w-full flex flex-col gap-2">
                <button className="w-8 h-8 flex justify-center items-center rounded-full bg-ostad-black-bg hover:bg-ostad-black-light-overlay active:scale-95 transition-all duration-[400ms]">
                  <img
                    className="w-6 h-6"
                    src="https://cdn.ostad.app/public/icons/arrow-left-line.svg"
                    alt="Back"
                  />
                </button>
                <div className="w-full flex flex-col items-center gap-[10px]">
                  <div className="w-[156px] h-[156px]">
                    <svg
                      viewBox="0 0 25 25"
                      height="256"
                      width="256"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                    >
                      {/* SVG path should be placed here */}
                    </svg>
                  </div>
                  <div className="w-full flex flex-col gap-1">
                    <p className="text-subtitle-s1 text-center text-ostad-black-70">
                      Scan the <br /> following QR Code from mobile to make a
                      call
                    </p>
                    <p className="text-b1 text-center text-ostad-black-40">
                      Or Call - +8801940444476
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute z-10 py-2 opacity-100 left-0 top-0 w-full bg-trace-color  p-4 transition-all duration-[400ms]">
              <div className="w-full flex flex-col gap-[14px]">
                <div className="w-full flex flex-col items-center gap-2">
                  <p className="text-2xl text-center ">
                    Talk <br /> to a Customer Support
                  </p>
                  <img
                    className="w-[156px] h-[156px] rounded-full object-cover"
                    src={support}
                    alt="Career Counselor"
                  />
                  <div className="w-full flex flex-col h-[42px]"></div>
                </div>
                <div className="w-full flex flex-col gap-2 ">
                  <button
                    type="button"
                    className="group w-full flex gap-2 justify-center items-center transition-all duration-200 active:scale-[98%] h-10 px-6 py-2 rounded-md bg-lmsfontend-text_color  text-white"
                  >
                    <IoMdCall size={20} />
                    <p className="uppercase whitespace-nowrap transition-all duration-200 text-button ">
                      Call
                    </p>
                  </button>
                  <button
                    type="button"
                    className="group text-black w-full flex gap-2 justify-center items-center transition-all duration-200 active:scale-[98%] h-10 px-6 py-2 rounded-md bg-gray-300"
                  >
                    <FaWhatsapp size={20} className="text-[#188a4b]"/>
                    <p className="uppercase whitespace-nowrap transition-all duration-200 text-button ">
                      WhatsApp
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <button
        ref={buttonRef}
        onClick={() => {
          setIsVisble(!visible);
          setIsvisibleCall(true);
        }}
        className="  bg-slate-950 hover:bg-ostad-black-60 flex items-center gap-2 py-3 px-3 rounded-xl shadow cursor-pointer transition-all duration-300 active:scale-95 overflow-hidden"
      >
        <IoCallOutline size={20} color="white" />
        {visibleCall && (
          <p className="opacity-100 text-white text-body-b1 whitespace-nowrap transition-all duration-300">
            Call
          </p>
        )}
      </button>
    </div>
  );
}
