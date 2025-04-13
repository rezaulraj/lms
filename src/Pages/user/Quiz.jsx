import React from "react";

const Quiz = ({ quiz }) => {
  return (
    <div className="absolute inset-0 w-[50%] h-[50vh] bg-white">
      {quiz.video_name}
    </div>
  );
};

export default Quiz;
