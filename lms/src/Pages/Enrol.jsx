import { useState } from "react";
import bkash from "../assets/payment/BKash.png";
import roket from "../assets/payment/rocket.png";
import Nagad from "../assets/payment/Nagad.png";
import { BiRightArrow } from "react-icons/bi";
import ScrollToTop from "../components/ScrollToTop";
import axiosInstance from "../components/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
const radios = [
  {
    name: "Bkash",
    description: "It's the faster, safer way to send and receive money.",
    icon: bkash,
  },
  {
    name: "Roket",
    description: " payment-processing corporation worldwide.",
    icon: roket,
  },
  {
    name: "Nagad",
    description: " Trusted world leader in digital payment technology",
    icon: Nagad,
  },
];

function Enroll() {
  const [activeFirst, setactiveFirst] = useState(false);
  const [activeSecond, setActiveSecond] = useState(false);
  const [activeThrid, setActiveThird] = useState(false);

  const handleVisibleFirst = () => {
    setactiveFirst(true);
  };
  const username = localStorage.getItem("username");
  const useremail = localStorage.getItem("email");
  const userId = localStorage.getItem("userid");
  const idCourse = localStorage.getItem("idCourse");
  const coursePrice = localStorage.getItem("cPrice");

  const [payment, setPayment] = useState("Bkash"); // Initialize state to store input value
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const handleChange = (event) => {
    setPayment(event.target.value); // Update state when input changes
  };

  const formattedDate = moment().format("YYYY-MM-DD HH:mm:ss");

  const handleSaveCourse = async () => {
    if (!userId) {
      return toast.error("someting want to worng for user");
    }
    if (!idCourse) {
      return toast.error("someting want to worng for course");
    }

    const saveData = {
      idUsers: userId,
      idCourses: idCourse,
      date: formattedDate,
      payment_method: payment,
      amount: coursePrice,
    };

    try {
      const response = await axiosInstance.post(
        `/transaction/postTransactionFromAnyPage`,
        saveData
      );
      if (response.status === 200) {
        toast.success("Thank you for buying this course!");
      } else {
        toast.warn("An error occurred while saving the course.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("payment", value);
  return (
    <>
      <ScrollToTop />
      <ToastContainer position="top-left" />
      <div className="lg:min-h-[calc(100vh_-_347px)] bg-slate-900">
        <div className="py-10 lg:py-20">
          <div className="container">
            <div className="mantine-Stepper-root mantine-15po0m8">
              <div className="mantine-1bbggxs flex md:flex-row flex-col items-start gap-2 md:items-center mantine-Stepper-steps">
                <button
                  className="mantine-UnstyledButton-root mantine-Stepper-step mantine-Stepper-stepProgress mantine-1p0p2fv"
                  type="button"
                  tabIndex="-1"
                >
                  <div
                    className={` ${
                      activeFirst ? "bg-cyan-600" : ""
                    } border-cyan-600 mantine-circle mantine-Stepper-stepIcon`}
                  >
                    {activeFirst ? (
                      <svg
                        viewBox="0 0 10 7"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                      >
                        <path
                          d="M4 4.586L1.707 2.293A1 1 0 1 0 .293 3.707l3 3a.997.997 0 0 0 1.414 0l5-5A1 1 0 1 0 8.293.293L4 4.586z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    ) : (
                      1
                    )}
                  </div>
                  <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                    <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-1g4t7xz">
                      নির্দেশনা
                    </div>
                    <div className="mantine-Text-root mantine-Stepper-stepDescription mantine-bmg3og">
                      কিভাবে এনরোল করবেন
                    </div>
                  </div>
                </button>

                <div className="mantine-1yj7uzz mantine-Stepper-separator"></div>
                <button
                  className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                  type="button"
                  tabIndex="-1"
                >
                  <div
                    className={` ${
                      activeFirst ? "border-cyan-600" : ""
                    } mantine-circle mantine-Stepper-stepIcon`}
                  >
                    3
                  </div>
                  <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                    <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-1g4t7xz">
                      নিবন্ধন
                    </div>
                    <div className="mantine-Text-root mantine-Stepper-stepDescription mantine-bmg3og">
                      আপনার তথ্য দিন
                    </div>
                  </div>
                </button>
                <div className="mantine-1yj7uzz mantine-Stepper-separator"></div>
                <button
                  className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                  type="button"
                  tabIndex="-1"
                >
                  <div
                    className={` ${activeThrid} mantine-circle mantine-Stepper-stepIcon`}
                  >
                    4
                  </div>
                  <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                    <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-1g4t7xz">
                      পেমেন্ট
                    </div>
                    <div className="mantine-Text-root mantine-Stepper-stepDescription mantine-bmg3og">
                      কোর্স ফি পরিশোধ করুন
                    </div>
                  </div>
                </button>
              </div>
            </div>
            {!activeFirst && (
              <div className="mantine-1erkqyx mantine-Stepper-content">
                <div className="py-14">
                  <div className="w-full text-center">
                    <h1 className="section-title">
                      <span className="primary-highlighter">নির্দেশনা</span>
                    </h1>
                    <p className="subtitle">
                      কোর্সটিতে এনরোল করার পূর্বে দয়া করে নিচের নির্দেশিকাটি ভাল
                      করে পড়ে নিন
                    </p>
                  </div>
                  <div className="mt-10">
                    <div className="mantine-Stepper-root mantine-15po0m8">
                      <div className="mantine-vrpx4j mantine-Stepper-steps">
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            1
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              কোর্সটি একটি অন্য-ডিমান্ড, ভিডিও অনলি এবং লিমিটেড
                              সাপোর্ট কোর্স। আপনি যেকোন সময় কোর্সটি ক্রয় করতে
                              পারবেন এবং নিজের সময়মতো ধাপে ধাপে সেলফ স্টাডি করে
                              ভিডিও দেখে দেখে শিখতে পারবেন।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            2
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              কোর্সটি করলে আপনি কোন সার্টিফিকেট পাচ্ছেন না।
                              কোর্সটি শুধুমাত্র আপনাকে রিডাক্স খুব ভালভাবে বুঝতে
                              সাহায্য করবে এবং সামগ্রিকভাবে আপনার জাভাস্ক্রিপ্ট
                              ও রিয়্যাক্ট জেএস কনসেপ্ট আরো ভাল করবে। শুধু
                              সার্টিফিকেট প্রাপ্তি যদি আপনার উদ্দেশ্য হয় তাহলে
                              এই কোর্সটি আপনার জন্য নয়। যদি শেখাটাই আপনার মুখ্য
                              উদ্দেশ্য হয়, তাহলে সামনে আগাতে পারেন।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            3
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              কোর্সটির সাথে কোন সাপোর্ট কমিটমেন্ট থাকছেনা। এটা
                              ভিডিও অনলি, সেলফ-পেসড কোর্স। তবে কোথাও আটকে গেলে
                              আপনি আমাদের ডিসকোর্ড প্রাইভেট কমিউনিটিতে পোস্ট
                              করতে পারবেন এবং কমিউনিটি মেম্বাররা তাদের সময়
                              অনুযায়ী সহযোগিতা করার চেষ্টা করবে। তবে এক্ষেত্রে
                              কোন সাপোর্ট কমিটমেন্ট থাকছেনা।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            4
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              কোর্সে এনরোল করার পূর্বে কোর্স সম্পর্কিত যাবতীয়
                              তথ্য আমাদের ওয়েবসাইট থেকে পড়ে নেয়ার অনুরোধ থাকলো।
                              এরপরেও যদি কোন প্রশ্ন থাকে, তাহলে আমাদের{" "}
                              <a
                                className="primary-highlighter"
                                href="https://facebook.com/LetsLearnwithSumit"
                                target="_blank"
                                rel="noreferrer"
                              >
                                ফেসবুক পেজ
                              </a>
                              ,{" "}
                              <a
                                className="primary-highlighter"
                                href="https://facebook.com/groups/learnwithsumit"
                                target="_blank"
                                rel="noreferrer"
                              >
                                গ্রুপ
                              </a>{" "}
                              অথবা সরাসরি সাপোর্ট সেন্টারে যোগাযোগ করুন। সমস্ত
                              যোগাযোগের তথ্য ওয়েবসাইটের ফুটার সেকশনে{" "}
                              <a
                                className="primary-highlighter"
                                href="/contact-us"
                                target="_blank"
                              >
                                যোগাযোগ
                              </a>{" "}
                              লিঙ্কে দেয়া আছে।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            5
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              এই কোর্সটি একেবারে বিগিনারদের জন্য নয়। কোর্সটি
                              করার জন্য আপনাদের কিছু বিষয় সম্পর্কে ধারণার
                              প্রয়োজন হবে। তাই কোর্সটি এনরোল করার পুর্বে কি কি
                              জানতে হবে সেটি{" "}
                              <a
                                className="primary-highlighter"
                                href="/#prerequisites"
                                target="_blank"
                              >
                                এখান থেকে
                              </a>{" "}
                              নিশ্চিত হয়ে নিন। এছাড়া পরবর্তী ধাপে কিছু কুইজের
                              উত্তর দিয়ে আপনারা আপনাদের প্রয়োজনীয় স্কিল যাচাই
                              করে নিতে পারবেন। যদি আপনি স্কিল টেস্ট দিয়ে
                              আত্মবিশ্বাসী না হয়ে থাকেন, তাহলে কোর্সটি কিনতে
                              আমরা আপনাকে নিরুৎসাহিত করছি।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            6
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              নির্ধারিত কোর্স ফি এককালীন{" "}
                              <span className="primary-highlighter">
                                1,100 টাকা (এক হাজার একশত টাকা মাত্র)
                              </span>
                              । বাংলাদেশের বাইরে থেকে যারা কোর্স ফি পরিশোধ করবেন
                              (যারা বাংলাদেশি মোবাইল নাম্বার ব্যবহার না করে অন্য
                              মোবাইল নাম্বার ব্যবহার করবেন) তাদের ক্ষেত্রে কোর্স
                              ফি -{" "}
                              <span className="primary-highlighter">
                                1,200 টাকা (এক হাজার দুইশত টাকা মাত্র)
                              </span>
                              । আমরা কোন ধরণেরে ডিস্কাউন্ট অফার করছিনা কারণ
                              আমারা নামমাত্র কোর্স ফি নির্ধারিত করেছি। এ
                              সংক্রান্ত কোন অনুরোধ আমরা রাখতে পারছিনা। এজন্য
                              আন্তরিকভাবে দুঃখ প্রকাশ করছি।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            7
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              কোর্স এনরোলমেন্ট সফলভাবে শেষ করার জন্য আপনার কিছু
                              ব্যক্তিগত তথ্যের প্রয়োজন পড়বে। এজন্য তিন নম্বর
                              ধাপে প্রয়োজনীয় সকল তথ্য নির্ভুলভাবে প্রদান করুন।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            8
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              কোর্সের ফি আপনারা আপনাদের পছন্দের পেমেন্ট
                              চ্যানেলের মাধ্যমে পরিশোধ করতে পারবেন। এজন্য চার
                              নম্বর ধাপে যেয়ে পেমেন্ট করার নির্দেশনা অনুসরণ
                              করুন।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            9
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              কোর্স ফি পরিশোধ করতে গিয়ে কোথাও কারিগরি ত্রুটির
                              সম্মুখীন হলে আমাদের সাপোর্ট সেন্টারে{" "}
                              <a
                                className="primary-highlighter"
                                href="/contact-us"
                                target="_blank"
                              >
                                যোগাযোগ
                              </a>{" "}
                              করতে পারবেন।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            10
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              আপনি এই কোর্সে এনরোল করছেন মানে হলো আপনি আমাদের
                              কোর্স প্রোগ্রামের{" "}
                              <a
                                className="primary-highlighter"
                                href="/terms"
                                target="_blank"
                              >
                                সকল শর্ত
                              </a>
                              ,{" "}
                              <a
                                className="primary-highlighter"
                                href="/privacy-policy"
                                target="_blank"
                              >
                                প্রাইভেসি পলিসি
                              </a>{" "}
                              এবং{" "}
                              <a
                                className="primary-highlighter"
                                href="/refund-policy"
                                target="_blank"
                              >
                                রিফান্ড পলিসি
                              </a>{" "}
                              মেনে নিয়েই এনরোল করছেন। কোন কনফিউশন থাকলে আবারো
                              শর্তাবলি দেখে নিন।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            11
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              কোর্স এনরোলমেন্ট করার পর ৭ দিন অতিবাহিত হয়ে গেলে
                              কোন ধরণের কোর্স ফি রিফান্ড রিকুয়েস্ট আর গ্রহণ করা
                              হবেনা। কোর্স এনরোলমেন্ট করার পর ৭ দিনের মধ্যে আপনি
                              আমাদের প্লাটফর্ম থেকে উপযুক্ত কারণ দেখিয়ে রিফান্ড
                              রিকুয়েস্ট করতে পারবেন। রিফান্ড দেয়ার সময় আপনি যে
                              মাধ্যমে পেমেন্ট করেছিলেন, সেই মাধ্যমেই রিফান্ড
                              করার চেষ্টা করা হবে। রিফান্ড করতে গিয়ে সংশ্লিষ্ট
                              মাধ্যমে কোন সার্ভিস চার্জ প্রযোজ্য হলে সেই চার্জ
                              কাস্টোমারকে বহন করতে হবে।
                            </div>
                          </div>
                        </button>
                        <div className="mantine-4eewve mantine-Stepper-separator"></div>
                        <button
                          className="mantine-UnstyledButton-root mantine-Stepper-step mantine-gluoux"
                          type="button"
                          tabIndex="-1"
                        >
                          <div className="__mantine-ref-stepIcon mantine-igkt4i mantine-Stepper-stepIcon">
                            12
                          </div>
                          <div className="mantine-1phcad1 mantine-Stepper-stepBody">
                            <div className="mantine-Text-root mantine-Stepper-stepLabel mantine-ygojka">
                              পরিশেষে কোর্স সংক্রান্ত যেকোন প্রশ্ন থাকলে আমাদের{" "}
                              <a
                                className="primary-highlighter"
                                href="/contact-us"
                                target="_blank"
                              >
                                সাপোর্ট সেন্টারে
                              </a>{" "}
                              যোগাযোগ করার অনুরোধ থাকলো।
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-20">
                    <div className="mantine-Group-root mantine-5nf8ri">
                      <button
                        className="mantine-Button-filled  dark:bg-secondary2 hover:bg-slate-700 dark:hover:bg-secondary1 text-white mantine-Button-root mantine-Group-child mantine-13xrvzk"
                        type="button"
                        onClick={handleVisibleFirst}
                      >
                        <div className="mantine-3xbgk5 mantine-Button-inner">
                          <span className="mantine-qo1k2 mantine-Button-label">
                            শর্তাবলি মেনে পরের ধাপে যেতে চাই
                          </span>
                          <span className="mantine-Button-icon mantine-Button-rightIcon mantine-386jen">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 1024 1024"
                              className="h-5 w-5"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 0 0 0-48.4z"></path>
                            </svg>
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeFirst && !activeSecond && (
              <div className="mantine-1erkqyx mantine-Stepper-content">
                <div className="space-y-14 py-14">
                  <div>
                    <h1 className="section-title text-center">
                      <span className="primary-highlighter">Registration</span>
                    </h1>
                    <p className="subtitle mx-auto w-full text-center">
                      Please provide accurate information to open an account.
                      This information will be required for logging in later.
                    </p>
                  </div>
                  {/* payment option */}
                  <div className="max-w-10/12 mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                      {/* user info */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="" className="text-gray-300">
                            Name
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent border border-gray-400 h-10 px-2 text-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="" className="text-gray-300">
                            Email
                          </label>
                          <input
                            type="email"
                            value={useremail}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border border-gray-400 h-10 px-2 text-gray-300"
                          />
                        </div>
                        <div className="space-y-1 flex flex-col">
                          <label htmlFor="" className="text-gray-300">
                            Address
                          </label>
                          <span className="text-xs text-gray-500">
                            address should be in proper english
                          </span>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-transparent border border-gray-400 h-10 px-2 text-gray-300"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="" className="text-gray-300">
                            Phone
                          </label>
                          <input
                            type="number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-transparent border border-gray-400 h-10 px-2 text-gray-300"
                          />
                        </div>
                      </div>
                      {/* payment */}
                      <div>
                        <h2 className="text-gray-300 font-medium">
                          Select your payment method
                        </h2>
                        <ul className="mt-6 space-y-3">
                          {radios.map((item, idx) => (
                            <li key={idx}>
                              <label
                                htmlFor={item.name}
                                className="block relative"
                              >
                                <input
                                  id={item.name}
                                  type="radio"
                                  defaultChecked={idx == 0 ? true : false}
                                  name="payment"
                                  className="sr-only peer"
                                  value={item.name}
                                  onChange={handleChange}
                                />
                                <div className="w-full flex gap-x-3 items-start p-4 cursor-pointer rounded-lg border bg-white shadow-sm ring-indigo-600 peer-checked:ring-2 duration-200">
                                  <img
                                    src={item.icon}
                                    alt={item.name}
                                    className="w-16 h-12 object-contain"
                                  />
                                  <div>
                                    <h3 className="leading-none text-gray-800 font-medium pr-3">
                                      {item.name}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-600">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="absolute top-4 right-4 flex-none flex items-center justify-center w-4 h-4 rounded-full border peer-checked:bg-indigo-600 text-white peer-checked:text-white duration-200">
                                  <svg
                                    className="w-2.5 h-2.5"
                                    viewBox="0 0 12 10"
                                  >
                                    <polyline
                                      fill="none"
                                      stroke-width="2px"
                                      stroke="currentColor"
                                      stroke-dasharray="16px"
                                      points="1.5 6 4.5 9 10.5 1"
                                    ></polyline>
                                  </svg>
                                </div>
                              </label>
                            </li>
                          ))}
                        </ul>

                        <button
                          onClick={handleSaveCourse}
                          className="flex bg-red-900 px-4 py-2 w-full my-4 rounded-md items-center justify-around font-bold text-2xl text-white"
                        >
                          process to pay
                          <span>
                            <BiRightArrow className="size-4" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Enroll;
