import React, { useEffect, useRef, useState } from "react";
import "./custom_youtube_player.css";

// Import the local images
import playImage from "../../assets/play.png";
import pauseImage from "../../assets/pause.png";
import stopImage from "../../assets/stop.png";
import rewindImage from "../../assets/rewind.png";
import forwardImage from "../../assets/fast_forward.png";
import fullscreenImage from "../../assets/full-screen.png";
import minimizeImage from "../../assets/minimize.png";

const YouTubePlayer = ({ videoId }) => {
  const playerRef = useRef(null); // Reference to the YouTube player container
  const iframeRef = useRef(null); // Reference for the iframe
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [player, setPlayer] = useState(null); // Hold YouTube player instance
  const [progress, setProgress] = useState(0); // Progress of video playback
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // Video duration
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    // Load YouTube API only once
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => {
      const ytPlayer = new window.YT.Player(iframeRef.current, {
        height: "390",
        width: "640",
        videoId: videoId, // Use the initial videoId prop
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onStateChange,
        },
      });
      setPlayer(ytPlayer);
    };

    return () => {
      // Cleanup player when component is unmounted
      if (player) {
        player.destroy();
      }
      document.body.removeChild(script);
    };
  }, []); // Run only once on component mount

  console.log("videoid", videoId);

  useEffect(() => {
    // Update the video when videoId changes
    if (player && onPlayerReady && videoId) {
      player.loadVideoById(videoId);
    }
  }, [videoId]);

  const onPlayerReady = (event) => {
    event.target.playVideo();
    const videoDuration = event.target.getDuration(); // Get duration from player
    setDuration(videoDuration);
    setProgress(0); // Reset progress on player ready
  };

  const onStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING && player) {
      const interval = setInterval(() => {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        setProgress((currentTime / duration) * 100); // Update progress as a percentage
      }, 1000); // Update progress every second
      return () => clearInterval(interval); // Clear the interval when the video stops
    }
  };

  useEffect(() => {
    // Update the progress every 100 milliseconds when the video is playing
    const intervalId = setInterval(() => {
      if (player && player.getPlayerState() === window.YT.PlayerState.PLAYING) {
        updateProgress();
      }
    }, 100);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [player]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Request fullscreen for the entire player container
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.mozRequestFullScreen) {
        // Firefox
        playerRef.current.mozRequestFullScreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
        // Chrome/Safari/Opera
        playerRef.current.webkitRequestFullscreen();
      } else if (playerRef.current.msRequestFullscreen) {
        // IE/Edge
        playerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome/Safari/Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const playVideo = () => {
    if (player) {
      player.playVideo(); // Play the video
    }
  };

  const pauseVideo = () => {
    if (player) {
      player.pauseVideo(); // Pause the video
    }
  };

  const stopVideo = () => {
    if (player) {
      player.stopVideo(); // Stop the video and reset to the beginning
    }
  };

  const rewindVideo = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime - 3, true); // Rewind 3 seconds
    }
  };

  const fastForwardVideo = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime + 3, true); // Fast forward 3 seconds
    }
  };

  const handleProgressBarClick = (e) => {
    const progressBar = e.target;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left; // Get click position relative to the progress bar
    const newProgress = (clickPosition / progressBar.offsetWidth) * 100; // Convert to percentage
    const newTime = (newProgress / 100) * duration; // Calculate new time based on the percentage of the video duration

    if (player && !isNaN(newTime) && newTime >= 0 && newTime <= duration) {
      player.seekTo(newTime, true); // Seek to the new time in the video
    }
  };

  const updateProgress = () => {
    if (player) {
      const current = player.getCurrentTime();
      setCurrentTime(current);
    }
  };
  // Show custom controls on hover
  const handleMouseEnter = () => {
    setControlsVisible(true);
  };

  // Hide custom controls when mouse leaves
  const handleMouseLeave = () => {
    setControlsVisible(false);
  };

  return (
    <div
      ref={playerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="overflow-hidden"
      style={{
        position: "relative",

        display: "inline-block",
        width: isFullscreen
          ? "100vw"
          : window.innerWidth < 768
          ? "100vw"
          : "50vw", // Fullscreen width on mobile
        height: isFullscreen
          ? "100vh"
          : window.innerWidth < 768
          ? "56.25vw"
          : "50vh", // Fullscreen height on mobile (16:9 aspect ratio)
        backgroundColor: "#000", // Ensure background is black
        overflow: "hidden",
        zIndex: 10,
      }}
    >
      {/* YouTube iframe player */}
      <div
        ref={iframeRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      ></div>
      {/* Overlay to block YouTube controls */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Semi-transparent overlay
          zIndex: 1000, // Overlay's z-index should be below the fullscreen button
          cursor: "not-allowed", // Make it clear the player is blocked
        }}
      >
        {/* This overlay does nothing but block the controls */}
      </div>
      {/* Bottom Control Panel */}
      {controlsVisible && (
        <div className="controls">
          <button key="play" className="control-btn play" onClick={playVideo}>
            <img src={playImage} alt="play" className="control-icon" />
          </button>
          <button key="stop" className="control-btn stop" onClick={pauseVideo}>
            <img src={pauseImage} alt="Stop" className="control-icon" />
          </button>
          <button key="pause" className="control-btn stop" onClick={stopVideo}>
            <img src={stopImage} alt="Stop" className="control-icon" />
          </button>
          <button
            key="Rewind"
            className="control-btn rewind"
            onClick={rewindVideo}
          >
            <img src={rewindImage} alt="Rewind" className="control-icon" />
          </button>
          <button
            key="Forward"
            className="control-btn fast-forward"
            onClick={fastForwardVideo}
          >
            <img
              src={forwardImage}
              alt="Fast Forward"
              className="control-icon"
            />
          </button>
          {/* Fullscreen Button */}
          {isFullscreen ? (
            <button
              key="con"
              className="control-btn stop"
              onClick={toggleFullscreen}
            >
              <img src={minimizeImage} alt="Stop" className="control-icon" />
            </button>
          ) : (
            <button
              key="nn"
              className="control-btn stop"
              onClick={toggleFullscreen}
            >
              <img src={fullscreenImage} alt="Stop" className="control-icon" />
            </button>
          )}
        </div>
      )}
      {/* Progress Bar */}
      <div
        onClick={handleProgressBarClick}
        style={{
          position: "absolute",
          bottom: "50px",
          left: "10px",
          right: "10px",
          height: "5px",
          backgroundColor: "#ddd",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1001, // Make sure it's above the overlay, but below buttons
        }}
      >
        <div
          style={{
            // width: `${progress}%`,
            width: `${(currentTime / duration) * 100}%`,
            height: "100%",
            backgroundColor: "#ff0000",
            borderRadius: "5px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default YouTubePlayer;
