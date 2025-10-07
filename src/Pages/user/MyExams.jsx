import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaUpload,
  FaArrowLeft,
  FaArrowRight,
  FaImage,
  FaEye,
  FaExpand,
  FaFilePdf,
  FaLock,
  FaStar,
  FaDownload,
  FaComment,
  FaInfoCircle,
} from "react-icons/fa";
import axiosInstance from "../../components/axiosInstance";
import jsPDF from "jspdf";

const MyExams = () => {
  const [selectedExam, setSelectedExam] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState([]);
  const [questionData, setQuestionData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [convertingToPdf, setConvertingToPdf] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [filteredExams, setFilteredExams] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [examFeedback, setExamFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [allExamFeedback, setAllExamFeedback] = useState({});

  const useId = localStorage.getItem("userid");
  const userName = localStorage.getItem("username");

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/transaction/getTransactionByUserId?idUsers=${useId}`
      );
      const responseData = response.data;
      setEnrolledCourses(responseData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
    }
  };

  const fetchAllExam = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/exams/getAll`);
      const responseData = response.data;
      setExamData(responseData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exam data:", error);
    }
  };

  const fetchAllQuestion = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/examQuestions/getAll`);
      const responseData = response.data;
      setQuestionData(responseData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching exam data:", error);
    }
  };

  // Fetch exam feedback for ALL enrolled exams when component loads
  const fetchAllExamFeedback = async () => {
    if (!useId || filteredExams.length === 0) return;

    try {
      console.log("Fetching feedback for all enrolled exams...");
      const feedbackMap = {};

      // Fetch feedback for each enrolled exam
      for (const exam of filteredExams) {
        try {
          console.log(`Fetching feedback for exam ${exam.idExams}...`);
          const response = await axiosInstance.get(
            `/examFeedBacks/getFeedBacksByUserIDAndExamID?idExams=${exam.idExams}&idUsers=${useId}`
          );

          if (response.data && response.data.length > 0) {
            feedbackMap[exam.idExams] = response.data;
            console.log(
              `Found ${response.data.length} feedback entries for exam ${exam.idExams}`
            );
          } else {
            feedbackMap[exam.idExams] = [];
            console.log(`No feedback found for exam ${exam.idExams}`);
          }
        } catch (error) {
          console.error(
            `Error fetching feedback for exam ${exam.idExams}:`,
            error
          );
          feedbackMap[exam.idExams] = [];
        }
      }

      setAllExamFeedback(feedbackMap);
      console.log("All exam feedback loaded:", feedbackMap);
    } catch (error) {
      console.error("Error fetching all exam feedback:", error);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
    fetchAllExam();
    fetchAllQuestion();
  }, []);

  // Filter exams based on enrolled courses
  useEffect(() => {
    if (examData.length > 0 && enrolledCourses.length > 0) {
      const enrolledCourseIds = enrolledCourses.map(
        (course) => course.idCourses
      );
      const filtered = examData.filter((exam) =>
        enrolledCourseIds.includes(exam.idCourses)
      );
      setFilteredExams(filtered);
    } else {
      setFilteredExams([]);
    }
  }, [examData, enrolledCourses]);

  // Fetch feedback when filtered exams are loaded
  useEffect(() => {
    if (filteredExams.length > 0 && useId) {
      fetchAllExamFeedback();
    }
  }, [filteredExams, useId]);

  const getQuestionsForExam = (examId) => {
    return questionData.filter((question) => question.idExams === examId);
  };

  const getCourseName = (courseId) => {
    const course = enrolledCourses.find(
      (course) => course.idCourses === courseId
    );
    return course ? course.Course.course_name : "Unknown Course";
  };

  // Check if an exam has feedback
  const hasFeedback = (examId) => {
    return allExamFeedback[examId] && allExamFeedback[examId].length > 0;
  };

  // Get feedback count for an exam
  const getFeedbackCount = (examId) => {
    return allExamFeedback[examId] ? allExamFeedback[examId].length : 0;
  };

  // Get feedback for a specific exam
  const getFeedbackForExam = (examId) => {
    return allExamFeedback[examId] || [];
  };

  const handleExamClick = (exam) => {
    // Check if student is enrolled in the course
    const isEnrolled = enrolledCourses.some(
      (course) => course.idCourses === exam.idCourses
    );

    if (!isEnrolled) {
      alert(
        "You are not enrolled in this course. Please enroll to take the exam."
      );
      return;
    }

    setSelectedExam(exam);
    setCurrentQuestionIndex(0);
    setUploadedFiles([]);
    setSubmitted(false);
    setShowQuestionModal(true);
  };

  // Handle view feedback
  const handleViewFeedback = async (exam) => {
    setSelectedExam(exam);

    // Check if we already have feedback for this exam
    const existingFeedback = getFeedbackForExam(exam.idExams);

    if (existingFeedback.length > 0) {
      // Use cached feedback
      setExamFeedback(existingFeedback);
    } else {
      // Fetch fresh feedback
      setFeedbackLoading(true);
      try {
        console.log(`Fetching fresh feedback for exam ${exam.idExams}...`);
        const response = await axiosInstance.get(
          `/examFeedBacks/getFeedBacksByUserIDAndExamID?idExams=${exam.idExams}&idUsers=${useId}`
        );
        setExamFeedback(response.data);

        // Update the cache
        setAllExamFeedback((prev) => ({
          ...prev,
          [exam.idExams]: response.data,
        }));
      } catch (error) {
        console.error("Error fetching exam feedback:", error);
        setExamFeedback([]);
      } finally {
        setFeedbackLoading(false);
      }
    }

    setShowFeedbackModal(true);
  };

  const handleCloseModal = () => {
    setShowQuestionModal(false);
    setSelectedExam(null);
    setUploadedFiles([]);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setExamFeedback([]);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index, direction) => {
    const newFiles = [...uploadedFiles];
    if (direction === "up" && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [
        newFiles[index - 1],
        newFiles[index],
      ];
    } else if (direction === "down" && index < newFiles.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [
        newFiles[index + 1],
        newFiles[index],
      ];
    }
    setUploadedFiles(newFiles);
  };

  const handleImagePreview = (file, index) => {
    setSelectedImage({ file, index });
    setShowImageModal(true);
  };

  // Function to convert images to PDF
  const convertImagesToPDF = async (images) => {
    const pdf = new jsPDF();
    let imagesProcessed = 0;

    // Process each image sequentially
    for (let index = 0; index < images.length; index++) {
      try {
        const imageFile = images[index];

        // Convert image to base64 and add to PDF
        const imageDataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });

        // Add new page for all images except the first one
        if (index > 0) {
          pdf.addPage();
        }

        // Get image dimensions
        const img = new Image();
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve; // Continue even if image fails to load
          img.src = imageDataUrl;
        });

        if (img.complete && img.naturalWidth !== 0) {
          const imgWidth = img.width;
          const imgHeight = img.height;

          // PDF page dimensions
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          // Calculate aspect ratio
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const width = imgWidth * ratio;
          const height = imgHeight * ratio;

          // Center the image
          const x = (pdfWidth - width) / 2;
          const y = (pdfHeight - height) / 2;

          pdf.addImage(imageDataUrl, "JPEG", x, y, width, height);
        }

        imagesProcessed++;
      } catch (error) {
        console.error(`Error processing image ${index}:`, error);
        // Continue with next image even if current one fails
        if (index > 0) {
          pdf.addPage();
        }
        pdf.text(`Error loading image ${index + 1}`, 20, 20);
      }
    }

    if (imagesProcessed === 0) {
      throw new Error("No images were successfully processed");
    }

    const pdfBlob = pdf.output("blob");
    return new File(
      [pdfBlob],
      `exam_answers_${selectedExam.idExams}_${Date.now()}.pdf`,
      { type: "application/pdf" }
    );
  };

  // Download feedback PDF
  const downloadFeedbackPDF = (feedback) => {
    if (feedback.AnswerImage?.answer_url) {
      const link = document.createElement("a");
      link.href = feedback.AnswerImage.answer_url;
      link.download = `feedback_${feedback.idExamFeedBacks}.pdf`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // View feedback PDF in new tab
  const viewFeedbackPDF = (feedback) => {
    if (feedback.AnswerImage?.answer_url) {
      window.open(feedback.AnswerImage.answer_url, "_blank");
    }
  };

  const handleSubmitExam = async () => {
    try {
      setConvertingToPdf(true);

      console.log(
        "Starting PDF conversion with",
        uploadedFiles.length,
        "images"
      );

      // Convert images to PDF
      const pdfFile = await convertImagesToPDF(uploadedFiles);

      console.log("PDF created successfully:", pdfFile);
      console.log("PDF size:", pdfFile.size, "bytes");

      setConvertingToPdf(false);
      setLoading(true);

      const formData = new FormData();

      formData.append("answerImages", pdfFile);
      formData.append("fileName", `${userName}_${selectedExam.examName}`);
      formData.append("idUsers", useId);
      formData.append("idExams", parseInt(selectedExam.idExams));
      formData.append("submittedAt", new Date().toISOString());

      const response = await axiosInstance.post(
        "/examSubmissions/postExamSubmissionsFromAnyPage",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setSubmitted(true);
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
      alert("Error submitting exam. Please try again.");
    } finally {
      setLoading(false);
      setConvertingToPdf(false);
    }
  };

  const currentQuestions = selectedExam
    ? getQuestionsForExam(selectedExam.idExams)
    : [];
  const currentQuestion = currentQuestions[currentQuestionIndex];

  return (
    <Sidebar>
      <div className="p-2 rounded-lg shadow-md bg-white m-2">
        <h1 className="text-2xl md:text-4xl text-lmsfontend-forth_color font-bold my-4 text-center border-b pb-4">
          My Course Exams
        </h1>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* No enrolled courses message */}
        {enrolledCourses.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-md mx-auto">
              <FaLock className="text-yellow-500 text-4xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                No Enrolled Courses
              </h3>
              <p className="text-yellow-600">
                You need to enroll in courses first to access exams.
              </p>
            </div>
          </div>
        )}

        {/* No exams available message */}
        {enrolledCourses.length > 0 &&
          filteredExams.length === 0 &&
          !loading && (
            <div className="text-center py-12">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 max-w-md mx-auto">
                <FaFilePdf className="text-blue-500 text-4xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-800 mb-2">
                  No Exams Available
                </h3>
                <p className="text-blue-600">
                  There are no exams available for your enrolled courses yet.
                </p>
              </div>
            </div>
          )}

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {filteredExams.map((exam) => {
            const isEnrolled = enrolledCourses.some(
              (course) => course.idCourses === exam.idCourses
            );
            const hasExamFeedback = hasFeedback(exam.idExams);
            const feedbackCount = getFeedbackCount(exam.idExams);

            return (
              <div
                key={exam.idExams}
                className={`rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border ${
                  isEnrolled
                    ? hasExamFeedback
                      ? "bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
                      : "bg-gradient-to-br from-blue-50 to-indigo-100 border-gray-200"
                    : "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 opacity-75"
                }`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                      {exam.examName}
                    </h3>
                    <div className="flex flex-col items-end space-y-1">
                      <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        {getQuestionsForExam(exam.idExams).length} Qs
                      </span>
                      {hasExamFeedback && (
                        <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                          <FaStar className="mr-1" size={8} />
                          {feedbackCount} Feedback
                        </span>
                      )}
                      {!isEnrolled && (
                        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center">
                          <FaLock className="mr-1" size={8} />
                          Locked
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {getCourseName(exam.idCourses)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {exam.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-semibold">
                        {exam.duration} mins
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available From:</span>
                      <span className="font-semibold">
                        {exam.available_from}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                    <button
                      onClick={() => handleExamClick(exam)}
                      className={`flex-1 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ${
                        isEnrolled
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                      disabled={!isEnrolled}
                    >
                      {isEnrolled ? "Start Exam" : "Not Enrolled"}
                    </button>

                    {hasExamFeedback && (
                      <button
                        onClick={() => handleViewFeedback(exam)}
                        className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                        title="View Feedback"
                      >
                        <FaComment size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All available exams (for reference) */}
        {enrolledCourses.length > 0 && examData.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              All Available Exams ({examData.length})
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              {examData.map((exam) => {
                const isEnrolled = enrolledCourses.some(
                  (course) => course.idCourses === exam.idCourses
                );
                const hasExamFeedback = hasFeedback(exam.idExams);

                return (
                  <div
                    key={exam.idExams}
                    className="flex justify-between items-center py-2 border-b border-gray-200"
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={
                          isEnrolled
                            ? "text-green-600 font-medium"
                            : "text-gray-500"
                        }
                      >
                        {exam.examName} - {getCourseName(exam.idCourses)}
                      </span>
                      {hasExamFeedback && (
                        <FaStar className="text-green-500 text-sm" />
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          isEnrolled
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isEnrolled ? "Enrolled" : "Not Enrolled"}
                      </span>
                      {hasExamFeedback && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Has Feedback
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Question Modal */}
        {showQuestionModal && selectedExam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl min-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedExam.examName}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Course: {getCourseName(selectedExam.idCourses)}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                <p className="text-blue-100 mt-2">{selectedExam.description}</p>
              </div>

              <div className="flex flex-col h-[calc(90vh-20px)]">
                {/* Question Section */}
                <div className="flex-1 p-6 overflow-y-auto border-b">
                  {currentQuestion && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Question {currentQuestionIndex + 1} of{" "}
                          {currentQuestions.length}
                        </span>
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Marks: {currentQuestion.mark}
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        {currentQuestion.questions}
                      </h3>

                      {currentQuestion.topic && (
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                          <strong>Topic:</strong> {currentQuestion.topic}
                        </p>
                      )}

                      {currentQuestion.text && (
                        <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                          {currentQuestion.text}
                        </p>
                      )}

                      {currentQuestion.attatchment &&
                        currentQuestion.attatchment.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-gray-700 mb-2">
                              Attachments:
                            </h4>
                            <div className="space-y-2">
                              {currentQuestion.attatchment.map(
                                (attachment, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-2 text-blue-600"
                                  >
                                    <FaImage />
                                    <span className="text-sm">
                                      {attachment.url || attachment}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {/* Navigation */}
                  {currentQuestions.length > 1 && (
                    <div className="flex justify-between mt-6 pt-4 border-t">
                      <button
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.max(0, prev - 1)
                          )
                        }
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <FaArrowLeft />
                        <span>Previous</span>
                      </button>

                      <button
                        onClick={() =>
                          setCurrentQuestionIndex((prev) =>
                            Math.min(currentQuestions.length - 1, prev + 1)
                          )
                        }
                        disabled={
                          currentQuestionIndex === currentQuestions.length - 1
                        }
                        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        <span>Next</span>
                        <FaArrowRight />
                      </button>
                    </div>
                  )}
                </div>

                {/* Answer Submission Section */}
                <div className="p-6 bg-gray-50 border-t">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Submit Your Answer
                  </h3>

                  {/* PDF Conversion Info */}
                  <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 text-blue-700">
                      <FaFilePdf className="text-lg" />
                      <span className="font-semibold">PDF Conversion</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-1">
                      All uploaded images will be automatically converted to a
                      single PDF file before submission.
                    </p>
                  </div>

                  {/* File Upload Area */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Answer Images
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <FaUpload className="text-gray-400 text-2xl" />
                        <span className="text-sm text-gray-600">
                          Click to upload images or drag and drop
                        </span>
                        <span className="text-xs text-gray-500">
                          PNG, JPG, GIF - Will be converted to PDF
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Uploaded Files List with Preview */}
                  {uploadedFiles.length > 0 && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-700">
                          Uploaded Images ({uploadedFiles.length})
                        </h4>
                        <span className="text-sm text-gray-500 bg-yellow-100 px-2 py-1 rounded">
                          Will be converted to {uploadedFiles.length}-page PDF
                        </span>
                      </div>
                      <div className="space-y-4">
                        {uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm border p-4"
                          >
                            <div className="flex items-start justify-between">
                              {/* File Info and Controls */}
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-3">
                                  <FaImage className="text-blue-500 flex-shrink-0" />
                                  <span className="text-sm text-gray-700 truncate flex-1">
                                    {file.name}
                                  </span>
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Page: {index + 1}
                                  </span>
                                </div>

                                {/* Image Preview Thumbnail */}
                                <div className="flex items-center space-x-4">
                                  <div
                                    className="relative group cursor-pointer"
                                    onClick={() =>
                                      handleImagePreview(file, index)
                                    }
                                  >
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Preview ${index + 1}`}
                                      className="w-20 h-20 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-200"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                                      <FaExpand className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    </div>
                                  </div>

                                  {/* Controls */}
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() =>
                                        handleImagePreview(file, index)
                                      }
                                      className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                                    >
                                      <FaEye className="text-xs" />
                                      <span>Preview</span>
                                    </button>

                                    <button
                                      onClick={() => moveFile(index, "up")}
                                      disabled={index === 0}
                                      className="p-2 text-gray-500 hover:text-blue-500 disabled:text-gray-300 transition-colors duration-200 disabled:cursor-not-allowed"
                                      title="Move up"
                                    >
                                      <FaArrowLeft />
                                    </button>
                                    <button
                                      onClick={() => moveFile(index, "down")}
                                      disabled={
                                        index === uploadedFiles.length - 1
                                      }
                                      className="p-2 text-gray-500 hover:text-blue-500 disabled:text-gray-300 transition-colors duration-200 disabled:cursor-not-allowed"
                                      title="Move down"
                                    >
                                      <FaArrowRight />
                                    </button>
                                    <button
                                      onClick={() => removeFile(index)}
                                      className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                                      title="Remove"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {uploadedFiles.length > 0 && (
                        <p>
                          Total images: {uploadedFiles.length} (will be
                          converted to PDF)
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleSubmitExam}
                      disabled={
                        loading || convertingToPdf || uploadedFiles.length === 0
                      }
                      className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                    >
                      {convertingToPdf ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Creating PDF...</span>
                        </>
                      ) : loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <FaFilePdf />
                          <span>Submit as PDF</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedExam && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Exam Feedback - {selectedExam.examName}
                    </h2>
                    <p className="text-green-100 text-sm mt-1">
                      Course: {getCourseName(selectedExam.idCourses)}
                    </p>
                    <p className="text-green-100 text-sm">
                      Total Feedback: {examFeedback.length}
                    </p>
                  </div>
                  <button
                    onClick={handleCloseFeedbackModal}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {feedbackLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  </div>
                ) : examFeedback.length === 0 ? (
                  <div className="text-center py-12">
                    <FaInfoCircle className="text-gray-400 text-4xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No Feedback Available
                    </h3>
                    <p className="text-gray-500">
                      No feedback has been provided for this exam yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {examFeedback.map((feedback, index) => (
                      <div
                        key={feedback.idExamFeedBacks}
                        className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Feedback #{index + 1}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                              ID: {feedback.idExamFeedBacks}
                            </span>
                            {feedback.created_at && (
                              <span className="text-xs text-gray-500">
                                {new Date(
                                  feedback.created_at
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Feedback Text */}
                        {feedback.feedbackText && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                              <FaComment className="mr-2 text-blue-500" />
                              Comments
                            </h4>
                            <div className="bg-white rounded-lg p-4 border border-gray-200">
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {feedback.feedbackText}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* PDF Feedback */}
                        {feedback.AnswerImage?.answer_url && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                              <FaFilePdf className="mr-2 text-red-500" />
                              Feedback Document
                            </h4>
                            <div className="flex space-x-3">
                              <button
                                onClick={() => viewFeedbackPDF(feedback)}
                                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                              >
                                <FaEye />
                                <span>View PDF</span>
                              </button>
                              <button
                                onClick={() => downloadFeedbackPDF(feedback)}
                                className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                              >
                                <FaDownload />
                                <span>Download PDF</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Submission Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Feedback ID:</span>{" "}
                            {feedback.idExamFeedBacks}
                          </div>
                          <div>
                            <span className="font-medium">Submission ID:</span>{" "}
                            {feedback.idExamSubmissions || "N/A"}
                          </div>
                          <div>
                            <span className="font-medium">
                              Answer Image ID:
                            </span>{" "}
                            {feedback.idAnswerImages}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span>{" "}
                            {feedback.created_at
                              ? new Date(feedback.created_at).toLocaleString()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Showing {examFeedback.length} feedback entries for{" "}
                    {selectedExam.examName}
                  </p>
                  <button
                    onClick={handleCloseFeedbackModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Image Preview Modal */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-[60]">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <FaTimes size={28} />
              </button>

              <div className="bg-white rounded-lg overflow-hidden">
                <img
                  src={URL.createObjectURL(selectedImage.file)}
                  alt={`Preview ${selectedImage.index + 1}`}
                  className="max-w-full max-h-[80vh] object-contain"
                />
                <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
                  <span className="text-sm">
                    {selectedImage.file.name} (Page: {selectedImage.index + 1})
                  </span>
                  <span className="text-sm">
                    Size: {(selectedImage.file.size / 1024 / 1024).toFixed(2)}{" "}
                    MB
                  </span>
                </div>
              </div>

              {/* Navigation between images */}
              {uploadedFiles.length > 1 && (
                <div className="flex justify-center space-x-4 mt-4">
                  <button
                    onClick={() => {
                      const prevIndex =
                        selectedImage.index > 0
                          ? selectedImage.index - 1
                          : uploadedFiles.length - 1;
                      setSelectedImage({
                        file: uploadedFiles[prevIndex],
                        index: prevIndex,
                      });
                    }}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
                  >
                    <FaArrowLeft size={20} />
                  </button>

                  <span className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg">
                    {selectedImage.index + 1} / {uploadedFiles.length}
                  </span>

                  <button
                    onClick={() => {
                      const nextIndex =
                        selectedImage.index < uploadedFiles.length - 1
                          ? selectedImage.index + 1
                          : 0;
                      setSelectedImage({
                        file: uploadedFiles[nextIndex],
                        index: nextIndex,
                      });
                    }}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200"
                  >
                    <FaArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Message */}
        {submitted && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-sm">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Success!
              </h3>
              <p className="text-gray-600 mb-6">
                Your exam has been submitted successfully as PDF.
              </p>
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default MyExams;
