import React, { useState, useEffect } from "react";

const VocabularyMCQ = ({ meqWord }) => {
  // Constants
  const TIME_LIMIT = 300; // 5 minutes in seconds
  const PASS_THRESHOLD = 70; // Percentage required to pass

  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT);
  const [quizFinished, setQuizFinished] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [percentage, setPercentage] = useState(0);

  // Extract questions from the data
  const questions = [
    {
      id: 0,
      question: meqWord[0].mcqQuestion,
      choices: meqWord[0].mcqOptions,
      correctAns: meqWord[0].mcqAnswer,
    },
  ];

  // Handle answer selection
  const handleAnswerChange = (questionIndex, choiceIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = choiceIndex;
    setAnswers(newAnswers);
  };

  // Handle next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  // Handle previous question
  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Handle quiz finish
  const handleFinish = () => {
    calculateResults();
    setQuizFinished(true);
  };

  // Calculate results
  const calculateResults = () => {
    let correctCount = 0;
    let incorrectCount = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAns) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    setCorrect(correctCount);
    setIncorrect(incorrectCount);
    setPercentage((correctCount / questions.length) * 100);
  };

  // Handle retake quiz
  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setTimeRemaining(TIME_LIMIT);
    setQuizFinished(false);
    setCorrect(0);
    setIncorrect(0);
    setPercentage(0);
  };

  // Format time (mm:ss)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !quizFinished) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      calculateResults();
      setQuizFinished(true);
    }
  }, [timeRemaining, quizFinished]);

  return (
    <div className="max-w-lg mx-auto px-4">
      <div className="flex-row md:flex items-center justify-between border-b-2 border-dashed border-gray-300 mb-4 pb-3">
        <h1 className="text-black text-2xl uppercase font-bold">MCQ Quiz</h1>
        <p className="text-lg font-bold text-red-500">
          Time Remaining: {formatTime(timeRemaining)}
        </p>
      </div>

      {quizFinished ? (
        <div>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Results
            </h2>
            <p className="text-lg">
              <strong>Total Correct:</strong> {correct}
            </p>
            <p className="text-lg">
              <strong>Total Incorrect:</strong> {incorrect}
            </p>
            <p className="text-lg">
              <strong>Percentage:</strong> {percentage.toFixed(2)}%
            </p>
            <p
              className={`text-lg font-bold ${
                percentage >= PASS_THRESHOLD ? "text-green-500" : "text-red-500"
              }`}
            >
              {percentage >= PASS_THRESHOLD ? "You Passed!" : "You Failed!"}
            </p>
            <button
              className="mt-4 text-white bg-blue-500 px-4 py-2 rounded"
              onClick={handleRetakeQuiz}
            >
              Retake Quiz
            </button>
          </div>
          <div className="mt-6">
            {questions.map((q, index) => (
              <div
                key={q.id}
                className="mb-4 p-4 border rounded-lg shadow-sm"
                style={{
                  borderColor:
                    answers[index] === q.correctAns ? "green" : "red",
                }}
              >
                <h3 className="text-lg font-semibold">{q.question}</h3>
                <p>
                  <strong>Your Answer:</strong>{" "}
                  <span
                    className={
                      answers[index] === q.correctAns
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {q.choices[answers[index]] || "No Answer Selected"}
                  </span>
                </p>
                <p>
                  <strong>Correct Answer:</strong>{" "}
                  <span className="text-green-600">
                    {q.choices[q.correctAns]}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-medium text-gray-800 mb-4">
            {currentQuestionIndex + 1}.{" "}
            {questions[currentQuestionIndex].question}
          </h3>
          <ul className="mt-6 space-y-3">
            {questions[currentQuestionIndex].choices.map((choice, idx) => (
              <li key={idx}>
                <label
                  htmlFor={`option-${currentQuestionIndex}-${idx}`}
                  className="block relative"
                >
                  <input
                    id={`option-${currentQuestionIndex}-${idx}`}
                    type="radio"
                    name={`quiz-${currentQuestionIndex}`}
                    className="sr-only peer"
                    checked={answers[currentQuestionIndex] === idx}
                    onChange={() =>
                      handleAnswerChange(currentQuestionIndex, idx)
                    }
                  />
                  <div className="w-full flex gap-x-3 items-start p-4 cursor-pointer rounded-lg border bg-white shadow-sm ring-indigo-600 peer-checked:ring-2 duration-200">
                    <div>
                      <p className="mt-1 text-sm text-gray-800">{choice}</p>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 flex-none flex items-center justify-center w-4 h-4 rounded-full border peer-checked:bg-indigo-600 text-white peer-checked:text-white duration-200">
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
                </label>
              </li>
            ))}
          </ul>

          <div className="flex justify-between mt-4">
            <button
              className="text-white bg-gray-500 px-4 py-2 rounded disabled:bg-gray-300"
              disabled={currentQuestionIndex === 0}
              onClick={handlePrev}
            >
              Previous
            </button>
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                className="text-white bg-blue-500 px-4 py-2 rounded"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="text-white bg-green-500 px-4 py-2 rounded"
                onClick={handleFinish}
              >
                Finish
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyMCQ;
