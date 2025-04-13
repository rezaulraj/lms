import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import DragDropMatch from "./WordMismatch";
import VocabularyMCQ from "./VocabularyMCQ";
import { FaBook } from "react-icons/fa";
import { LuBrainCircuit } from "react-icons/lu";
import { GiBrain } from "react-icons/gi";

const WordPage = () => {
  const location = useLocation();
  const { state } = location;
  const categoryData = state?.category?.data || [];

  const [isButtonOpen, setIsButtonOpen] = useState(false);
  const [isWordOpen, setIswordOpen] = useState(false);
  const [isMcqOpen, setIsMcqOpen] = useState(false);
  const [isFlipingWordOpen, setIsFlipingWordOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % categoryData.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + categoryData.length) % categoryData.length
    );
  };

  const toggleFlip = (index) => {
    const item = categoryData[index];
    if (item.Vocab?.Category?.name === "synonyms-and-antonyms") {
      setFlippedIndex(flippedIndex === index ? null : index);
    }
  };

  return (
    <div className="container md:px-0 m-auto pt-20 pb-4">
      <h1 className="font-bold text-5xl text-center">Start Learning</h1>
      <div className="h-[80vh] w-full flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-center gap-4 bg-lmsfontend-forth_color p-2 rounded-md">
          <div className="grid grid-cols-2 items-center justify-center bg-lmsfontend-secondary_color hover:bg-green-400 p-8 rounded-md shadow-lg">
            <div className="flex flex-col gap-y-6 items-center justify-center">
              <h2 className="text-xl font-bold">Word Pack 1</h2>
              <img src="https://www.svgrepo.com/show/1181/trophy.svg" alt="" />
            </div>
            <div className="flex flex-col items-end justify-end">
              <button
                onClick={() => setIsButtonOpen(true)}
                className="bg-lmsfontend-forth_color p-4 rounded-lg shadow-xl"
              >
                <h3 className="font-semibold text-xl text-white">Start</h3>
              </button>
            </div>
          </div>
        </div>

        {isButtonOpen && (
          <div className="w-full h-full fixed left-0 top-0 z-[88889]">
            <div className="w-full h-full relative">
              <div className="bg-gray-400 opacity-80 w-full h-full absolute top-0 left-0 z-[998]"></div>
              <div className="absolute z-[999] bg-white w-[95%] md:w-[80%] p-3 rounded-sm h-[90vh] md:h-[75vh] overflow-y-auto left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
                <div className="flex justify-between items-center w-full pb-3">
                  <h2 className="font-bold text-3xl">Start</h2>
                  <div
                    onClick={() => setIsButtonOpen(false)}
                    className="text-xl text-red-400 cursor-pointer"
                  >
                    <IoIosCloseCircleOutline />
                  </div>
                </div>
                <div className="h-[70%] w-full flex flex-col items-center justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 justify-center bg-lmsfontend-forth_color mt-12 p-2">
                    <div
                      onClick={() => setIswordOpen(true)}
                      className="grid grid-cols-2 bg-purple-200 hover:bg-purple-300 rounded-md p-6 md:p-12 cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <h2 className="font-bold text-2xl mb-4 md:mb-12 text-red-400 font-serif">
                          Flash Card
                        </h2>
                        <h3 className="font-bold text-xl ">Word Meaning</h3>
                      </div>
                      <div className="flex items-end justify-end ">
                        <FaBook className="text-[70px] text-red-400" />
                      </div>
                    </div>
                    <div
                      onClick={() => setIsFlipingWordOpen(true)}
                      className="grid grid-cols-2 bg-amber-200 hover:bg-amber-300 rounded-md p-6 md:p-12 cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <h2 className="font-bold text-2xl mb-4 md:mb-12 text-purple-400 font-serif">
                          Word Test
                        </h2>
                        <h3 className="font-bold text-xl ">20 word</h3>
                      </div>
                      <div className="flex items-end justify-end ">
                        <LuBrainCircuit className="text-[70px] text-purple-400" />
                      </div>
                    </div>
                    <div
                      onClick={() => setIsMcqOpen(true)}
                      className="grid grid-cols-2 bg-emerald-200 hover:bg-emerald-300 rounded-md p-6 md:p-12 cursor-pointer"
                    >
                      <div className="flex flex-col items-center">
                        <h2 className="font-bold text-2xl mb-4 md:mb-12 text-purple-400 font-serif">
                          MCQ Test
                        </h2>
                        <h3 className="font-bold text-xl ">20 word</h3>
                      </div>
                      <div className="flex items-end justify-end ">
                        <GiBrain className="text-[70px] text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isWordOpen && (
          <div className="w-full h-full fixed left-0 top-0 z-[99999]">
            <div className="w-full h-full relative">
              <div className="bg-gray-400 opacity-80 w-full h-full absolute top-0 left-0 z-[998]"></div>
              <div className="absolute z-[999] bg-white w-[95%] md:w-[80%] p-3 rounded-sm h-[90vh] md:h-[75vh] overflow-y-auto left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
                <div className="flex justify-between items-center w-full pb-3">
                  <h2 className="font-bold text-3xl text-lmsfontend-forth_color">
                    Start
                  </h2>
                  <div
                    onClick={() => setIswordOpen(false)}
                    className="text-xl text-red-400 cursor-pointer"
                  >
                    <IoIosCloseCircleOutline />
                  </div>
                </div>
                <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center h-80">
                  <div className="relative flex items-center justify-center w-full h-full">
                    {categoryData.map((item, index) => {
                      const isActive = index === currentIndex;
                      const prevIndex =
                        (currentIndex - 1 + categoryData.length) %
                        categoryData.length;
                      const nextIndex =
                        (currentIndex + 1) % categoryData.length;

                      let className =
                        "absolute transition-all duration-500 transform w-72 h-60";

                      if (isActive) {
                        className += " scale-100 z-20";
                      } else if (index === prevIndex) {
                        className += " scale-75 -translate-x-32 z-10";
                      } else if (index === nextIndex) {
                        className += " scale-75 translate-x-32 z-10";
                      } else {
                        className += " scale-50 opacity-0 z-0";
                      }

                      const isSynonymsAntonyms =
                        item.Vocab?.Category?.name === "synonyms-and-antonyms";

                      return (
                        <div
                          key={item.idWordBooks}
                          onClick={() => toggleFlip(index)}
                          className={`${className} rounded-lg shadow-lg bg-white p-2 cursor-pointer`}
                        >
                          <div
                            className={`relative w-full h-full rounded-lg transition-transform duration-700 ${
                              isSynonymsAntonyms && flippedIndex === index
                                ? "transform rotate-y-180"
                                : ""
                            }`}
                          >
                            <div
                              className={`absolute w-full h-full flex flex-col items-center justify-center border text-black rounded-lg backface-hidden ${
                                isSynonymsAntonyms && flippedIndex === index
                                  ? "opacity-0"
                                  : "opacity-100"
                              }`}
                            >
                              {item.synonyms && (
                                <>
                                  <h3 className="text-lg font-bold underline text-center">
                                    {item.word}
                                  </h3>
                                  <h4 className="mt-2 font-semibold">
                                    Meaning
                                  </h4>
                                  <p className="text-sm text-center">
                                    {item.meaning}
                                  </p>
                                  <h4 className="mt-2 font-semibold">
                                    Synonyms
                                  </h4>
                                  <p className="text-sm text-center">
                                    {item.synonyms}
                                  </p>
                                  <h4 className="mt-2 font-semibold">
                                    Antonyms
                                  </h4>
                                  <p className="text-sm text-center">
                                    {item.antonyms}
                                  </p>
                                </>
                              )}

                              {item.preposition && (
                                <>
                                  <h4 className="mt-2 text-lmsfontend-forth_color mb-2 font-semibold">
                                    Preposition
                                  </h4>
                                  <div className="flex items-center justify-center gap-3">
                                    <p className="text-md flex items-center justify-center text-center border border-black h-auto p-2 ">
                                      {item.word}
                                    </p>
                                    <span className="font-bold">+</span>
                                    <p className="text-md flex font-bold items-center justify-center text-center border border-black h-auto p-2 ">
                                      {item.preposition}
                                    </p>
                                  </div>
                                </>
                              )}
                              {/* Idioms */}
                              {/* Idioms */}
                              {item.wordMeaning && (
                                <>
                                  <h2 className="mt-2 text-lmsfontend-forth_color mb-2 font-bold flex items-end border-b-2 border-black">
                                    Idioms
                                  </h2>
                                  <p className="text-center font-semibold text-gray-500">
                                    {item.wordMeaning}
                                  </p>
                                  <p className="mt-2 text-center font-semibold">
                                    {item.example}
                                  </p>
                                </>
                              )}

                              {/* Group verbs */}
                              {item.verb && (
                                <>
                                  <h2 className="mt-2 text-lmsfontend-forth_color mb-2 font-bold flex items-end border-b-2 border-black">
                                    Gruop Verb
                                  </h2>
                                  <p className="text-center font-semibold text-gray-500">
                                    {item.verb}
                                  </p>
                                  <p className="mt-2 text-center font-semibold">
                                    {item.meaning}
                                  </p>
                                </>
                              )}

                              {item.translation && (
                                <>
                                  <h2 className="mt-2 text-lmsfontend-forth_color mb-2 font-bold flex items-end border-b-2 border-black">
                                    Translation
                                  </h2>
                                  <p className="text-center font-semibold text-gray-500">
                                    {item.translation}
                                  </p>
                                  <p className="mt-2 text-center font-semibold">
                                    {item.meaning}
                                  </p>
                                </>
                              )}

                              {item.idOneWordSub && (
                                <>
                                  <h2 className="mt-2 text-lmsfontend-forth_color mb-2 font-bold flex items-end border-b-2 border-black">
                                    One Word Subtitution
                                  </h2>
                                  <p className="text-center font-semibold text-gray-500">
                                    {item.word}
                                  </p>
                                  <p className="mt-2 text-center font-semibold">
                                    {item.meaning}
                                  </p>
                                  <p className="mt-2 text-center font-semibold">
                                    {item.sentence}
                                  </p>
                                </>
                              )}

                              {item.spelling && (
                                <>
                                  <h2 className="mt-2 text-lmsfontend-forth_color mb-2 font-bold text-center border-b-2 border-black">
                                    Spelling
                                  </h2>
                                  <p className="text-center font-semibold text-gray-500">
                                    {item.spelling}
                                  </p>
                                  <p className="mt-2 text-center font-semibold">
                                    {item.meaning}
                                  </p>
                                </>
                              )}
                            </div>
                            {/* Render backface content only for synonyms-and-antonyms */}
                            {isSynonymsAntonyms && (
                              <div
                                className={`absolute w-full h-full bg-white text-black flex flex-col items-center border justify-center rounded-lg rotate-y-180 transition duration-150 backface-hidden ${
                                  flippedIndex === index
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              >
                                {item.tricks && (
                                  <>
                                    <h3 className="text-lg font-bold">
                                      Tricks
                                    </h3>
                                    <p className="text-sm text-center px-4">
                                      {item.tricks}
                                    </p>
                                  </>
                                )}
                                {item.sentence && (
                                  <>
                                    <h4 className="mt-2 font-semibold">
                                      Sentence
                                    </h4>
                                    <p className="text-sm text-center">
                                      {item.sentence}
                                    </p>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute -bottom-10 -left-10 right-0 flex justify-center items-center space-x-4 p-4">
                    <button
                      onClick={handlePrev}
                      className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600"
                    >
                      Previous◀
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600"
                    >
                      ▶ Next
                    </button>
                  </div>
                  <div className="absolute bottom-12 flex space-x-2">
                    {categoryData.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === currentIndex ? "bg-gray-800" : "bg-gray-400"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isFlipingWordOpen && (
          <div className="w-full h-full fixed left-0 top-0 z-[99999]">
            <div className="w-full h-full relative">
              <div className="bg-gray-400 opacity-80 w-full h-full absolute top-0 left-0 z-[998]"></div>
              <div className="absolute z-[999] bg-white w-[95%] md:w-[80%] p-3 rounded-sm h-[90vh] md:h-[85vh] overflow-y-auto left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
                <div className="flex justify-between items-center w-full pb-3">
                  <h2 className="font-bold text-3xl text-lmsfontend-forth_color">
                    Make Sentence
                  </h2>
                  <div
                    onClick={() => setIsFlipingWordOpen(false)}
                    className="text-xl text-red-400 cursor-pointer"
                  >
                    <IoIosCloseCircleOutline />
                  </div>
                </div>
                <DragDropMatch matching={categoryData} />
              </div>
            </div>
          </div>
        )}

        {isMcqOpen && (
          <div className="w-full h-full fixed left-0 top-0 z-[99999]">
            <div className="w-full h-full relative">
              <div className="bg-gray-400 opacity-80 w-full h-full absolute top-0 left-0 z-[998]"></div>
              <div className="absolute z-[999] bg-white w-[95%] md:w-[80%] p-3 rounded-sm h-[90vh] md:h-[85vh] overflow-y-auto left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]">
                <div className="flex justify-between items-center w-full pb-3">
                  <h2 className="font-bold text-3xl text-lmsfontend-forth_color">
                    MCQ Test
                  </h2>
                  <div
                    onClick={() => setIsMcqOpen(false)}
                    className="text-xl text-red-400 cursor-pointer"
                  >
                    <IoIosCloseCircleOutline />
                  </div>
                </div>
                <VocabularyMCQ meqWord={categoryData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordPage;
