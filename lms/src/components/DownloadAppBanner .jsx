import React from "react";
import banner from "../../public/Images/mobile_app_promotion_banner.png";
const DownloadAppBanner = () => {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat w-full rounded-md"
      style={{
        backgroundImage:
          "url('/Images/2023-09-26T07-12-37.047Z-bg-app-min.webp",
      }}
    >
      <div className="w-full px-[15px] mx-auto sm:max-w-[540px] md:max-w-[720px] lg:max-w-[1150px] xl:max-w-[1050px]">
        <div className="hidden md:flex items-center py-16">
          <div className="overflow-hidden h-[300px] flex flex-col lg:flex-row pb-4 lg:pb-0 w-full items-center gap-6 rounded-2xl border  bg-white">
            <img
              src={banner}
              className="w-full h-[100%] lg:w-[364px] aspect-[464/310] cursor-pointer rounded-md"
              alt="App Banner"
              loading="lazy"
            />
            <div className="px-6">
              <p className="text-3xl font-semibold">
                Download Trace Academy App
              </p>
              <p className="text-body-paragraph mt-2">
                To get the best experience of live classes, download Ustad App
                now
              </p>
              <div className="mt-6 gap-5 xl:flex  xl:w-full xl:mb-4">
                <button
                  type="button"
                  className="btn text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
                  style={{
                    borderRadius: "5px",
                    color: "inherit",
                    height: "40px",
                    padding: "8px 24px",
                    fontSize: "14px",
                  }}
                >
                  <div className="flex justify-center items-center gap-2">
                    <div className="flex justify-center items-center">
                      <img
                        src="https://cdn.ostad.app/public/upload/2023-06-01T10-27-11.432Z-andorid.png"
                        alt="Android"
                        style={{ width: "19px", height: "19px" }}
                      />
                    </div>
                    <p className="whitespace-nowrap">android</p>
                  </div>
                </button>
                <button
                  type="button"
                  className="btn text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
                  style={{
                    borderRadius: "5px",
                    color: "inherit",
                    height: "40px",
                    padding: "8px 24px",
                    fontSize: "14px",
                  }}
                >
                  <div className="flex justify-center items-center gap-2">
                    <div className="flex justify-center items-center">
                      <img
                        src="https://cdn.ostad.app/public/upload/2023-06-01T10-29-58.451Z-app-store-1.png"
                        alt="iOS / macOS"
                        style={{ width: "19px", height: "19px" }}
                      />
                    </div>
                    <p className="whitespace-nowrap">iOS / macOS</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="py-6 px-0 block md:hidden">
          <p className="text-white text-2xl font-semibold text-center">
            Download Trace Academy App
          </p>
          <p className="text-body-paragraph text-white text-center mb-6 mt-2">
            To get the best experience of live classes, download Ustad App now
          </p>
          <img
            src={banner}
            className="w-full h-auto md:w-[464px] aspect-[464/310] cursor-pointer rounded-lg"
            alt="App Banner"
            loading="lazy"
          />
          <div className="flex items-center w-full gap-4 mt-4">
            <button
              type="button"
              className="btn text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
              style={{
                borderRadius: "5px",
                color: "inherit",
                height: "40px",
                padding: "8px 24px",
                fontSize: "14px",
              }}
            >
              <div className="flex justify-center items-center gap-2">
                <div className="flex justify-center items-center">
                  <img
                    src="https://cdn.ostad.app/public/upload/2023-08-06T09-54-30.739Z-app-store-line.svg"
                    alt="iOS App"
                    style={{ width: "19px", height: "19px" }}
                  />
                </div>
                <p className="whitespace-nowrap">iOS App</p>
              </div>
            </button>
            <button
              type="button"
              className="btn text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
              style={{
                borderRadius: "5px",
                color: "inherit",
                height: "40px",
                padding: "8px 24px",
                fontSize: "14px",
              }}
            >
              <div className="flex justify-center items-center gap-2">
                <div className="flex justify-center items-center">
                  <img
                    src="https://cdn.ostad.app/public/upload/2023-08-06T09-55-06.499Z-google-play-line.svg"
                    alt="Android App"
                    style={{ width: "19px", height: "19px" }}
                  />
                </div>
                <p className="whitespace-nowrap">Android App</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppBanner;
