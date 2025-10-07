import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { useAuth } from "./Auth.jsx";
import { useTheme } from "../components/ThemeContext";
import { useGoogleLogin } from "@react-oauth/google";
import { BiSolidError } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toastId = React.useRef(null);
  const [user, setUser] = useState("");
  const [EmailError, setEmailError] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [Error, setError] = useState("");
  const { login } = useAuth();

  // Handle Click From Submition
  const handleFromSignIn = async (event) => {
    event.preventDefault();

    // Input validation
    if (!email && !password) {
      setPasswordError("Password is required");
      setEmailError("Email is required");
      return;
    }
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!password) {
      setPasswordError("Password is required");

      return;
    }

    setIsLoading(true);
    try {
      await fetch(
        "https://backendoflms.crowningenglish.com:" +
          import.meta.env.VITE_BACKEND_PORT +
          "/api/auth/signin_fromNodeJWT",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },

          body: JSON.stringify({
            email: email,
            password: password,
            sign_up_by: "node_jwt",
            // roles: [selectedOption],
          }),
        }
      ).then(async function (response) {
        const text = await response.json();

        const lastStatus = response.status;
        if (lastStatus === 200) {
          console.log("text", text);
          login(text.accessToken);
          toast("Successed");
          setIsLoading(false);
          localStorage.setItem("userid", text.id);
          localStorage.setItem("email", email);
          localStorage.setItem("username", text.username);
          navigate("/user/my-courses", {
            state: {
              id: text.id,
              username: text.username,
              email: text.email,
              roles: text.roles,
              accessToken: text.accessToken,
            },
          });
        } else {
          setError("Incorrect username or password.");
        }

        setIsLoading(false);
        console.log(text); //here you can access it
      });
    } catch (error) {
      console.error("Error saving data:" + error);
      setIsLoading(false);
      if (!toast.isActive(toastId.current)) {
        toastId.current = toast("Error sending data: " + error);
        setIsLoading(false);
      }
    }
  };
  const gogglelogin = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.access_token) {
        try {
          setIsLoading(true);
          const res = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: "application/json",
              },
            }
          );

          try {
            setIsLoading(true);

            await fetch(
              "https://backendoflms.crowningenglish.com:" +
                import.meta.env.VITE_BACKEND_PORT +
                "/api/auth/signin_fromGoogle",
              {
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
                body: JSON.stringify({
                  // username: response.data.name,
                  email: res.data.email,
                  password: res.data.id,
                  sign_up_by: "google",
                }),
              }
            ).then(async function (response) {
              const text = await response.json();
              console.log("google api res", text);
              setIsLoading(false);
              if (response.status === 200) {
                if (!toast.isActive(toastId.current)) {
                  login(text.accessToken);
                  localStorage.setItem("email", res.data.email);
                  localStorage.setItem("username", res.data.name);
                  localStorage.setItem("userid", text.id);
                  console.log("first text", text);
                  // localStorage.setItem("admin","admin");
                  navigate("/user/my-courses");
                }
              } else {
                if (!toast.isActive(toastId.current)) {
                  setError(text.message);
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
    <div
      className={`${
        theme === "light" ? "" : "bg-slate-800 "
      } h-[100vh] mt-10 flex items-center justify-center `}
    >
      {Error && (
        <div className=" absolute top-10 mt-10 m bg-red-100 rounded-md border border-red-300 flex items-center gap-5 px-2 py-3">
          <div className="flex items-center gap-1">
            <BiSolidError color="red" size={20} />
            {Error}
          </div>{" "}
          <IoMdClose
            size={20}
            color="red"
            className="cursor-pointer"
            onClick={() => setError("")}
          />
        </div>
      )}
      <div className="shadow-lmsShadow md:px-10 px-5 py-5 m-1 flex flex-col items-center justify-center gap-2 rounded-md">
        <span className="flex flex-col items-center justify-center">
          <img src="/Images/signin_vct.PNG" alt="" className="w-20" />
          <h2
            className={` ${
              theme === "light"
                ? "text-lmsfontend-forth_color bg-slate-50"
                : "text-white "
            } text-xl font-bold `}
          >
            Login
          </h2>
        </span>
        <div className="flex flex-col items-center justify-center gap-4 ">
          <div className="flex flex-col items-center justify-center gap-4 relative">
            <span
              className={`${
                EmailError ? "border px-1 border-red-700" : "px-1"
              } flex items-center shadow-second_shadow rounded-md bg-white`}
            >
              <img src="/Images/email.PNG" alt="" className="w-10 px-1" />
              <div className="inputDiv">
                <input
                  type="email"
                  placeholder=" "
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailError("");
                  }}
                  required
                />
                <span>Email</span>
              </div>
              <BiSolidError
                color="red"
                size={25}
                className={`${
                  EmailError ? "block" : "hidden"
                } absolute right-2`}
              />
            </span>
            <div className="absolute top-[56px] left-0 text-[red] text-sm">
              {EmailError ? EmailError : ""}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 relative">
            <span
              className={`${
                PasswordError ? "border px-1 border-red-700" : "px-1"
              } flex items-center shadow-second_shadow rounded-md bg-white`}
            >
              <img src="/Images/password.PNG" alt="" className="w-10 px-1" />
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
              </div>
              <BiSolidError
                color="red"
                size={25}
                className={`${
                  PasswordError ? "block" : "hidden"
                } absolute right-2`}
              />
            </span>
            <div className="absolute top-[56px] left-0 text-[red] text-sm">
              {PasswordError ? PasswordError : ""}
            </div>
          </div>
          <span className="mt-2">
            <div className="bg-black flex items-center rounded shadow-second_shadow active:scale-95">
              <img src="/Images/submit_icon.PNG" alt="" className="w-10 px-1" />
              <button
                className="bg-yellow-300 p-1 font-semibold rounded-r"
                onClick={handleFromSignIn}
              >
                Submit
              </button>
            </div>
          </span>
          <span>
            <p className="text-xl font-normal text-blue-600 mt-1 text-center ">
              <Link to="/forget-passwod">Forget Password?</Link>
            </p>
            <p
              className={`${
                theme === "light"
                  ? "text-lmsfontend-forth_color bg-slate-50"
                  : "text-white "
              }  text-sm font-normal mt-3 `}
            >
              If You have not any account then?
              <Link
                to="/signup"
                className="text-green-400 font-semibold underline ml-2"
              >
                SignUp
              </Link>
            </p>
            <ToastContainer stacked autoClose={2000} position="top-center" />
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
              htmlFor="google"
              onClick={gogglelogin}
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
        </div>
      </div>
    </div>
  );
};

export default Login;
