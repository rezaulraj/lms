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
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [player, setPlayer] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    // Load YouTube API if not already loaded
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(script);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  const initializePlayer = () => {
    if (!iframeRef.current) return;

    const ytPlayer = new window.YT.Player(iframeRef.current, {
      height: "100%",
      width: "100%",
      videoId: videoId,
      playerVars: {
        controls: 0, // Disable native controls
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
      },
      events: {
        onReady: (event) => {
          setPlayer(event.target);
          setIsPlayerReady(true);
          onPlayerReady(event);
        },
        onStateChange: onStateChange,
      },
    });
  };

  useEffect(() => {
    if (isPlayerReady && player && videoId) {
      player.cueVideoById(videoId);
      setCurrentTime(0);
      setProgress(0);
    }
  }, [videoId, isPlayerReady]);

  const onPlayerReady = (event) => {
    const videoDuration = event.target.getDuration();
    setDuration(videoDuration);
    event.target.playVideo();
    setIsPlaying(true);
  };

  const onStateChange = (event) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setIsPlaying(true);
        break;
      case window.YT.PlayerState.PAUSED:
        setIsPlaying(false);
        break;
      case window.YT.PlayerState.ENDED:
        setIsPlaying(false);
        setCurrentTime(0);
        setProgress(0);
        break;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (player && player.getPlayerState() === window.YT.PlayerState.PLAYING) {
        const current = player.getCurrentTime();
        const dur = player.getDuration();
        setCurrentTime(current);
        setProgress((current / dur) * 100);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [player]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      } else if (playerRef.current.mozRequestFullScreen) {
        playerRef.current.mozRequestFullScreen();
      } else if (playerRef.current.webkitRequestFullscreen) {
        playerRef.current.webkitRequestfullscreen();
      } else if (playerRef.current.msRequestFullscreen) {
        playerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const playVideo = () => {
    if (player) {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const pauseVideo = () => {
    if (player) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  };

  const stopVideo = () => {
    if (player) {
      player.stopVideo();
      setIsPlaying(false);
      setCurrentTime(0);
      setProgress(0);
    }
  };

  const rewindVideo = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      player.seekTo(Math.max(0, currentTime - 3), true);
    }
  };

  const fastForwardVideo = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      const dur = player.getDuration();
      player.seekTo(Math.min(dur, currentTime + 3), true);
    }
  };

  const handleProgressBarClick = (e) => {
    const progressBar = e.currentTarget;
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
    const newProgress = (clickPosition / progressBar.offsetWidth) * 100;
    const newTime = (newProgress / 100) * duration;

    if (player && !isNaN(newTime) && newTime >= 0 && newTime <= duration) {
      player.seekTo(newTime, true);
      setCurrentTime(newTime);
      setProgress(newProgress);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div
      ref={playerRef}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
      className="youtube-player-container"
      style={{
        position: "relative",
        display: "inline-block",
        width: isFullscreen
          ? "100vw"
          : window.innerWidth < 768
          ? "100vw"
          : "55vw",
        height: isFullscreen
          ? "100vh"
          : window.innerWidth < 768
          ? "56.25vw"
          : "50vh",
        backgroundColor: "#000",
        overflow: "hidden",
      }}
    >
      {/* YouTube iframe player */}
      <div
        ref={iframeRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      ></div>

      {/* Full transparent overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          zIndex: 1,
          cursor: "not-allowed",
        }}
      ></div>

      {/* Custom controls container */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "80px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
          zIndex: 50,
          // Remove this line: pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          paddingBottom: "10px",
        }}
      >
        {/* Progress Bar */}
        <div
          onClick={handleProgressBarClick}
          style={{
            width: "calc(100% - 20px)",
            margin: "0 10px",
            height: "5px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              backgroundColor: "#ff0000",
              borderRadius: "5px",
            }}
          ></div>
        </div>

        {/* Controls */}
        {controlsVisible && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "15px",
              marginTop: "10px",
            }}
          >
            <button
              onClick={isPlaying ? pauseVideo : playVideo}
              style={{
                background: "white",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                borderRadius: "50%",
              }}
            >
              <img
                src={isPlaying ? pauseImage : playImage}
                alt={isPlaying ? "Pause" : "Play"}
                style={{ width: "24px", height: "24px" }}
              />
            </button>
            <button
              onClick={stopVideo}
              style={{
                background: "white",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                borderRadius: "50%",
              }}
            >
              <img
                src={stopImage}
                alt="Stop"
                style={{ width: "24px", height: "24px" }}
              />
            </button>
            <button
              onClick={rewindVideo}
              style={{
                background: "white",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                borderRadius: "50%",
              }}
            >
              <img
                src={rewindImage}
                alt="Rewind"
                style={{ width: "24px", height: "24px" }}
              />
            </button>
            <button
              onClick={fastForwardVideo}
              style={{
                background: "white",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                borderRadius: "50%",
              }}
            >
              <img
                src={forwardImage}
                alt="Fast Forward"
                style={{ width: "24px", height: "24px" }}
              />
            </button>
            <div
              style={{
                color: "white",
                fontFamily: "Arial",
                fontSize: "14px",
                margin: "0 10px",
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <button
              onClick={toggleFullscreen}
              style={{
                background: "white",
                border: "none",
                cursor: "pointer",
                padding: "2px",
                borderRadius: "50%",
              }}
            >
              <img
                src={isFullscreen ? minimizeImage : fullscreenImage}
                alt={isFullscreen ? "Minimize" : "Fullscreen"}
                style={{ width: "24px", height: "24px" }}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubePlayer;
