import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { HiDocumentText, HiOutlinePlay } from "react-icons/hi";
import { useParams } from "react-router-dom";
import axiosInstance from "../../components/axiosInstance";
import Sidebar from "../../components/Sidebar";
import { toast } from "react-toastify";
import { ReactReader } from "react-reader";
import YouTubePlayer from "./CustomYoutubePlayerPractice";
import Quiz from "./Quiz";

const ContentView = () => {
  const { name } = useParams();
  const [videoData, setVideoData] = useState([]);
  const [Course, setCourse] = useState(null);
  const [feedBackData, setFeedBack] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Previewid, setPreviewId] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [hasSingleChapter, setHasSingleChapter] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/courses/getAll");
        const filter = response.data.find((data) => data.course_name === name);

        if (!filter) {
          console.warn("No course found for name:", name);
          setLoading(false);
          return;
        }

        const videoResponse = await axiosInstance.get(
          `/videos/getVideosByChapters?idChapters=${filter.idCourses}`
        );

        // Group videos by chapters
        const chaptersMap = {};
        videoResponse.data.forEach((video) => {
          if (!chaptersMap[video.idChapters]) {
            chaptersMap[video.idChapters] = {
              id: video.idChapters,
              name: video.chapter_name || `Chapter ${video.idChapters}`,
              videos: [],
            };
          }
          chaptersMap[video.idChapters].videos.push(video);
        });

        const chaptersArray = Object.values(chaptersMap);
        setChapters(chaptersArray);
        setHasSingleChapter(chaptersArray.length === 1);

        // If single chapter, set Previewid to that chapter's ID
        if (chaptersArray.length === 1) {
          setPreviewId(chaptersArray[0].id);
        }

        setVideoData(videoResponse.data);
        setCourse(filter);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
      setLoading(false);
    };

    const fetchFeedback = async () => {
      try {
        const response = await axiosInstance.get("/feedbacks/getAll");
        setFeedBack(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchCourse();
    fetchFeedback();
  }, [name]);

  const handlePreviewReply = (id) => {
    if (Previewid === id) {
      setPreviewId(null);
    } else {
      setPreviewId(id);
    }
  };

  const handleOpenVideo = (video) => {
    if (!video?.video_url) {
      toast.warn("Video URL not found. Skipping this video.");
      return;
    }
    const videoIndex = videoData.findIndex(
      (v) => v.idVideos === video.idVideos
    );
    setCurrentVideoIndex(videoIndex === -1 ? 0 : videoIndex);
  };

  const handleVideoChange = (direction) => {
    if (direction === "next") {
      if (currentVideoIndex === videoData.length - 1) {
        setCourseCompleted(true);
        setCurrentVideoIndex(null);
        return;
      }
      setCurrentVideoIndex((prevIndex) =>
        Math.min(prevIndex + 1, videoData.length - 1)
      );
    } else if (direction === "prev") {
      if (currentVideoIndex === 0) return;
      setCurrentVideoIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }
  };

  const currentVideo = videoData[currentVideoIndex] || null;

  const filteredVideos = videoData.filter((data) =>
    data?.video_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Sidebar>
      <div>
        <main className="lg:min-h-[calc(100vh_-_347px)] relative">
          <section className="bg-0">
            <div className="md:px-4">
              <section className="grid grid-cols-3 gap-8 lg:gap-8 ">
                {/* Video Player Section */}
                <div className="col-span-full w-full space-y-8 lg:col-span-2">
                  <div className="z-10 flex aspect-video w-full flex-col justify-center gap-y-4">
                    <div className="relative mb-5 h-full">
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="aspect-video w-full">
                          <div style={{ width: "100%", height: "100%" }}>
                            {currentVideo ? (
                              currentVideo.video_type === "mp4" ? (
                                <YouTubePlayer
                                  videoId={currentVideo.vdo_cipher_video_id}
                                />
                              ) : currentVideo.video_type === "quiz" ? (
                                <div className="relative">
                                  <Quiz quiz={currentVideo} />
                                </div>
                              ) : (
                                <ReactReader
                                  url={currentVideo?.video_url}
                                  title="PDF Reader"
                                  showToc={true}
                                  styles={{
                                    readerArea: { height: "760px" },
                                  }}
                                />
                              )
                            ) : courseCompleted ? (
                              <div className="text-center p-5">
                                <h2 className="text-xl font-bold">
                                  🎉 Thank you for completing the course! 🎉
                                </h2>
                                <p className="text-gray-600">
                                  We hope you enjoyed the journey. Keep
                                  learning!
                                </p>
                              </div>
                            ) : (
                              <div className="text-center font-bold text-3xl text-red-500">
                                Sorry there is no video yet. Until next time 😭
                                😭 😭
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-xl md:mt-44 lg:mt-0">
                      {currentVideo?.video_name}
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleVideoChange("prev")}
                        className="bg-coching-button_color flex text-[12px] items-center justify-center gap-2 p-[10px] rounded-[32px]"
                      >
                        <FaArrowLeft color="white" />
                        <span className="text-white">Prev Lesson</span>
                      </button>
                      <button
                        onClick={() => handleVideoChange("next")}
                        className="bg-coching-button_color text-[12px] flex items-center justify-center gap-2 p-[10px] rounded-[32px]"
                        disabled={courseCompleted}
                      >
                        <span className="text-white">
                          {courseCompleted ? "Course Completed" : "Next Lesson"}
                        </span>
                        <FaArrowRight color="white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video List Section */}
                <div className="bg-[#F8FAFC] border-gray-50 border-light-1 shadow-1 col-span-full h-max rounded-md border pb-1 lg:col-span-1 lg:rounded-lg">
                  <div className="rounded-t-md p-3 dark:bg-slate-900 lg:rounded-t-lg">
                    <div className="flex items-center justify-center">
                      <div className="w-full">
                        <div className="bg-[#F8FAFC] border rounded-md p-1 text-black flex items-center pl-2">
                          <IoSearchOutline color="black" size={20} />
                          <input
                            type="text"
                            className="bg-[#F8FAFC] text-black"
                            placeholder="search content"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flow-root px-4 py-2 bg-white border-t">
                    <div className="mantine-ScrollArea-root h-max lg:h-[calc(100vh_-_250px)]">
                      {hasSingleChapter
                        ? // Show all videos directly when there's only one chapter
                          chapters[0]?.videos.map((video) => (
                            <div
                              key={video.idVideos}
                              className="lg:w-full border-b"
                            >
                              <div className="text-[#504f4f] flex items-start gap-2 lg:gap-4 p-2 cursor-pointer hover:bg-slate-100">
                                <div>
                                  {video.video_type === "mp4" ? (
                                    <HiOutlinePlay
                                      color="rgb(2 132 199)"
                                      size={27}
                                    />
                                  ) : (
                                    <HiDocumentText
                                      color="rgb(2 132 199)"
                                      size={27}
                                    />
                                  )}
                                </div>
                                <div className="lg:w-10/12 w-full">
                                  {video.video_type === "mp4" ? (
                                    <button
                                      className="text-[14px] lg:text-[14px] text-left"
                                      onClick={() => handleOpenVideo(video)}
                                    >
                                      {video.video_name}
                                    </button>
                                  ) : (
                                    <a
                                      href={video.video_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[14px] lg:text-[14px] underline text-blue-500"
                                    >
                                      {video.video_name} (Download / View)
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        : // Show chapters with expandable videos when multiple chapters exist
                          chapters.map((chapter) => (
                            <div
                              key={chapter.id}
                              className="lg:w-full border-b"
                            >
                              <div
                                className="text-[#504f4f] flex transition pt-3 hover:bg-[#31972a] hover:text-white lg:pt-4 lg:pl-2 pr-3 pb-4 justify-start cursor-pointer gap-5"
                                onClick={() => handlePreviewReply(chapter.id)}
                              >
                                <div className="lg:ml-0 ml-2 text-[#94A3bb]">
                                  {Previewid === chapter.id ? (
                                    <IoIosArrowUp size={18} />
                                  ) : (
                                    <IoIosArrowDown size={18} />
                                  )}
                                </div>
                                <div className="flex flex-col items-start">
                                  <div>
                                    <h3 className="text-xs lg:text-sm">
                                      {chapter.name}
                                    </h3>
                                  </div>
                                </div>
                              </div>
                              {Previewid === chapter.id && (
                                <div className="text-slate-400">
                                  <ul className="p-1">
                                    {chapter.videos.map((video) => (
                                      <li
                                        key={video.idVideos}
                                        className="text-[#504f4f] flex items-start gap-2 lg:gap-4 p-2 pl-7 cursor-pointer px-2 py-2 hover:bg-slate-100"
                                      >
                                        <div>
                                          {video.video_type === "mp4" ? (
                                            <HiOutlinePlay
                                              color="rgb(2 132 199)"
                                              size={27}
                                            />
                                          ) : (
                                            <HiDocumentText
                                              color="rgb(2 132 199)"
                                              size={27}
                                            />
                                          )}
                                        </div>
                                        <div className="lg:w-10/12 w-full">
                                          {video.video_type === "mp4" ? (
                                            <button
                                              className="text-[14px] lg:text-[14px]"
                                              onClick={() =>
                                                handleOpenVideo(video)
                                              }
                                            >
                                              {video.video_name}
                                            </button>
                                          ) : (
                                            <a
                                              href={video.video_url}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-[14px] lg:text-[14px] underline text-blue-500"
                                            >
                                              {video.video_name} (Download /
                                              View)
                                            </a>
                                          )}
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </main>
      </div>
    </Sidebar>
  );
};

export default ContentView;
