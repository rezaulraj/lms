import React, { useState } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AlertModal = ({ AlertVisible, setAlertVisible, error, navigateUrl }) => {
  const [animation, setAnimation] = useState(false);
  const navigate = useNavigate();
  console.log("AlertVisible",AlertVisible);
  
  const handleFalse = () => {
    setAnimation(true); // Trigger the animation (start zoom out)

    const timeoutId = setTimeout(() => {
      setAnimation(false);
      navigate(navigateUrl);
      setAlertVisible(false);
    }, 100); // Delay matches the animation duration (1 second)

    // Cleanup function to clear the timeout when unmounted or modal is closed
    return () => clearTimeout(timeoutId);
  };

  if (!AlertVisible) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-[.98]">
      <div className="absolute top-24 w-full px-[15px] mx-auto sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1150px] xl:max-w-[1150px]">
        <div
          className={` ${
            !animation
              ? "MessagesModalAnimationDown "
              : "MessagesModalAnimationUp"
          } m-auto flex justify-center items-center w-fit rounded-[5px]`}
        >
          <div className="bg-white border-t-2 border-t-[#2e9e28] shadow-2xl rounded-lg p-4 min-w-full md:min-w-[420px]">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#ffeaea]">
                <IoMdInformationCircleOutline
                  className="text-red-600"
                  size={23}
                />
              </div>
              <p className="text-black">{error}</p>
            </div>
            <hr className="my-4" />
            <div className="flex justify-end items-end gap-4 ">
              <button
                type="button"
                className="btn !rounded-full w-[20%] bg-[#2e9e28] hover:bg-[#23771f]  active:bg-[#23771f] focus:bg-[#23771f] text-[#fff]"
                style={{
                  borderRadius: "5px",
                  height: "40px",
                  padding: "8px 24px",
                  fontSize: "14px",
                }}
                onClick={() => handleFalse()}
              >
                <div className="flex justify-center items-center gap-2 font-medium uppercase">
                  <p className="whitespace-nowrap">Ok</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
