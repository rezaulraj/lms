import React, { useEffect, useState } from "react";
import PremiumVocab from "./PremiumVocab";
import FreemiumVocab from "./FreemiumVocab";
import { Link } from "react-router-dom";
import axios from "axios";

const Vocabulary = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPremium, setShowPremium] = useState(false);
  const [showFreemium, setShowFreemium] = useState(false);
  const [premiumData, setPremiumData] = useState([]);
  const [freemiumData, setFreemiumData] = useState([]);
  const [categorys, setCategories] = useState([]);
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
  });

  const getAllCategory = async () => {
    try {
      const response = await axiosInstance.get("/categorys/getAll");
      setCategories(response.data);
    } catch (error) {
      console.log("Error in getAllCategory", error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const premiumVocab = categorys.filter(
      (item) => item.category === category && item.vocabType === "Premium"
    );
    const freemiumVocab = categorys.filter(
      (item) => item.category === category && item.vocabType === "Freemium"
    );

    setPremiumData(premiumVocab);
    setFreemiumData(freemiumVocab);

    setShowPremium(premiumVocab.length > 0);
    setShowFreemium(freemiumVocab.length > 0);
  };

  console.log("premiumVocab", premiumData);
  console.log("freemiumVocab", freemiumData);

  const uniqueCategories = [...new Set(categorys.map((item) => item.category))];

  return (
    <div className="container md:px-0 m-auto pt-20 pb-4">
      <section>
        <div className="max-w-screen-xl mx-auto px-4 py-10 gap-12 text-gray-600 overflow-hidden md:px-8 md:flex">
          <div className="flex-none space-y-5 max-w-xl">
            <h1 className="text-4xl text-gray-800 font-extrabold sm:text-5xl">
              Build your Vocab with our Platform
            </h1>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vitae
              architecto ea nemo quod officiis explicabo suscipit nihil,
              necessitatibus perspiciatis amet.
            </p>
            <div className="flex items-center gap-x-3 sm:text-sm">
              <a
                href="javascript:void(0)"
                className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 duration-150 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"
              >
                Get started
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="flex-1 hidden md:block relative">
            <img
              src="https://raw.githubusercontent.com/sidiDev/remote-assets/c86a7ae02ac188442548f510b5393c04140515d7/undraw_progressive_app_m-9-ms_oftfv5.svg"
              className="max-w-xl"
            />
            <span className="absolute top-10 left-[28px] font-bold text-[#FFD700] text-2xl tracking-wide uppercase font-mono">
              Crowning English Vocab
            </span>
            <span className="absolute top-20 right-16 font-bold text-[#FFD700] text-[10px] tracking-wide uppercase font-mono">
              Crowning English
              <div className="pl-7">Vocab</div>
            </span>
          </div>
        </div>
      </section>
      {/* Category of learning vocabs */}

      <section>
        <h1 className="text-4xl text-gray-800 font-extrabold sm:text-5xl text-center border-b-2 border-lmsfontend-forth_color pb-2">
          Our Vocab Categories
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5 group">
          <Link
            to={"/synonyms-and-antonyms"}
            className="bg-lmsfontend-secondary_color h-64 rounded-md p-1 flex flex-col justify-between items-center hover:scale-105 cursor-pointer transition duration-500"
          >
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="flex items-center justify-center">
                <img
                  src="https://www.svgrepo.com/show/263133/alphabet.svg"
                  alt=""
                  className="h-36 object-cover "
                />
              </div>
              <h1 className="text-lmsfontend-forth_color font-bold text-center text-2xl">
                Synonyms and Antonyms
              </h1>
            </div>
          </Link>
          <Link
            to={"/appropriate-preposition"}
            className="bg-lmsfontend-secondary_color h-64 rounded-md p-1 flex flex-col justify-between items-center hover:scale-105 cursor-pointer transition duration-500"
          >
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="flex items-center justify-center">
                <div className="h-32 p-2 rounded-3xl text-3xl bg-gray-300 text-center flex items-center">
                  Lot
                </div>
                <div className="text-3xl font-bold">+</div>
                <div className="h-32 p-2 rounded-3xl text-3xl bg-gray-300 text-center flex items-center">
                  Of
                </div>
              </div>
              <h1 className="text-lmsfontend-forth_color font-bold text-center text-2xl">
                Appropriate Preposition
              </h1>
            </div>
          </Link>
          <Link
            to={"/idioms"}
            className="bg-lmsfontend-secondary_color h-64 rounded-md p-1 flex flex-col justify-between items-center hover:scale-105 cursor-pointer transition duration-500"
          >
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="flex items-center justify-center">
                <img
                  src="https://www.svgrepo.com/show/263160/book.svg"
                  alt=""
                  className="h-36 object-cover "
                />
              </div>
              <h1 className="text-lmsfontend-forth_color font-bold text-center text-2xl">
                Idioms
              </h1>
            </div>
          </Link>
          <Link
            to={"/translation"}
            className="bg-lmsfontend-secondary_color h-64 rounded-md p-1 flex flex-col justify-between items-center hover:scale-105 cursor-pointer transition duration-500"
          >
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="flex items-center justify-center">
                <img
                  src="https://www.svgrepo.com/show/263174/archives-document.svg"
                  alt=""
                  className="h-36 object-cover "
                />
              </div>
              <h1 className="text-lmsfontend-forth_color font-bold text-center text-2xl">
                Translations
              </h1>
            </div>
          </Link>
          <Link
            to={"/group-verb"}
            className="bg-lmsfontend-secondary_color h-64 rounded-md p-1 flex flex-col justify-between items-center hover:scale-105 cursor-pointer transition duration-500"
          >
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="flex items-center justify-center">
                <img
                  src="https://www.svgrepo.com/show/263161/brain.svg"
                  alt=""
                  className="h-36 object-cover "
                />
              </div>
              <h1 className="text-lmsfontend-forth_color font-bold text-center text-2xl">
                Group Verbs
              </h1>
            </div>
          </Link>
          <Link
            to={"/one-word-substitution"}
            className="bg-lmsfontend-secondary_color h-64 rounded-md p-1 flex flex-col justify-between items-center hover:scale-105 cursor-pointer transition duration-500"
          >
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="flex items-center justify-center">
                <img
                  src="https://www.svgrepo.com/show/263143/light-bulb-idea.svg"
                  alt=""
                  className="h-36 object-cover "
                />
              </div>
              <h1 className="text-lmsfontend-forth_color font-bold text-center text-2xl">
                One Word Substitution
              </h1>
            </div>
          </Link>
          <Link
            to={"/spelling"}
            className="bg-lmsfontend-secondary_color h-64 rounded-md p-1 flex flex-col justify-between items-center hover:scale-105 cursor-pointer transition duration-500"
          >
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="flex items-center justify-center">
                <img
                  src="https://www.svgrepo.com/show/263177/calligraphy-abc.svg"
                  alt=""
                  className="h-36 object-cover "
                />
              </div>
              <h1 className="text-lmsfontend-forth_color font-bold text-center text-2xl">
                Spelling
              </h1>
            </div>
          </Link>
        </div>
      </section>

      {/* <section className="">
        <h1 className="text-4xl text-gray-800 font-extrabold sm:text-5xl text-center border-b-2 border-lmsfontend-forth_color pb-2">
          Our Vocab Categories
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-5 group">
          {uniqueCategories.map((category, index) => (
            <div
              key={index}
              className="bg-lmsfontend-secondary_color h-64 rounded-md p-1 flex flex-col justify-between items-center hover:scale-105 cursor-pointer transition duration-500"
              onClick={() => handleCategoryClick(category)}
            >
              {category === "Appropriate Preposition" ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="flex items-center justify-center">
                    <div className="h-32 p-2 rounded-3xl text-3xl bg-gray-300 text-center flex items-center">
                      Lot
                    </div>
                    <div className="text-3xl font-bold">+</div>
                    <div className="h-32 p-2 rounded-3xl text-3xl bg-gray-300 text-center flex items-center">
                      Of
                    </div>
                  </div>
                  <h1 className="text-lmsfontend-forth_color font-bold text-center text-2xl">
                    {category}
                  </h1>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img
                    src="https://w7.pngwing.com/pngs/920/640/png-transparent-book-lot-book-book-retro-comic-book-reading-thumbnail.png"
                    alt=""
                    className="h-36 object-cover "
                  />
                  <h1 className="text-lmsfontend-forth_color font-bold text-center text-2xl">
                    {category}
                  </h1>
                </div>
              )}
            </div>
          ))}
        </div>

        {showFreemium && (
          <div className="my-8">
            <h1 className="text-3xl text-white font-extrabold sm:text-4xl bg-slate-800 py-2 pl-2 mb-14 tracking-wider">
              <span className="text-[#FFD700] ">Freemium</span> Vocab
            </h1>
            <FreemiumVocab data={freemiumData} />
          </div>
        )}

        {showPremium && (
          <div className="my-8">
            <h1 className="text-3xl text-white font-extrabold sm:text-4xl bg-slate-800 py-2 pl-2 mb-14 tracking-wider">
              <span className="text-[#FFD700] ">Premium</span> Vocab
            </h1>
            <PremiumVocab data={premiumData} />
          </div>
        )}
      </section> */}
    </div>
  );
};

export default Vocabulary;
