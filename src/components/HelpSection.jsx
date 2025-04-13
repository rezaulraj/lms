import React from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { IoCallOutline } from "react-icons/io5";

function HelpSection() {
  return (
    <div className="box-border bg-white gap-4 flex flex-col md:flex-row justify-between items-center p-4 md:py-6 lg:px-8 md:px-2 w-full h-auto lg:h-[208px] border  rounded-2xl">
     
      
      <Player
       
        autoplay={true}
        loop={true}
        controls={true}
        src="https://lottie.host/36958462-8366-4c6c-a94a-87c6f78394a0/xAuUpLLvpb.json"
        style={{ height: "170px", width: "170px" }}
      ></Player>
      <div className="flex flex-col items-center p-0 gap-3 h-[62px]">
        <p className="text-xl font-semibold text-lmsfontend-text_color">
          Need help?
        </p>
        <div className="w-full md:hidden">
          <button
            type="button"
            className="btn text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
            style={{
              borderRadius: "8px",
              color: "inherit",
              height: "48px",
              padding: "12px 24px",
              fontSize: "14px",
            }}
          >
            <div className="flex justify-center items-center gap-2">
              <div className="flex justify-center items-center">
                <img
                  src="https://cdn.ostad.app/public/icons/phone-line.svg"
                  alt="Phone Icon"
                  style={{
                    width: "19px",
                    minWidth: "19px",
                    height: "19px",
                    minHeight: "19px",
                  }}
                />
              </div>
              <p className="whitespace-nowrap">01521241083</p>
            </div>
          </button>
        </div>
        <div>
          <p className="body-paragraph md:text-[14px]  text-center text">
            Call for any technical issues{" "}
            <span className="body-paragraph text-lmsfontend-text_color">
              ( 12 AM to 12 PM )
            </span>
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center p-0 gap-1 h-[76px]">
        <p className="body-paragraph hidden md:block md:text-[14px]">
          Call
        </p>
        <div className="hidden md:block">
          <button
            type="button"
            className="  px-2 py-2 rounded-md text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
           
          >
            <div className="flex justify-center items-center gap-2">
              <div className="flex justify-center items-center">
              <IoCallOutline size={20}/>
              </div>
              <a href="tel:01746185116" className="whitespace-nowrap md:text-[14px] font-semibold">01746185116</a>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default HelpSection;
