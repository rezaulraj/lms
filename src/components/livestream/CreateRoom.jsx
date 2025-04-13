import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client"; // Import socket.io-client
import axiosInstance from "../axiosInstance";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const socket = io(import.meta.env.VITE_SOCKET_IO_URL);

export default function CreateRoom() {
  const [className, setClassName] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for any confirmation or responses from the backend if needed
    socket.on("roomCreated", (roomData) => {
      console.log("Room Created:", roomData);
    });

    // Cleanup the socket connection on unmount
    return () => {
      socket.off("roomCreated");
    };
  }, []);

  const handleSubmit = async () => {
    // Generate a unique room ID and link
    const roomId = uuidv4();
    const roomLink = `/live/stream/${roomId}`;

    // Save data to localStorage
    localStorage.setItem("display_name", name);
    localStorage.setItem("roomLink", roomLink);
    localStorage.setItem("role", "admin");

    try {
      const response = await axios.post(
        ` ${import.meta.env.VITE_SOCKET_IO_URL}/api/carete/room`,
        {
          live_name: className,
          live_link: roomLink,
        }
      );
      console.log(response);
      if (response.status === 200) {
        socket.emit("createRoom", {
          roomId,
          roomLink,
          className,
          name,
          role: "admin",
        });

        navigate(roomLink);
      }
    } catch (e) {
      console.log("Error create room", e);
    }

    // Emit room creation event to the backend with room info and user profile

    // Navigate to the room link
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <iframe
        src="https://player.vdocipher.com/live?liveId=a22672ffee1242f28d8fe498aebca0b8"
        style={{
          border: "0",
          width: "720px",
          aspectRatio: "16/9",
          maxWidth: "100%",
        }}
        allow="autoplay; fullscreen"
        allowFullScreen
        title="Live Stream"
      ></iframe>
    </div>
  );
}
