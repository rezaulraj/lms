import React, { useEffect, useState } from "react";
import Answers from "./Answers";

// Importing the question data
const questions = [
  {
    id: 0,
    question:
      "The process in which a region is made free from any electric field is known as__",
    option1: "A. Electrostatic forcing",
    option2: "B. Electrostatic binding",
    option3: "C. Electrostatic shielding",
    option4: "D. None of the options",
    correctAns: "C. Electrostatic shielding",
  },
  {
    id: 1,
    question: "What is the SI unit of electric charge?",
    option1: "A. Coulomb",
    option2: "B. Ampere",
    option3: "C. Volt",
    option4: "D. Ohm",
    correctAns: "A. Coulomb",
  },
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [answers, setAnswers] = useState(Array(questions.length).fill(null)); // Track answers for all questions
  const [quizFinished, setQuizFinished] = useState(false); // Track if quiz is finished
  const [timeRemaining, setTimeRemaining] = useState(300); // Set timer (e.g., 5 minutes = 300 seconds)
  const PASS_THRESHOLD = 50; // Minimum percentage to pass

  useEffect(() => {
    if (quizFinished) return; // Stop timer if quiz is finished

    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer); // Stop timer when it reaches zero
          setQuizFinished(true); // Auto-finish quiz
          return 0;
        }
        return prevTime - 1; // Decrease time by 1 second
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [quizFinished]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (index, selectedAnswer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = selectedAnswer;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinish = () => {
    setQuizFinished(true); // Mark quiz as finished
  };

  const handleRetakeQuiz = () => {
    setQuizFinished(false); // Reset quiz finished state
    setAnswers(Array(questions.length).fill(null)); // Reset answers
    setCurrentQuestionIndex(0); // Reset to first question
    setTimeRemaining(300); // Reset timer
  };

  // Calculate total correct and incorrect answers
  const calculateResults = () => {
    let correct = 0;
    let incorrect = 0;

    answers.forEach((answer, index) => {
      if (answer !== null) {
        if (answer === questions[index].correctAns) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    const totalQuestions = questions.length;
    const percentage = (correct / totalQuestions) * 100;

    return { correct, incorrect, percentage };
  };

  const { correct, incorrect, percentage } = calculateResults(); // Get correct and incorrect counts

  return (
    <div className="container md:px-0 m-auto pt-20 pb-4">
      <div className="flex-row md:flex items-center justify-center md:justify-around border-b-2 border-dashed border-gray-300 mb-4 pb-3">
        <h1 className="text-black text-2xl uppercase font-bold">Quiz</h1>
        <p className="text-lg font-bold text-red-500">
          Time Remaining: {formatTime(timeRemaining)}
        </p>
      </div>

      {quizFinished ? (
        <div className="max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your Answers
          </h2>
          <div className="mt-6 flex flex-col items-center justify-center bg-gray-600 my-6 p-4 rounded-md">
            <p className="text-lg text-white">
              <strong>Total Correct: </strong>
              {correct}
            </p>
            <p className="text-lg text-white">
              <strong>Total Incorrect: </strong>
              {incorrect}
            </p>

            <p className="text-lg text-white">
              <strong>Percentage: </strong>
              {percentage.toFixed(2)}%
            </p>

            <p
              className={`text-lg font-bold mt-4 ${
                percentage >= PASS_THRESHOLD ? "text-green-400" : "text-red-400"
              }`}
            >
              {percentage >= PASS_THRESHOLD ? "You Passed!" : "You Failed"}
            </p>
            <button
              className="text-white bg-green-500 px-4 py-2 rounded-md shadow-md mt-4"
              onClick={handleRetakeQuiz}
            >
              Retake Quiz
            </button>
          </div>

          <ul className="space-y-6">
            {questions.map((q, questionIndex) => (
              <li
                key={questionIndex}
                className="p-4 border rounded-lg shadow-md"
              >
                <h3 className="font-semibold text-lg">{q.question}</h3>
                <ul className="mt-4 space-y-3">
                  {[q.option1, q.option2, q.option3, q.option4].map(
                    (choice, idx) => (
                      <li key={idx}>
                        <label
                          htmlFor={`result-option-${questionIndex}-${idx}`}
                          className={`block relative ${
                            idx === answers[questionIndex]
                              ? idx === q.correctAns
                                ? "bg-green-100 border-green-500"
                                : "bg-red-100 border-red-500"
                              : "bg-white"
                          }`}
                        >
                          <div className="w-full flex gap-x-3 items-start p-4 cursor-pointer rounded-lg border shadow-sm duration-200">
                            <p className="mt-1 text-sm text-gray-800">
                              {choice}
                            </p>
                          </div>
                          {idx === q.correctAns && (
                            <div className="absolute top-4 right-4 flex-none flex items-center justify-center w-4 h-4 rounded-full bg-green-500 text-white">
                              <svg className="w-2.5 h-2.5" viewBox="0 0 12 10">
                                <polyline
                                  fill="none"
                                  strokeWidth="2px"
                                  stroke="currentColor"
                                  strokeDasharray="16px"
                                  points="1.5 6 4.5 9 10.5 1"
                                ></polyline>
                              </svg>
                            </div>
                          )}
                          {idx === answers[questionIndex] &&
                            idx !== q.correctAns && (
                              <div className="absolute top-4 right-4 flex-none flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white">
                                <svg
                                  className="w-2.5 h-2.5"
                                  viewBox="0 0 12 10"
                                >
                                  <line
                                    x1="2"
                                    y1="2"
                                    x2="10"
                                    y2="10"
                                    stroke="currentColor"
                                    strokeWidth="2px"
                                  />
                                  <line
                                    x1="10"
                                    y1="2"
                                    x2="2"
                                    y2="10"
                                    stroke="currentColor"
                                    strokeWidth="2px"
                                  />
                                </svg>
                              </div>
                            )}
                        </label>
                      </li>
                    )
                  )}
                </ul>
                <div className="mt-4 text-sm text-gray-600">
                  <strong>Your Answer: </strong>
                  {answers[questionIndex] || "Not Answered"}
                  <br />
                  <strong>Correct Answer: </strong>
                  {q.correctAns}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          <Answers
            question={questions[currentQuestionIndex]}
            currentQuestionIndex={currentQuestionIndex}
            selectedAnswer={answers[currentQuestionIndex]}
            onAnswerChange={handleAnswerChange}
          />

          <div className="flex justify-between mt-4">
            <button
              className="text-white bg-gray-500 px-4 py-2 rounded-md shadow-md disabled:bg-gray-300"
              disabled={currentQuestionIndex === 0} // Disable Previous button on the first question
              onClick={handlePrev}
            >
              Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="text-white bg-indigo-500 px-4 py-2 rounded-md shadow-md"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="text-white bg-green-500 px-4 py-2 rounded-md shadow-md"
                onClick={handleFinish}
              >
                Finish
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Quiz;
