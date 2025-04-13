import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useTheme } from "./ThemeContext";
const ForgetPassword = () => {
  const [isFormOpen, setIsFormOpen] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [OTP, setOTP] = useState("");
  const toastId = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  //  OTP Send Function
  const handleSentEmailVarify = async (event) => {
    event.preventDefault();

    if (!email) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Email is required", {
          position: "top-center",
        });
      }

      return;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("Invalid email format", {
          position: "top-center",
        });
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
        const text = await response.text();

        setIsLoading(false);

        if (!toast.isActive(toastId.current)) {
          toastId.current = toast("Successfully Send Opt in Your Email.");
        }
        // toast(text);
        if (response !== 200) {
          setIsFormOpen("otp");
        }

        console.log(text);
      });

      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // OTP send for forget password
  const handleOtp = async (event) => {
    event.preventDefault();

    if (!OTP) {
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast.error("OTP is required", {
          position: "top-center",
        });
      }
      return;
    }
    setIsLoading(true);
    try {
      await fetch(
        "http://194.233.87.22:" +
          import.meta.env.VITE_BACKEND_PORT +
          "/api/auth/verify_otp_by_email",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ otp: OTP, email: email }),
        }
      ).then(async function (response) {
        const text = await response.text();

        setIsLoading(false);

        if (!toast.isActive(toastId.current)) {
          toastId.current = toast("Success");
        }
        // toast(text);
        if (response !== 200) {
          setIsFormOpen("password");
        }

        console.log(text);
      });

      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Handle Reset password Submition
  const handleResetPassword = async (event) => {
    event.preventDefault();

    // Input Validtion

    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!OTP) {
      newErrors.OTP = "OTP is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword.length < 6) {
      newErrors.confirmPassword =
        "Confirm Password must be at least 6 characters long";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords should be the same";
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
    console.log("All Data reset", email, OTP, password);

    try {
      await fetch(
        "http://194.233.87.22:" +
          import.meta.env.VITE_BACKEND_PORT +
          "/api/auth/reset_password",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            OTP: OTP,
            password: password,
          }),
        }
      ).then(async function (response) {
        setIsLoading(false);
        const text = await response.text();

        console.log(text);

        if (!toast.isActive(toastId.current)) {
          toastId.current = toast("Successfully Change Password");
        }
        console.log(text); //here you can access it
      });
      setIsLoading(false);

      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100vh]  flex items-center justify-center">
      {isFormOpen === "email" && (
        <div className="shadow-lmsShadow w-[22rem] h-[25rem] m-2 flex flex-col items-center rounded-md p-4">
          <span
            className={` ${
              theme === "light" ? "text-lmsfontend-forth_color" : "text-white"
            } text-center flex flex-col items-center`}
          >
            <img src="/Images/forget_password.PNG" alt="" className="w-20" />
            <h2 className={` text-xl font-bold  uppercase`}>
              Forget Password?
            </h2>
            <p>
              Enter eamil address associated{" "}
              <span className="block">with your account.</span>
            </p>
          </span>
          <div className="flex flex-col items-center justify-center gap-4 h-[15rem]">
            <span className="flex items-center shadow-second_shadow rounded bg-white px-1">
              <img src="/Images/email.PNG" alt="" className="w-10 px-1" />
              <div className="inputDiv">
                <input
                  type="email"
                  placeholder=" "
                  required
                  onChange={(event) => setEmail(event.target.value)}
                />
                <span>Email</span>
              </div>
            </span>
            <span className="">
              <div
                className="bg-black flex items-center shadow-second_shadow active:scale-95 rounded"
                onClick={handleSentEmailVarify}
              >
                <img
                  src="/Images/submit_icon.PNG"
                  alt=""
                  className="w-10 px-1"
                />
                <button className="bg-yellow-300 p-1 font-semibold">
                  Submit
                </button>
              </div>
            </span>
            {isLoading && (
              <div className="loader-container">
                <RotatingLines color="#333" height={50} width={50} />
              </div>
            )}
          </div>
        </div>
      )}
      {isFormOpen === "otp" && (
        <div className="shadow-lmsShadow w-[22rem] h-[25rem] p-2 flex flex-col items-center gap-2 m-2 rounded-md">
          <span className="text-center flex flex-col items-center">
            <img src="/Images/forget_password.PNG" alt="" className="w-20" />
            <h2 className="text-xl font-semibold">Verification</h2>
            <p>
              Enter the verification code we sent you on your email address.
            </p>
          </span>
          <div className="flex flex-col items-center justify-center gap-3 h-[8rem]">
            <span className="flex items-center shadow-second_shadow rounded-md">
              <img src="/Images/email.PNG" alt="" className="w-10 px-1" />
              <div className="inputDiv">
                <input
                  type="text"
                  placeholder=" "
                  required
                  onChange={(event) => setOTP(event.target.value)}
                />
                <span>OTP</span>
              </div>
            </span>
          </div>
          <span className="">
            <div
              className="bg-black flex items-center rounded shadow-second_shadow"
              onClick={handleOtp}
            >
              <img src="/Images/submit_icon.PNG" alt="" className="w-10 px-1" />
              <button className="bg-yellow-300 p-1">Submit</button>
            </div>
          </span>
          <span className="text-center ">
            Already have an Account?
            <span className="text-green-600">Sign In</span>
          </span>
          {isLoading && (
            <div className="loader-container">
              <RotatingLines color="#333" height={50} width={50} />
            </div>
          )}
        </div>
      )}
      {isFormOpen === "password" && (
        <div className="shadow-lmsShadow w-[22rem] h-[25rem] p-1 flex flex-col items-center gap-2  rounded-md">
          <span className="text-center flex flex-col items-center">
            <img src="/Images/new_password.PNG" alt="" className="w-20" />
            <h2 className="text-xl font-semibold">Reset Password</h2>
          </span>
          <div className="flex flex-col items-center justify-center gap-3 h-[15rem]">
            <span className="flex items-center shadow-second_shadow rounded-md">
              <img src="/Images/password.PNG" alt="" className="w-10 px-1" />
              <div className="inputDiv">
                <input
                  type="text"
                  placeholder=" "
                  required
                  onChange={(event) => setPassword(event.target.value)}
                />
                <span>Password</span>
              </div>
            </span>
            <span className="flex items-center shadow-second_shadow rounded-md">
              <img
                src="/Images/confirm_password.PNG"
                alt=""
                className="w-10 px-1"
              />
              <div className="inputDiv">
                <input
                  type="password"
                  placeholder=" "
                  required
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <span>Confirm Password</span>
              </div>
            </span>
          </div>
          <span className="ml-10 relative">
            <div
              className="bg-black flex items-center shadow-second_shadow rounded"
              onClick={handleResetPassword}
            >
              <img src="/Images/submit_icon.PNG" alt="" className="w-10 px-1" />
              <button className="bg-yellow-300 p-1">Submit</button>
            </div>
          </span>
          <span className="text-center ">
            If You Have An Account then?
            <Link
              to="/"
              className="text-sm underline font-semibold text-green-400"
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
      <ToastContainer stacked autoClose={3000} position="top-center" />
    </div>
  );
};

export default ForgetPassword;
