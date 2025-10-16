import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../components/axiosInstance";

const Exams = () => {
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const navigate = useNavigate();

  const fetchAllExam = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/exams/getAll`);
      const responseData = response.data;
      setExamData(responseData);

      const filtered = responseData.filter(
        (exam) =>
          exam.Courses && exam.Courses.some((course) => course.idCourses === 66)
      );
      setFilteredExams(filtered);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching exam data:", error);
      setLoading(false);
    }
  };

  const handleCardClick = (exam) => {
    localStorage.setItem("idExams", exam.idExams);
    navigate(`/exam-details/${exam.Courses[0].course_name}`);
  };

  useEffect(() => {
    fetchAllExam();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl font-semibold text-gray-600">
            Loading exams...
          </div>
        </div>
      </div>
    );
  }
  console.log("filteredExams", filteredExams);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Available Exams
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select an exam to view detailed information and start your
            assessment
          </p>
        </div>

        {filteredExams.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <div className="text-gray-500 text-xl mb-2">No exams available</div>
            <div className="text-gray-400">No exams found for this course</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredExams.map((exam) => (
              <div
                key={exam.idExams}
                onClick={() => handleCardClick(exam)}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold truncate max-w-[150px]">
                            {exam.examName}
                          </h3>
                          <p className="text-blue-100 text-sm opacity-90">
                            Exam ID: {exam.idExams}
                          </p>
                        </div>
                      </div>
                      <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                        <svg
                          className="w-5 h-5 text-white opacity-80"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {exam.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-600">
                        <svg
                          className="w-4 h-4 mr-3 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">
                          <strong>Starts:</strong>{" "}
                          {new Date(exam.available_from).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <svg
                          className="w-4 h-4 mr-3 text-orange-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm">
                          <strong>Duration:</strong> {exam.duration} mins
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <svg
                          className="w-4 h-4 mr-3 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <span className="text-sm">
                          <strong>Time Limit:</strong>
                          <span
                            className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                              exam.time_limit
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {exam.time_limit ? "Enabled" : "Disabled"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                        <span>View Details</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;
