import React, { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaPlay, FaFileAlt } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useParams } from "react-router-dom";
import axiosInstance from "../../components/axiosInstance";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import YouTubePlayer from "./CustomYoutubePlayerPractice";
import Quiz from "./Quiz";
import ReactPlayer from "react-player";
import { ReactReader } from "react-reader";

const ContentView = () => {
  const { name } = useParams();
  const [chapters, setChapters] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseCompleted, setCourseCompleted] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseResponse = await axiosInstance.get("/courses/getAll");
        const courseData = courseResponse.data.find(
          (data) => data.course_name === name
        );

        if (!courseData) {
          toast.error("Course not found");
          setLoading(false);
          return;
        }

        // Fetch chapters with videos
        const chaptersResponse = await axiosInstance.post(
          "/chapters/getVideosByChapters",
          { idCourses: courseData.idCourses }
        );

        setChapters(chaptersResponse.data);
        setCourse(courseData);

        // Auto-expand first chapter if exists
        if (chaptersResponse.data.length > 0) {
          setExpandedChapter(chaptersResponse.data[0].idChapters);
          // Set first video as current if exists
          if (chaptersResponse.data[0].Videos?.length > 0) {
            setCurrentVideo(chaptersResponse.data[0].Videos[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load course content");
      }
      setLoading(false);
    };

    fetchCourse();
  }, [name]);

  const toggleChapter = (chapterId) => {
    setExpandedChapter((prev) => (prev === chapterId ? null : chapterId));
  };

  const handleVideoSelect = (video) => {
    if (!video?.video_url) {
      toast.warn("Video URL not found");
      return;
    }
    setCurrentVideo(video);
    setCourseCompleted(false);
  };

  const handleVideoNavigation = (direction) => {
    if (!currentVideo) return;

    // Find current chapter and video index
    let currentChapterIndex = -1;
    let currentVideoIndex = -1;

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const videoIndex = chapter.Videos?.findIndex(
        (v) => v.idVideos === currentVideo.idVideos
      );
      if (videoIndex !== -1) {
        currentChapterIndex = i;
        currentVideoIndex = videoIndex;
        break;
      }
    }

    if (currentChapterIndex === -1 || currentVideoIndex === -1) return;

    if (direction === "next") {
      // Try next video in same chapter
      if (
        chapters[currentChapterIndex].Videos?.length >
        currentVideoIndex + 1
      ) {
        setCurrentVideo(
          chapters[currentChapterIndex].Videos[currentVideoIndex + 1]
        );
        return;
      }

      // Try first video in next chapter
      if (chapters.length > currentChapterIndex + 1) {
        if (chapters[currentChapterIndex + 1].Videos?.length > 0) {
          setCurrentVideo(chapters[currentChapterIndex + 1].Videos[0]);
          setExpandedChapter(chapters[currentChapterIndex + 1].idChapters);
          return;
        }
      }

      // No more videos - course completed
      setCourseCompleted(true);
      setCurrentVideo(null);
    } else if (direction === "prev") {
      // Try previous video in same chapter
      if (currentVideoIndex > 0) {
        setCurrentVideo(
          chapters[currentChapterIndex].Videos[currentVideoIndex - 1]
        );
        return;
      }

      // Try last video in previous chapter
      if (currentChapterIndex > 0) {
        const prevChapter = chapters[currentChapterIndex - 1];
        if (prevChapter.Videos?.length > 0) {
          setCurrentVideo(prevChapter.Videos[prevChapter.Videos.length - 1]);
          setExpandedChapter(prevChapter.idChapters);
        }
      }
    }
  };

  const filteredChapters = chapters
    .map((chapter) => ({
      ...chapter,
      Videos: chapter.Videos?.filter((video) =>
        video.video_name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((chapter) => chapter.Videos?.length > 0 || searchTerm === "");

  if (loading) {
    return (
      <Sidebar>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="bg-gray-50 min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Video Player Section */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-black">
                  {currentVideo ? (
                    currentVideo.video_type === "mp4" ? (
                      <YouTubePlayer
                        videoId={currentVideo.vdo_cipher_video_id}
                        className="w-full h-full"
                      />
                    ) : currentVideo.video_type === "quiz" ? (
                      <div className="p-4">
                        <Quiz quiz={currentVideo} />
                      </div>
                    ) : currentVideo.video_type === "pdf" ? (
                      <div className="h-[600px]">
                        <ReactReader
                          url={currentVideo.video_url}
                          title={currentVideo.video_name}
                          showToc={true}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ReactPlayer
                          url={currentVideo.video_url}
                          controls={true}
                          width="100%"
                          height="100%"
                        />
                      </div>
                    )
                  ) : courseCompleted ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-blue-50 to-green-50">
                      <div className="text-6xl mb-4">🎉</div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Course Completed!
                      </h2>
                      <p className="text-gray-600">
                        Congratulations on finishing the course. Keep up the
                        great work!
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gradient-to-br from-blue-50 to-pink-50">
                      <div className="text-6xl mb-4">📚</div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Select a Lesson to Begin
                      </h2>
                      <p className="text-gray-600">
                        Choose a video from the sidebar to start learning.
                      </p>
                    </div>
                  )}
                </div>

                <div className="p-4 border-t">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {currentVideo?.video_name || "No video selected"}
                  </h3>
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => handleVideoNavigation("prev")}
                      disabled={!currentVideo}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        currentVideo
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FaArrowLeft />
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={() => handleVideoNavigation("next")}
                      disabled={courseCompleted}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                        !courseCompleted
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <span>
                        {courseCompleted ? "Course Completed" : "Next"}
                      </span>
                      <FaArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter List Section */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {course?.course_name || "Course Content"}
                  </h2>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoSearchOutline className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search lessons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div
                  className="overflow-y-auto"
                  style={{ maxHeight: "calc(100vh - 200px)" }}
                >
                  {filteredChapters.length > 0 ? (
                    filteredChapters.map((chapter) => (
                      <div key={chapter.idChapters} className="border-b">
                        <div
                          className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                          onClick={() => toggleChapter(chapter.idChapters)}
                        >
                          <h3 className="font-medium text-gray-800">
                            {chapter.name}
                          </h3>
                          {expandedChapter === chapter.idChapters ? (
                            <IoIosArrowUp className="text-gray-500" />
                          ) : (
                            <IoIosArrowDown className="text-gray-500" />
                          )}
                        </div>

                        {expandedChapter === chapter.idChapters && (
                          <div className="pb-2">
                            {chapter.Videos?.length > 0 ? (
                              chapter.Videos.map((video) => (
                                <div
                                  key={video.idVideos}
                                  className={`flex items-center px-4 py-3 mx-2 rounded-md cursor-pointer ${
                                    currentVideo?.idVideos === video.idVideos
                                      ? "bg-blue-100"
                                      : "hover:bg-gray-100"
                                  }`}
                                  onClick={() => handleVideoSelect(video)}
                                >
                                  <div className="flex-shrink-0 mr-3">
                                    {video.video_type === "mp4" ? (
                                      <FaPlay className="text-blue-500" />
                                    ) : (
                                      <FaFileAlt className="text-green-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                      {video.video_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {video.duration} min •{" "}
                                      {video.video_type.toUpperCase()}
                                    </p>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500">
                                No lessons available in this chapter.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No chapters found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Sidebar>
  );
};

export default ContentView;
