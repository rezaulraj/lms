import React, { useState, useRef } from "react";

const DragDropMatch = ({ matching }) => {
  // State to track the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // State to track total correct answers
  const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);

  // State to track if the quiz is completed
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  // Extract matching data for the current question
  const currentMatching = matching[currentQuestionIndex];
  const matchingOptions = currentMatching.matchingOptions;
  const matchingMeaningOptions = currentMatching.matchingMeaningOptions;
  const matchingAnswerOptions = currentMatching.matchingAnswerOptions;

  // State to track matches and correctness for the current question
  const [matches, setMatches] = useState({}); // { meaningIndex: matchedOption }
  const [draggedOption, setDraggedOption] = useState(null); // Currently dragged option
  const [validation, setValidation] = useState({}); // { meaningIndex: true/false (correct/incorrect) }

  // Ref to track the currently dragged element
  const draggedElementRef = useRef(null);

  // Handle drag start (for desktop)
  const handleDragStart = (event, option) => {
    setDraggedOption(option);
    event.dataTransfer.setData("text/plain", option); // Required for Firefox
  };

  // Handle touch start (for mobile)
  const handleTouchStart = (event, option) => {
    setDraggedOption(option);
    draggedElementRef.current = event.target; // Track the dragged element
  };

  // Handle drag over (allow drop)
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle drop (for desktop)
  const handleDrop = (event, meaningIndex) => {
    event.preventDefault();
    if (draggedOption) {
      updateMatchesAndValidation(meaningIndex);
    }
  };

  // Handle touch end (for mobile)
  const handleTouchEnd = (event, meaningIndex) => {
    if (draggedOption && draggedElementRef.current) {
      const dropTarget = document.elementFromPoint(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY
      );
      if (
        dropTarget &&
        dropTarget.getAttribute("data-meaning-index") !== null
      ) {
        updateMatchesAndValidation(meaningIndex);
      }
    }
  };

  // Update matches and validation
  const updateMatchesAndValidation = (meaningIndex) => {
    // Update matches
    setMatches((prevMatches) => ({
      ...prevMatches,
      [meaningIndex]: draggedOption,
    }));

    // Validate the match
    const isCorrect =
      matchingOptions.indexOf(draggedOption) ===
      matchingAnswerOptions[meaningIndex];
    setValidation((prevValidation) => ({
      ...prevValidation,
      [meaningIndex]: isCorrect,
    }));

    // Update total correct answers if the match is correct
    if (isCorrect) {
      setTotalCorrectAnswers((prevTotal) => prevTotal + 1);
    }

    setDraggedOption(null); // Reset dragged option
    draggedElementRef.current = null; // Reset dragged element reference
  };

  // Handle returning an option to the options list
  const handleReturnToOptions = (meaningIndex) => {
    setMatches((prevMatches) => {
      const newMatches = { ...prevMatches };
      delete newMatches[meaningIndex]; // Remove the match
      return newMatches;
    });
    setValidation((prevValidation) => {
      const newValidation = { ...prevValidation };
      delete newValidation[meaningIndex]; // Remove the validation
      return newValidation;
    });
  };

  // Handle next question
  const handleNext = () => {
    if (currentQuestionIndex < matching.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      resetStateForNewQuestion(); // Reset state for the new question
    } else {
      // Quiz completed
      setIsQuizCompleted(true);
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      resetStateForNewQuestion(); // Reset state for the new question
    }
  };

  // Reset state for a new question
  const resetStateForNewQuestion = () => {
    setMatches({});
    setValidation({});
    setDraggedOption(null);
    draggedElementRef.current = null;
  };

  // Calculate total marks
  const totalMarks = totalCorrectAnswers;
  const totalQuestions = matching.length;
  const percentage = ((totalMarks / totalQuestions) * 100).toFixed(2);

  return (
    <div className="mt-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2 text-center">
          Drag and Drop Matching (Question {currentQuestionIndex + 1} of{" "}
          {matching.length})
        </h1>

        {/* Show result if quiz is completed */}
        {isQuizCompleted ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-xl">
              You scored <span className="font-bold">{totalMarks}</span> out of{" "}
              <span className="font-bold">{totalQuestions}</span>.
            </p>
            <p className="text-xl">
              Percentage: <span className="font-bold">{percentage}%</span>
            </p>
          </div>
        ) : (
          <>
            {/* Matching Options List */}
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2 text-center">Options</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-400 p-2 rounded-md min-h-20">
                {matchingOptions.map((option, index) => (
                  <h1
                    key={index}
                    className="text-lg font-semibold bg-gray-200 px-3 py-2 shadow-lg rounded-md w-full cursor-pointer draggable-word"
                    draggable
                    onDragStart={(event) => handleDragStart(event, option)}
                    onTouchStart={(event) => handleTouchStart(event, option)}
                  >
                    {option}
                  </h1>
                ))}
              </div>
            </div>

            {/* Matching Meaning Options */}
            <div>
              <h2 className="text-xl font-bold mb-2 text-center">
                Match Meanings
              </h2>
              <div className="grid grid-cols-1 gap-4 bg-slate-400 p-4 rounded-md">
                {matchingMeaningOptions.map((meaning, index) => (
                  <div
                    key={index}
                    data-meaning-index={index} // Used to identify drop targets on mobile
                    className={`text-lg font-semibold px-3 py-2 shadow-lg rounded-md w-full cursor-pointer ${
                      validation[index] === true
                        ? "bg-green-200" // Correct match
                        : validation[index] === false
                        ? "bg-red-200" // Incorrect match
                        : "bg-white" // No match
                    }`}
                    onDrop={(event) => handleDrop(event, index)}
                    onDragOver={handleDragOver}
                    onTouchEnd={(event) => handleTouchEnd(event, index)}
                    onClick={() => handleReturnToOptions(index)}
                  >
                    {matches[index] ? (
                      <span className="font-bold">
                        {matches[index]} - {meaning}
                      </span>
                    ) : (
                      meaning
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between w-full mt-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentQuestionIndex === matching.length - 1}
                className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:bg-gray-300"
              >
                {currentQuestionIndex === matching.length - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DragDropMatch;