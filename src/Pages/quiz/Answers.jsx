import React from "react";

const Answers = ({ question, currentQuestionIndex, selectedAnswer, onAnswerChange }) => {
  const handleSelection = (choiceIndex) => {
    onAnswerChange(currentQuestionIndex, choiceIndex); // Update the answer for the current question
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <h2 className="text-gray-900 font-medium text-center my-8">
        Select Your Correct Answer
      </h2>
      <div className="flex items-center justify-center gap-2">
        <h1 className="text-white bg-indigo-400 rounded-full w-10 h-10 p-2 flex items-center justify-center font-bold">
          {question.id + 1}
        </h1>
        <h3 className="text-xl font-medium text-indigo-500">{question.question}</h3>
      </div>

      <ul className="mt-6 space-y-3">
        {[question.option1, question.option2, question.option3, question.option4].map(
          (choice, idx) => (
            <li key={idx}>
              <label
                htmlFor={`option-${question.id}-${idx}`}
                className="block relative"
              >
                <input
                  id={`option-${question.id}-${idx}`}
                  type="radio"
                  name={`question-${question.id}`}
                  checked={selectedAnswer === choice}
                  onChange={() => handleSelection(choice)}
                  className="hidden"
                />
                <div
                  className={`w-full flex gap-x-3 items-center p-4 cursor-pointer rounded-lg border shadow-sm duration-200 ${
                    selectedAnswer === choice ? "border border-green-400" : ""
                  }`}
                >
                  <p className="text-gray-800">{choice}</p>
                </div>
              </label>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default Answers;
