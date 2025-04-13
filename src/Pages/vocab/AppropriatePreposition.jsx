import React, { useEffect, useState } from "react";
import PremiumVocab from "./PremiumVocab";
import FreemiumVocab from "./FreemiumVocab";
import axios from "axios";
const AppropriatePreposition = () => {
  const [isVideoPoppedUp, setVideoPopUp] = useState(false);
  const [approPP, setApproPP] = useState([]);

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
  });

  const fetchWords = async () => {
    try {
      const response = await axiosInstance.get("/approPPs/getAll");
      setApproPP(response.data);
    } catch (error) {
      console.error("Error fetching approPPs:", error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const groupedData = approPP.reduce((acc, item) => {
    const vocabType = item.Vocab.Category.vocabType;
    const title = item.Vocab.title;

    // Initialize the vocabType if it doesn't exist
    if (!acc[vocabType]) {
      acc[vocabType] = { datas: [] };
    }

    // Check if a datas object with the same title already exists
    let datasEntry = acc[vocabType].datas.find(
      (entry) => entry.title === title
    );

    // If it doesn't exist, create a new datas entry
    if (!datasEntry) {
      datasEntry = { title, data: [] };
      acc[vocabType].datas.push(datasEntry);
    }

    // Add the item to the corresponding data array
    datasEntry.data.push(item);

    return acc;
  }, {});

  console.log(groupedData);

  console.log("Grouped Data:", groupedData);

  const premiumData = groupedData["Premium"]?.datas || [];
  const freemiumData = groupedData["Freemium"]?.datas || [];

  console.log("unititle", groupedData);
  console.log("premium", premiumData);
  console.log("freemiumData", freemiumData);
  return (
    <div className="container md:px-0 m-auto pt-20 pb-4">
      <section>
        <div className="max-w-screen-xl mx-auto px-4 py-10 gap-12 text-gray-600 overflow-hidden md:px-8 md:flex">
          <div className="flex-none space-y-5 max-w-xl">
            <h1 className="text-4xl text-gray-800 font-extrabold sm:text-5xl">
              How to Learn Synonyms and Antonyms.
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
          <div className="flex-1 max-w-xl mx-auto mt-14 xl:mt-0">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                className="rounded-lg"
                alt=""
              />
              <button
                className="absolute w-16 h-16 rounded-full inset-0 m-auto duration-150 bg-blue-500 hover:bg-blue-600 ring-offset-2 focus:ring text-white"
                onClick={() => setVideoPopUp(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-6 h-6 m-auto"
                >
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="my-8">
          <h1 className="text-3xl text-white font-extrabold sm:text-4xl bg-slate-800 py-2 pl-2 mb-14 tracking-wider">
            <span className="text-[#FFD700] ">Freemium</span> Vocab
          </h1>
          <FreemiumVocab data={freemiumData} />
        </div>

        <div className="my-8">
          <h1 className="text-3xl text-white font-extrabold sm:text-4xl bg-slate-800 py-2 pl-2 mb-14 tracking-wider">
            <span className="text-[#FFD700] ">Premium</span> Vocab
          </h1>
          <PremiumVocab data={premiumData} />
        </div>
      </section>
      {isVideoPoppedUp ? (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center">
          <div
            className="absolute inset-0 w-full h-full bg-black/50"
            onClick={() => setVideoPopUp(false)}
          ></div>
          <div className="px-4 relative">
            <button
              className="w-12 h-12 mb-5 rounded-full duration-150 bg-gray-800 hover:bg-gray-700 text-white"
              onClick={() => setVideoPopUp(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 m-auto"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
            <iframe
              className="rounded-lg min-w-[354px] md:min-w-[1024px] h-[440px]"
              src="https://www.youtube.com/embed/5-T6Xqlh6BU"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default AppropriatePreposition;
