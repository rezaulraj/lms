import React, { useState } from "react";

const GradientCarousel = () => {
  const items = [
    {
      id: 1,
      word: "Serene",
      sound: "🔊",
      meaning: "Calm, peaceful, and untroubled.",
      synonyms: ["Tranquil", "Calm", "Peaceful"],
      antonyms: ["Agitated", "Chaotic", "Noisy"],
    },
    {
      id: 2,
      word: "Eloquent",
      sound: "🔊",
      meaning: "Fluent or persuasive in speaking or writing.",
      synonyms: ["Articulate", "Expressive", "Fluent"],
      antonyms: ["Inarticulate", "Unclear", "Mumbling"],
    },
    {
      id: 3,
      word: "Resilient",
      sound: "🔊",
      meaning: "Able to recover quickly from difficulties.",
      synonyms: ["Strong", "Tough", "Flexible"],
      antonyms: ["Weak", "Rigid", "Fragile"],
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState(-1); // Tracks which card is flipped

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const toggleFlip = (index) => {
    setFlippedIndex((prev) => (prev === index ? -1 : index)); // Flip or unflip the card
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center h-64 sm:h-72 md:h-80 lg:h-96">
      {/* Carousel Container */}
      <div className="relative flex items-center justify-center w-full h-full">
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          const nextIndex = (currentIndex + 1) % items.length;

          let className =
            "absolute transition-all duration-500 transform w-48 h-28 sm:w-64 sm:h-36 md:w-72 md:h-44";

          if (isActive) {
            className += " scale-100 z-20";
          } else if (index === prevIndex) {
            className += " scale-75 -translate-x-32 z-10";
          } else if (index === nextIndex) {
            className += " scale-75 translate-x-32 z-10";
          } else {
            className += " scale-50 opacity-0 z-0";
          }

          return (
            <div
              key={item.id}
              onClick={() => toggleFlip(index)}
              className={`${className} rounded-lg shadow-lg bg-gray-800 flex items-center justify-center cursor-pointer`}
            >
              <div
                className={`relative w-full h-full rounded-lg transition-transform duration-700 ${
                  flippedIndex === index ? "transform rotate-y-180" : ""
                }`}
              >
                {/* Front Side */}
                <div
                  className={`absolute w-full h-full bg-gray-900 text-white flex flex-col items-center justify-center rounded-lg backface-hidden ${
                    flippedIndex === index ? "opacity-0" : "opacity-100"
                  }`}
                >
                  <h3 className="text-lg font-bold">{item.word}</h3>
                  <button
                    className="mt-2 bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card flip when clicking sound
                      alert(`Play sound for "${item.word}"`);
                    }}
                  >
                    {item.sound}
                  </button>
                </div>

                {/* Back Side */}
                <div
                  className={`absolute w-full h-full bg-gray-700 text-white flex flex-col items-center justify-center rounded-lg rotate-y-180 backface-hidden ${
                    flippedIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <h3 className="text-lg font-bold">Meaning</h3>
                  <p className="text-sm text-center px-4">{item.meaning}</p>
                  <h4 className="mt-2 font-semibold">Synonyms</h4>
                  <p className="text-sm">{item.synonyms.join(", ")}</p>
                  <h4 className="mt-2 font-semibold">Antonyms</h4>
                  <p className="text-sm">{item.antonyms.join(", ")}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Left Button */}
      <div className="absolute bottom-2 flex justify-between w-full px-6 sm:px-0 sm:absolute sm:top-auto sm:left-4 sm:right-4 sm:bottom-auto">
        <button
          onClick={handlePrev}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600"
        >
          ◀
        </button>

        {/* Right Button */}
        <button
          onClick={handleNext}
          className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-600"
        >
          ▶
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 flex space-x-2">
        {items.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
              index === currentIndex ? "bg-gray-800" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default GradientCarousel;
