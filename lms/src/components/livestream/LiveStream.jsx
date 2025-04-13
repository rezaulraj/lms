import React, { useCallback, useEffect, useRef, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { FiMic, FiMicOff } from "react-icons/fi";
import { SlScreenDesktop } from "react-icons/sl";
import { MdCallEnd, MdOutlineChat } from "react-icons/md";
import { IoPeople } from "react-icons/io5";
import { GrStatusGoodSmall } from "react-icons/gr";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { IoVideocam } from "react-icons/io5";
import { IoVideocamOff } from "react-icons/io5";
import FaceDetection from "../FaceDetaction";
import AlertModal from "../AlertModal";
import notificationSound from "../../../public/notification/join_call.mp3";
import NotificationModal from "./NotificationModal";
import ScreenRecordingOverlay from "./ScreenRecordingOverlay ";
import MuxPlayer from "@mux/mux-player-react";
const appId = "2450467a64c845fd97d9e60e6e06804a";
const token = null;
const socket = io(import.meta.env.VITE_SOCKET_IO_URL);
const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isPortrait;
};

const LiveStream = () => {
  const videoRef = useRef(null);
  const fullscreenRef = useRef(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [screenShareTrack, setScreenShareTrack] = useState(null);
  const [clientJoined, setClientJoined] = useState(false); // Track join status
  const [error, setError] = useState("");
  const [AlertVisible, setAlertVisible] = useState(false);
  const [navigateUrl, setNavigateUrl] = useState("");
  const [visible, setVisible] = useState(false);

  const client = useRef(
    AgoraRTC.createClient({ mode: "live", codec: "vp8" })
  ).current;
  const hangupButton = useRef(null);
  const muteAudButton = useRef(null);
  const { roomId } = useParams();
  const uservideoRef = useRef(null);
  const chatMessages = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [screenShare, setScreenShare] = useState(false);
  const [audiostate, setAudio] = useState(true);
  const [participantVisible, setParticipantVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("username");
  const userName = userId ? userId : "guest";
  const role = localStorage.getItem("role") || "user";
  const [videoState, setVideoSata] = useState(true);
  const [notificationQueue, setNotificationQueue] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);
  useEffect(() => {
    const initAgora = async () => {
      try {
        console.log("Initializing Agora...");

        // Set up event handlers
        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);

        console.log("Joining channel...");
        await client.join(appId, roomId, token);

        setClientJoined(true);

        const role = localStorage.getItem("role");

        await client.setClientRole(role === "admin" ? "host" : "audience");
        if (!screenShare) {
          if (role === "admin") {
            const [microphoneTrack, cameraTrack] =
              await AgoraRTC.createMicrophoneAndCameraTracks();
            setLocalTracks([microphoneTrack, cameraTrack]);

            if (videoRef.current) {
              cameraTrack.play(videoRef.current);
              console.log("Playing local camera track...");
            }
          }
        }
      } catch (error) {
        console.error("Failed to initialize Agora:", error);
      }
    };

    initAgora();

    return () => {
      console.log("Cleaning up...");
      localTracks.forEach((track) => track.stop() && track.close());
      screenShareTrack && screenShareTrack.stop() && screenShareTrack.close();
      client
        .leave()
        .catch((error) => console.error("Error leaving channel:", error));
    };
  }, [client, roomId]);

  useEffect(() => {
    const playNotificationSound = () => {
      const audio = new Audio(notificationSound);
      audio.play();
    };

    socket.emit("join room", { userName, roomId, role });

    socket.on("chat message", ({ userName, message }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: userName, message: message },
      ]);
    });

    socket.on("participant joined", (id) => {
      setParticipants(id);
    });

    socket.on("notify admin", ({ newParticipant }) => {
      setNotificationQueue((prevQueue) => [...prevQueue, newParticipant]);
      playNotificationSound(); // Play notification sound based on role
      setVisible(true);
    });

    socket.on("participant left", (id) => {
      setParticipants(id);
    });

    socket.on("adminLeft", (roomID) => {
      console.log("adminLeft", roomID);

      if (role != "admin" && roomID === roomId) {
        alert("The admin has left the live stream.");
        window.location.href = "/";
      }
    });

    return () => {
      socket.off("chat message");
      socket.off("participant joined");
      socket.off("participant left");
      socket.off("adminLeft");
      socket.off("notify admin");
    };
  }, [role, roomId, userName]);

  useEffect(() => {
    if (localTracks.length > 0) {
      publishStream();
    }
  }, [localTracks]);

  const publishStream = async () => {
    if (client.connectionState === "CONNECTED") {
      try {
        console.log("Publishing tracks...", localTracks);
        applyTransformations();
        await client.publish(localTracks);
        muteAudio();
        console.log("Tracks published successfully");
      } catch (error) {
        console.error("Error publishing tracks:", error);
      }
    } else {
      console.error("Cannot publish stream, client has not joined yet.");
    }
  };
  const applyTransformations = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.style.transform = "scaleX(1) rotate(-360deg)";
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    try {
      console.log("User published:", user);

      // Subscribe to the user's media (video or audio)
      await client.subscribe(user, mediaType);

      if (mediaType === "video") {
        // Handle video stream
        const remoteVideoTrack = user.videoTrack;
        const remoteVideoContainer = document.createElement("video");
        remoteVideoContainer.autoplay = true;
        remoteVideoContainer.id = `remote-${user.uid}`;

        // Find the container to append the new video element
        const videoContainer = document.getElementById("div");
        if (videoContainer) {
          // Append the video element to the container
          videoContainer.appendChild(remoteVideoContainer);
          // Start playing the remote video track
          remoteVideoTrack.play(remoteVideoContainer);
        } else {
          console.error("Video container not found.");
        }
      } else if (mediaType === "audio") {
        // Handle audio stream
        const remoteAudioTrack = user.audioTrack;
        if (remoteAudioTrack) {
          remoteAudioTrack.play(); // Play the audio track
        }
      }
    } catch (error) {
      console.error("Error handling user published:", error);
    }
  };

  const handleUserUnpublished = (user) => {
    const remoteVideoContainer = document.getElementById(`remote-${user.uid}`);
    if (remoteVideoContainer) {
      remoteVideoContainer.remove();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("chat message", { userName, message, roomId });
      setMessage("");
    }
  };
  const startScreenShare = async () => {
    try {
      if (!clientJoined) {
        console.error("Client has not joined the channel yet.");
        return;
      }

      // Create screen share track
      const screenTrack = await AgoraRTC.createScreenVideoTrack();
      setScreenShareTrack(screenTrack);

      // Unpublish camera video track but keep audio track
      const cameraTrack = localTracks.find(
        (track) => track.getMediaStreamTrack().kind === "video"
      );
      if (cameraTrack) {
        await client.unpublish(cameraTrack);
        cameraTrack.stop();
      }

      // Publish screen share track and audio track
      await client.publish([
        screenTrack,
        ...localTracks.filter(
          (track) => track.getMediaStreamTrack().kind === "audio"
        ),
      ]);
      setScreenShare(true);

      if (videoRef.current) {
        screenTrack.play(videoRef.current);
      }
    } catch (error) {
      console.error("Error starting screen share:", error);
    }
  };

  // amra localtract audio and vidoe 2ta ase . ami localtrac unpublias korle user ki voice sunte parbe na
  const stopScreenShare = async () => {
    try {
      if (screenShareTrack) {
        await client.unpublish([screenShareTrack]);
        screenShareTrack.stop();
        setScreenShareTrack(null);
        setScreenShare(false);
        applyTransformations();
        await client.publish(localTracks);
        screenShareTrack.on("track-ended", () => {});
        localTracks[1].play(videoRef.current); // Assuming localTracks[1] is the camera video track
      }
    } catch (error) {
      console.error("Error stopping screen share:", error);
    }
  };
  useEffect(() => {
    if (screenShareTrack) {
      // Attach the event listener when screen share starts
      screenShareTrack.on("track-ended", () => {
        stopScreenShare();
      });

      return () => {
        screenShareTrack.off("track-ended");
      };
    }
  }, [screenShareTrack]);

  const toggleScreenShare = () => {
    if (screenShare) {
      stopScreenShare();
    } else {
      startScreenShare();
    }
  };

  const muteAudio = async () => {
    if (audiostate) {
      await localTracks[0].setMuted(true); // Mute the microphone
    } else {
      await localTracks[0].setMuted(false); // Unmute the microphone
    }
    setAudio(!audiostate); // Update the state
  };

  const stopCamera = async () => {
    try {
      // Check if videoState is true (camera is on)
      if (videoState) {
        // Find the camera video track from localTracks
        const cameraTrack = localTracks.find(
          (track) => track.getMediaStreamTrack().kind === "video"
        );
        if (cameraTrack) {
          // Unpublish and stop the camera track
          await client.unpublish(cameraTrack);
          cameraTrack.stop();
        }
      } else {
        // Publish all local tracks, including the camera video track
        await client.publish(localTracks);
        // Assuming localTracks[1] is the camera video track; adjust if necessary
        const cameraTrack = localTracks.find(
          (track) => track.getMediaStreamTrack().kind === "video"
        );
        if (cameraTrack) {
          cameraTrack.play(videoRef.current);
        }
      }
      // Toggle videoState
      setVideoSata(!videoState);
    } catch (error) {
      console.error("Error in stopCamera function:", error);
    }
  };

  const notifyUsersAdminLeft = useCallback(() => {
    socket.emit("adminLeft", roomId);
  }, [roomId]);

  const hangB = async () => {
    try {
      // Leave the channel and stop local tracks
      notifyUsersAdminLeft();
      await client.leave();
      localTracks.forEach((track) => track.stop() && track.close());
      screenShareTrack && screenShareTrack.stop() && screenShareTrack.close();

      // Optionally redirect or update UI after leaving the call
      window.location.href = "/";
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const toggleFullScreen = (ref) => {
    const videoElement = ref.current;

    if (!document.fullscreenElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen(); // Standard way to request full screen
      } else if (videoElement.mozRequestFullScreen) {
        // For Firefox
        videoElement.mozRequestFullScreen();
      } else if (videoElement.webkitRequestFullscreen) {
        // For Chrome, Safari, and Opera
        videoElement.webkitRequestFullscreen();
      } else if (videoElement.msRequestFullscreen) {
        // For Internet Explorer/Edge
        videoElement.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen(); // Standard way to exit full screen
      }
    }
  };
  // Add event listeners for fullscreen change
  const leaveUser = async () => {
    try {
      // Leave the channel and stop local tracks
      socket.on("disconnect");
      // Optionally redirect or update UI after leaving the call
      window.location.href = "/user/dashboard";
    } catch (error) {
      console.error("Error ending call:", error);
    }
  };

  const [accessGranted, setAccessGranted] = useState(false);

  const handleAccessGranted = () => {
    setAccessGranted(true);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setAccessGranted(false);
    }, 2 * 60 * 1000);
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const savedFace = localStorage.getItem("savedFace");

  return (
    <main
      className="w-full flex flex-col bg-slate-800 h-screen relative  justify-between overflow-hidden"
      ref={fullscreenRef}
      onDoubleClick={() => toggleFullScreen(fullscreenRef)}
    >
      <div className="bg-slate-900 text-white py-4 flex  items-center justify-between px-3 sm:py-2">
        <div className="text-xl ">Trace Academy live</div>
        <div className="text-left md:w-[57%] text-lg sm:block hidden">
          New Session Live Class
        </div>
      </div>

      <div className="w-full sm:h-[70%] h-[80%] lg:h-[80%] flex   mt-2">
        {/* Participants Panel */}
        <div className="relative  md:h-[80vh] md:w-[20%]  text-white md:overflow-hidden">
          <div
            className={`bg-slate-900 z-20 h-full w-[250px] md:w-full absolute rounded-md top-0 left-0 transition-transform duration-500 ease-in-out transform ${
              participantVisible ? "translate-x-0 block" : "-translate-x-full"
            }`}
          >
            <div className="bg-cyan-800 py-4 text-center text-xl">
              Participants ({participants.length})
            </div>
            <div className="flex items-start px-12 justify-center flex-col">
              {participants &&
                participants.map((data, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <h1 className="">{data?.userName}</h1>
                    <span className="text-xl">
                      <GrStatusGoodSmall color="green" size={8} />
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Video Stream */}
        <div
          className={`relative w-full md:h-full items-center justify-center flex flex-col gap-2 px-2`}
        >
          <div className="flex sm:h-full lg:w-full items-center">
            {role === "admin" ? (
              <div className="relative w-full h-full">
                <video
                  onDoubleClick={() => toggleFullScreen(videoRef)}
                  ref={videoRef}
                  className="w-full h-full object-fill transform_video rounded-md"
                  playsInline
                  autoPlay
                ></video>

                {/* Conditionally render the admin name if video is off */}
                {!videoState && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-slate-800 bg-opacity-50">
                    <h2 className="text-white text-[6rem] bg-coching-text_color rounded-full w-[130px] h-[130px] flex items-center justify-center">
                      {userName.charAt(0)}
                    </h2>
                  </div>
                )}
              </div>
            ) : (
              <div
                id="div"
                onDoubleClick={() => toggleFullScreen(uservideoRef)}
                ref={uservideoRef}
                className="w-full h-full object-contain flex items-center justify-center"
              ></div>
            )}
          </div>
        </div>

        {/* Chat Panel */}
        {/* Chat Panel */}
        <div className="relative md:h-[80%] md:w-[20%] text-white md:overflow-hidden">
          <div
            className={` fixed top-13 right-0  w-[320px] h-[80vh]  rounded-md bg-slate-900 p-5 transition-transform duration-300 ${
              chatVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <h1 className="text-white py-3 text-center">
              Welcome to the room {userId}! 👋
            </h1>
            <div
              ref={chatMessages}
              className="flex flex-col gap-2 overflow-auto h-[calc(90vh-140px)]" // Adjust height to fit within the panel
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="p-2 flex items-start flex-col bg-gray-700 text-white rounded-md"
                >
                  <p className="text-coching-text_color font-medium">
                    {msg.username}
                  </p>
                  <p>{msg.message}</p>
                </div>
              ))}
            </div>
            <div className="absolute bottom-2 left-0 px-2 flex flex-col w-full">
              <div className="flex">
                <input
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  value={message}
                  className="flex-1 p-2 border border-gray-700 bg-gray-800 text-white"
                  placeholder="Type a message..."
                />
                <button
                  onClick={handleSendMessage}
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="  flex items-center justify-center w-full bg-slate-800 lg:mb-4 mb-2 ">
        {role === "admin" ? (
          <div className="flex flex-row gap-2 items-center justify-center">
            <button
              onClick={muteAudio}
              ref={muteAudButton}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              {audiostate ? <FiMic size={20} /> : <FiMicOff size={20} />}
            </button>
            <button
              onClick={stopCamera}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {videoState ? (
                <IoVideocam size={20} />
              ) : (
                <IoVideocamOff size={20} />
              )}
            </button>
            <button
              title="Participant"
              onClick={() => {
                setParticipantVisible(!participantVisible);
                setChatVisible(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              <IoPeople size={20} />
            </button>
            <button
              title="Present Now"
              onClick={toggleScreenShare}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              <SlScreenDesktop size={20} />
            </button>
            <button
              title="Chat Now"
              onClick={() => {
                setChatVisible(!chatVisible);
                setParticipantVisible(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              <MdOutlineChat size={20} />
            </button>
            <button
              title="Leave Call"
              ref={hangupButton}
              onClick={hangB}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              <MdCallEnd size={20} />
            </button>
          </div>
        ) : (
          <div className="flex flex-row gap-2 items-center justify-center">
            <button
              title="Participant"
              onClick={() => {
                setParticipantVisible(!participantVisible);
                setChatVisible(false);
              }}
              ref={muteAudButton}
              className="bg-gray-500 relative text-white px-4 py-2 rounded"
            >
              <IoPeople size={21} />
            </button>
            <button
              title="Chat Now"
              onClick={() => {
                setChatVisible(!chatVisible);
                setParticipantVisible(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              <MdOutlineChat size={21} />
            </button>
            <button
              title="Leave Call"
              onClick={leaveUser}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              <MdCallEnd size={21} />
            </button>
          </div>
        )}
      </div>
      <div
        className={`${
          savedFace ? "opacity-0" : "opacity-1"
        }  absolute top-32 left-[30%] `}
      >
        {!accessGranted && role !== "admin" && (
          <FaceDetection
            onAccessGranted={handleAccessGranted}
            setError={setError}
            setAlertVisible={setAlertVisible}
            setNavigateUrl={setNavigateUrl}
          />
        )}
      </div>
      <AlertModal
        error={error}
        AlertVisible={AlertVisible}
        setAlertVisible={setAlertVisible}
        navigateUrl={navigateUrl}
      />
      <NotificationModal
        isAdmin={role === "admin"}
        notificationQueue={notificationQueue}
        setNotificationQueue={setNotificationQueue}
        visible={visible}
        setVisible={setVisible}
        setCurrentNotification={setCurrentNotification}
        currentNotification={currentNotification}
      />
      <ScreenRecordingOverlay />
    </main>
  );
};

export default LiveStream;
