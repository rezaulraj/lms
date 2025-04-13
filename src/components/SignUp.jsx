import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { useGoogleLogin } from "@react-oauth/google";
import { ImGooglePlus } from "react-icons/im";
import { BiSolidError } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";

import axios from "axios";
const SignUp = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [passShow, setPassShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [OTP, setOTP] = useState("");
  const [selectedRoles, setSelectedRoles] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const toastId = React.useRef(null);
  const { theme } = useTheme();
  const [user, setUser] = useState("");
  const [error, setError] = useState("");
  const [EmailError, setEmailError] = useState("");
  const [Otperror, setOtpError] = useState("");
  const [NameError, setNameError] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [PhoneError, setPhoneError] = useState("");

  // const handleOptionChange = (event) => {
  //   setSelectedRoles(event.target.value);
  // };

  //  OTP Send Function
  const handleOtp = async (event) => {
    event.preventDefault();

    if (!email) {
      if (!toast.isActive(toastId.current)) {
        // toastId.current = toast.error("Email is required", {
        //   position: "top-center",
        // });
      }
      setEmailError("Email is required");
      return;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      if (!toast.isActive(toastId.current)) {
        // toastId.current = toast.error("Invalid email format", {
        //   position: "top-center",
        // });
        setError("Invalid email format");
      }

      return;
    }
    setIsLoading(true);
    try {
      await fetch(
        "http://194.233.87.22:" +
          import.meta.env.VITE_BACKEND_PORT +
          "/api/auth/otp",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      ).then(async function (response) {
        setIsLoading(false);
        const text = await response.text();

        if (!toast.isActive(toastId.current)) {
          toastId.current = toast("Successfully Sent Otp In Your Email.");
        }

        if (response !== 200) {
          setIsFormOpen(true);
        }

        // toast(text);
        console.log(text);
      });

      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Registation form Funcation

  // Handle Click From Submition
  const handleFromSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (!userName) {
      // newErrors.userName = "Username is required";
      setNameError("Name is required");
      return;
    }

    if (!email) {
      newErrors.email = "Email is required";
      return;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
      return;
    }

    if (!OTP) {
      // newErrors.OTP = "OTP is required";
      setOtpError("OTP is required");
      return;
    }

    if (!password) {
      // newErrors.password = "Password is required";
      setPasswordError("Password is required");
      return;
    } else if (password.length < 6) {
      // newErrors.password = "Password must be at least 6 characters long";
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (selectedRoles.length === 0) {
      newErrors.selectedRoles = "Select at least one role";
    }

    // If there are validation errors, display toast messages
    if (Object.keys(newErrors).length > 0) {
      Object.values(newErrors).forEach((error) => {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.error(error, {
            position: "top-center",
          });
        }
      });
      return;
    }
    // Input Validation End
    setIsLoading(true);

    try {
      await fetch(
        "http://194.233.87.22:" +
          import.meta.env.VITE_BACKEND_PORT +
          "/api/auth/signup_fromNodeJWT",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            username: userName,
            email: email,
            OTP: OTP,
            password: password,
            roles: [selectedRoles],
            sign_up_by: "node_jwt",
          }),
        }
      ).then(async function (response) {
        const text = await response.json();
        setIsLoading(false);

        if (response.status === 200) {
          if (!toast.isActive(toastId.current)) {
            toastId.current = toast("Success");
          }
        } else {
          if (!toast.isActive(toastId.current)) {
            // toastId.current = toast(text);
            setError(text.message);
            console.log();
          }
        }

      });
      setIsLoading(false);

      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
      setIsLoading(false);
    }
  };
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.access_token) {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: "application/json",
              },
            }
          );
          console.log(response.data);

          try {
            setIsLoading(true);

            await fetch(
              "http://194.233.87.22:" +
                import.meta.env.VITE_BACKEND_PORT +
                "/api/auth/signup_fromGoogle",
              {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify({
                  username: response.data.name,
                  email: response.data.email,
                  password: response.data.id,
                  sign_up_by: "google",
                }),
              }
            ).then(async function (response) {
              const text = await response.json();
              setIsLoading(false);
              if (response.status === 200) {
                if (!toast.isActive(toastId.current)) {
                  toastId.current = toast("Success");
                }
              } else {
                if (!toast.isActive(toastId.current)) {
                  // toastId.current = toast(text);
                  setError(text.message);
                  console.log();
                }
              }

              console.log(text); //here you can access it
            });
          } catch (err) {
            toast.error("An error occurred during registration");

            setIsLoading(false);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setIsLoading(false);
        }
      }
      setUser("");
    };

    fetchData();
  }, [user]);

  return (
    <>
      <ToastContainer stacked autoClose={3000} position="top-center" />
      <div
        className={`${
          theme === "light" ? "" : "bg-slate-800 "
        } h-[100vh] mt-10  flex items-center relative justify-center`}
      >
        {error && (
          <div className=" absolute top-10 bg-red-100 rounded-md border border-red-300 flex items-center gap-5 px-5 py-3">
            <div className="flex items-center gap-1">
              <BiSolidError color="red" size={20} />
              {error}
            </div>{" "}
            <IoMdClose
              size={20}
              color="red"
              className="cursor-pointer"
              onClick={() => setError("")}
            />
          </div>
        )}
        {!isFormOpen && (
          <div className="shadow-lmsShadow w-[22rem] gap-7  m-2 p-2 py-5 flex flex-col items-center rounded-md">
            <span className="text-center flex flex-col items-center">
              <img src="/Images/forget_password.PNG" alt="" className="w-20" />
              <h2
                className={` ${
                  theme === "light"
                    ? "text-lmsfontend-forth_color bg-slate-50"
                    : "text-white "
                } text-xl font-bold `}
              >
                Sign Up?
              </h2>
              <p
                className={`${
                  theme === "light"
                    ? "text-lmsfontend-forth_color bg-slate-50"
                    : "text-white "
                }`}
              >
                Enter eamil address associated{" "}
                <span className="block">with your account.</span>
              </p>
            </span>
            <div className="flex flex-col items-center justify-center gap-4 relative">
              <span
                className={`flex items-center shadow-second_shadow rounded-md bg-white ${
                  EmailError ? "border px-1 border-red-700" : "px-1"
                } `}
              >
                <img src="/Images/email.PNG" alt="" className="w-10 px-1" />
                <div className="inputDiv">
                  <input
                    type="email"
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setEmailError("");
                    }}
                    placeholder=" "
                    required
                  />
                  <span>Email</span>

                  <BiSolidError
                    color="red"
                    size={25}
                    className={`${
                      EmailError ? "block" : "hidden"
                    } absolute right-2`}
                  />
                </div>
              </span>
              <div className="absolute top-[56px] left-0 text-[red] text-sm">
                {EmailError ? EmailError : ""}
              </div>
              <span className=" relative mt-1">
                <div
                  className="bg-black flex items-center rounded shadow-second_shadow"
                  onClick={handleOtp}
                >
                  <img
                    src="/Images/submit_icon.PNG"
                    alt=""
                    className="w-10 px-1"
                  />
                  <button className="bg-yellow-300 p-1 rounded-r font-semibold">
                    Submit
                  </button>
                </div>
              </span>
              <div
                className={` ${
                  theme === "light" ? "text-black" : "text-white"
                } login flex items-center gap-2`}
              >
                <hr className="bg-black w-28 h-[1px]" />
                Or
                <hr className="bg-black w-32 h-[1px]" />
              </div>
              <div className="flex gap-4">
                <button
                  className=" bg-[#eceef0] shadow-second_shadow flex items-center gap-2 rounded-md jus px-6 py-2 font-semibold text-black "
                  onClick={login}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/300/300221.png"
                    className="w-5"
                    alt=""
                  />
                  <p> Google</p>
                </button>

                <button
                  className=" bg-[#3b5998] shadow-second_shadow flex items-center gap-2 rounded-md jus px-5 py-2 font-semibold text-white "
                  htmlFor="google"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3670/3670032.png"
                    className="w-6"
                    alt=""
                  />
                  <p> Facebook</p>
                </button>
              </div>

              {isLoading && (
                <div className="loader-container">
                  <RotatingLines color="#333" height={50} width={50} />
                </div>
              )}
            </div>
          </div>
        )}
        {isFormOpen && (
          <div className="shadow-lmsShadow px-5 md:px-8  py-4 flex flex-col items-center gap-2  rounded-lg">
            <span className="text-center flex flex-col items-center">
              {theme === "light" ? (
                <img src="/Images/sign_up.PNG" alt="" className="w-20" />
              ) : (
                <img
                  src="https://cdn-icons-png.flaticon.com/128/17163/17163954.png"
                  alt=""
                  className="w-20"
                />
              )}
              <h2
                className={`${
                  theme === "light" ? "text-black" : "text-white"
                }  text-xl font-semibold`}
              >
                SIGN UP
              </h2>
            </span>
            <div className="flex flex-col items-center justify-center gap-3 h-[20rem]">
              <div className="relative mb-2">
                <span
                  className={`flex items-center shadow-second_shadow rounded-md bg-white ${
                    Otperror ? "border px-1 border-red-700" : "px-1"
                  } `}
                >
                  <img src="/Images/name.PNG" alt="" className="w-10 px-1" />
                  <div className="inputDiv">
                    <input
                      type="text"
                      placeholder=" "
                      required
                      onChange={(event) => {
                        setOTP(event.target.value);
                        setOtpError("");
                      }}
                    />
                    <span>Otp</span>
                    <BiSolidError
                      color="red"
                      size={25}
                      className={`${
                        Otperror ? "block" : "hidden"
                      } absolute right-2`}
                    />
                  </div>
                </span>
                <div className="absolute top-[56px] left-0 text-[red] text-sm">
                  {Otperror ? Otperror : ""}
                </div>
              </div>
              <div className="relative mb-2">
                <span
                  className={`flex items-center shadow-second_shadow rounded-md bg-white ${
                    NameError ? "border px-1 border-red-700" : "px-1"
                  } `}
                >
                  <img src="/Images/name.PNG" alt="" className="w-10 px-1" />
                  <div className="inputDiv">
                    <input
                      type="text"
                      placeholder=" "
                      required
                      onChange={(event) => {
                        setUserName(event.target.value);
                        setNameError("");
                      }}
                    />
                    <span>Name</span>
                    <BiSolidError
                      color="red"
                      size={25}
                      className={`${
                        NameError ? "block" : "hidden"
                      } absolute right-2`}
                    />
                  </div>
                </span>
                <div className="absolute top-[56px] left-0 text-[red] text-sm">
                  {NameError ? NameError : ""}
                </div>
              </div>
              <div className="relative mb-2">
                <span
                  className={`flex items-center shadow-second_shadow rounded-md bg-white ${
                    PasswordError ? "border px-1 border-red-700" : "px-1"
                  } `}
                >
                  <img
                    src="/Images/password.PNG"
                    alt=""
                    className="w-10 px-1"
                  />
                  <div className="inputDiv">
                    <input
                      type="password"
                      placeholder=" "
                      required
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setPasswordError("");
                      }}
                    />
                    <span>Password</span>
                    <BiSolidError
                      color="red"
                      size={25}
                      className={`${
                        PasswordError ? "block" : "hidden"
                      } absolute right-2`}
                    />
                  </div>
                </span>
                <div className="absolute top-[56px] left-0 text-[red] text-sm">
                  {PasswordError ? PasswordError : ""}
                </div>
              </div>
              <span
                className={`flex items-center shadow-second_shadow rounded-md bg-white ${
                  PhoneError ? "border px-1 border-red-700" : "px-1"
                } `}
              >
                <img src="/Images/phone_icon.PNG" alt="" className="w-9 px-1" />
                <div className="inputDiv">
                  <input
                    type="number"
                    placeholder=" "
                    required
                    onChange={(event) => setPhone(event.target.value)}
                  />
                  <span>Phone</span>
                </div>
              </span>
            </div>
            <span className="ml-10 relative">
              <div
                className="bg-black flex items-center shadow-second_shadow rounded"
                onClick={handleFromSubmit}
              >
                <img
                  src="/Images/submit_icon.PNG"
                  alt=""
                  className="w-10 px-1"
                />
                <button className="bg-yellow-300 p-1">Submit</button>
              </div>
            </span>
            <span
              className={`${
                theme === "light"
                  ? "text-lmsfontend-forth_color "
                  : "text-white "
              } text-center `}
            >
              Already have an Account?
              <Link
                to={"/login"}
                className="text-green-400 font-semibold text-xl ml-2"
              >
                Sign In
              </Link>
            </span>
            {isLoading && (
              <div className="loader-container">
                <RotatingLines color="#333" height={50} width={50} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SignUp;
