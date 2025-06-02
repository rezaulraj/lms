import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { FaCheck, FaTimes, FaTrash, FaUpload } from "react-icons/fa";

const exam = [
  {
    courseId: 1,
    title: "IELTS for Beginner",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Nerob_IELTS_Vocabulary_with_Synonyms_-Md_Nerob_Hossain-96050-400528.jpg",
    mark: "50",
    examTime: "1.5h",
    questions: [
      {
        id: 1,
        text: "What are the key differences between IELTS Academic and General Training?",
      },
      {
        id: 2,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 3,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 4,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 5,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 6,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
    ],
  },
  {
    courseId: 1,
    title: "Spoken English Magic",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Englishe_durbolder_jonno_English_Therapy-Saiful_Islam-4695a-215765.jpg",
    mark: "70",
    examTime: "2h",
    questions: [
      {
        id: 1,
        text: "What are the key differences between IELTS Academic and General Training?",
      },
      {
        id: 2,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 3,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 4,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 5,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 6,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
    ],
  },
  {
    courseId: 2,
    title: "Basic Grammar",
    img: "https://ds.rokomari.store/rokomari110/ProductNew20190903/260X372/Nerob_IELTS_Vocabulary_with_Synonyms_-Md_Nerob_Hossain-96050-400528.jpg",
    mark: "100",
    examTime: "2h",
    questions: [
      {
        id: 1,
        text: "What are the key differences between IELTS Academic and General Training?",
      },
      {
        id: 2,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 3,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 4,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 5,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
      {
        id: 6,
        text: "Describe three strategies for improving your IELTS writing score.",
      },
    ],
  },
];
const MyExams = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleExamOpen = (exam) => {
    setSelectedExam({ ...exam });
    setUploadedFiles([]);
    setSubmitted(false);
  };

  const handleCloseExam = () => {
    setSelectedExam(null);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const handleSubmit = () => {
    // Here you would typically send the files to your backend
    console.log("Submitted files:", uploadedFiles);
    setSubmitted(true);
  };

  return (
    <Sidebar>
      <div className="p-2 rounded-lg shadow-md bg-white m-2">
        <h1 className="text-2xl md:text-4xl text-lmsfontend-forth_color font-bold my-4 text-center border-b ">
          Couese Exam
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {exam.map((exam, ind) => (
            <div
              key={ind}
              className="rounded-md hover:shadow-xl transition-transform duration-300"
            >
              <div className="flex items-center justify-center">
                <img
                  src={exam.img}
                  alt="exam"
                  className="h-52 object-contain"
                />
              </div>
              <div className="mt-3 text-center mb-2">
                <h2 className="text-xl font-semibold">{exam.title}</h2>
                <h3 className="text-sm font-bold">
                  Mark of exam:{" "}
                  <span className="text-red-500">{exam.mark}</span>
                </h3>
                <h4 className="text-sm font-bold">
                  Complication Time:{" "}
                  <span className="text-red-500">{exam.examTime}</span>
                </h4>
                <button
                  onClick={() => handleExamOpen(exam)}
                  className="w-10/12 h-10 bg-coching-nav_color/90 text-white rounded-md"
                >
                  Enter Exam
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className=" mt-10">
          <h1 className="text-2xl md:text-4xl text-lmsfontend-forth_color font-bold my-4 text-center border-b border-t">
            Exam Feedback
          </h1>   
        </div>
        {selectedExam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded-lg shadow-lg relative max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-xl">{selectedExam.title}</h2>
                <FaTimes
                  onClick={handleCloseExam}
                  className="cursor-pointer text-2xl text-red-600 hover:scale-110 transition"
                />
              </div>

              {!submitted ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      Exam Questions:
                    </h3>
                    <div className="space-y-6">
                      {selectedExam.questions.map((question, index) => (
                        <div key={question.id} className="border-b pb-4">
                          <div className="flex items-start">
                            <span className="font-medium mr-2">
                              {index + 1}.
                            </span>
                            <p className="text-gray-800">{question.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 font-medium">
                      Upload your answer files (PDF, DOC, JPG, PNG):
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                        <FaUpload className="mr-2" />
                        Choose Files
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </label>
                      <span className="text-sm text-gray-500">
                        Max 5 files (10MB each)
                      </span>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Files to submit:</h4>
                        <ul className="space-y-2">
                          {uploadedFiles.map((file, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between p-2 bg-gray-100 rounded"
                            >
                              <span className="truncate max-w-xs">
                                {file.name}
                              </span>
                              <button
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={uploadedFiles.length === 0}
                      className={`px-4 py-2 rounded-lg flex items-center ${
                        uploadedFiles.length === 0
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      <FaCheck className="mr-2" />
                      Submit Exam
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-green-500 text-5xl mb-4">
                    <FaCheck className="inline-block" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">
                    Exam Submitted Successfully!
                  </h3>
                  <p className="mb-6">
                    Thank you for completing the exam. Your files have been
                    received.
                  </p>
                  <button
                    onClick={handleCloseExam}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default MyExams;
