import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaCheck } from "react-icons/fa6";
import { useAuth } from "../../components/Auth";
import LogoutModal from "../../components/LogoutModal";

const Profile = () => {
  const { logout } = useAuth();
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileURL = URL.createObjectURL(file);
      setImage(fileURL);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    setEmail(email);
    setName(name);
  }, []);
  const onClose = () => {
    setIsVisible(false);
  };
  return (
    <Sidebar>
      <div className="w-full container m-auto relative">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold ml-1">Profile</h1>
          <button
            onClick={() => setIsVisible(!isVisible)}
            type="button"
            className=" uppercase font-semibold text-[#101828] bg-[#EAECF0] hover:bg-[#D0D5DD] active:bg-[#98A2B3]"
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
        <div className="flex items-start flex-col md:flex-row justify-center gap-5 py-4">
          <div className="h-auto md:w-[35vw] w-full border  shadow-sm py-4 px-4 bg-white rounded-md">
            <div className="flex items-center justify-center flex-col gap-2">
              <div className="flex flex-col justify-center items-center w-full gap-2">
                <img
                  className="w-[120px] transition-all duration-300 ease-linear bg-gray-100 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.12)] rounded-full aspect-square object-cover"
                  src={` ${
                    image
                      ? image
                      : "https://cdn.ostad.app/public/icons/user-3-line.svg"
                  } `}
                  alt="Profile"
                />
                <label htmlFor="fileInput" className="cursor-pointer">
                  <div className="flex py-1 px-3 justify-center items-center gap-2 self-stretch rounded bg-gray-100 ">
                    <p className="uppercase text-button text-ostad-black-100">
                      Upload image
                    </p>
                    <div className="text-ostad-black-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 25 24"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_1781_75861)">
                          <path
                            d="M21.5 15V18H24.5V20H21.5V23H19.5V20H16.5V18H19.5V15H21.5ZM21.508 3C22.056 3 22.5 3.445 22.5 3.993V13H20.5V5H4.5V18.999L14.5 9L17.5 12V14.829L14.5 11.829L7.327 19H14.5V21H3.492C3.22881 20.9997 2.9765 20.895 2.79049 20.7088C2.60448 20.5226 2.5 20.2702 2.5 20.007V3.993C2.50183 3.73038 2.6069 3.47902 2.79251 3.29322C2.97813 3.10742 3.22938 3.00209 3.492 3H21.508ZM8.5 7C9.03043 7 9.53914 7.21071 9.91421 7.58579C10.2893 7.96086 10.5 8.46957 10.5 9C10.5 9.53043 10.2893 10.0391 9.91421 10.4142C9.53914 10.7893 9.03043 11 8.5 11C7.96957 11 7.46086 10.7893 7.08579 10.4142C6.71071 10.0391 6.5 9.53043 6.5 9C6.5 8.46957 6.71071 7.96086 7.08579 7.58579C7.46086 7.21071 7.96957 7 8.5 7Z"
                            fill="currentColor"
                          ></path>
                        </g>
                        <defs>
                          <clipPath id="clip0_1781_75861">
                            <rect
                              width="24"
                              height="24"
                              fill="white"
                              transform="translate(0.5)"
                            ></rect>
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                  <input
                    id="fileInput"
                    className="hidden"
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <div className="flex items-start justify-start flex-col w-full gap-2">
                <label className="text-sm " htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="border border-gray-300 w-full py-3 px-3 rounded-md outline-none"
                  placeholder="enter your name"
                  value={name}
                />
              </div>
              <div className="flex items-start justify-start flex-col w-full gap-2">
                <label className="text-sm " htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="border border-gray-300 w-full py-3 px-3 rounded-md outline-none"
                  placeholder="enter your email"
                  value={email}
                />
              </div>
              <div className="flex items-start justify-start flex-col w-full gap-2">
                <label className="text-sm " htmlFor="number">
                  Phone number
                </label>
                <input
                  id="number"
                  type="number"
                  className="border border-gray-300 w-full py-3 px-3 rounded-md outline-none"
                  placeholder="write your phone number"
                />
              </div>
              <div className="flex items-center justify-center w-full mt-4">
                <button className="uppercase text-sm bg-[#2e9e28] text-white w-full flex items-center justify-center gap-2 py-3 rounded-md">
                  <span>Update</span>
                </button>
              </div>
            </div>
          </div>
          <div className="h-auto md:w-[30vw] w-full border  shadow-sm py-4 px-4 bg-white rounded-md">
            <div className="flex items-center justify-center flex-col gap-2">
              <div className="flex items-start justify-start flex-col w-full gap-2">
                <label className="text-sm " htmlFor="old">
                  Old password
                </label>
                <input
                  id="old"
                  type="password"
                  className="border border-gray-300 w-full py-3 px-3 rounded-md outline-none"
                  placeholder="enter your old password"
                />
              </div>
              <div className="flex items-start justify-start flex-col w-full gap-2">
                <label className="text-sm " htmlFor="new">
                  New password
                </label>
                <input
                  id="new"
                  type="password"
                  className="border border-gray-300 w-full py-3 px-3 rounded-md outline-none"
                  placeholder="enter your new password"
                />
              </div>
              <div className="flex items-start justify-start flex-col w-full gap-2">
                <label className="text-sm " htmlFor="Confirm">
                  Confirm password
                </label>
                <input
                  id="Confirm"
                  type="password"
                  className="border border-gray-300 w-full py-3 px-3 rounded-md outline-none"
                  placeholder="enter your confirm password"
                />
              </div>
              <div className="flex items-center justify-center w-full mt-4">
                <button className="uppercase text-sm bg-[#2e9e28] text-white w-full flex items-center justify-center gap-2 py-2 rounded-md">
                  <span>Set The Password</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoutModal isVisible={isVisible} onClose={onClose} logout={logout} />
    </Sidebar>
  );
};

export default Profile;
