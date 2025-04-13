// import { io } from "socket.io-client";
// import { useRef, useEffect, useState } from "react";
// import { FiMic, FiMicOff } from "react-icons/fi";

// const configuration = {
//   iceServers: [
//     {
//       urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };

// const socket = io("http://localhost:5000", { transports: ["websocket"] });

// function UserStream() {
//   const leaveButton = useRef(null);
//   const remoteVideo = useRef(null);
//   const chatInput = useRef(null);
//   const chatMessages = useRef(null);

//   const [audiostate, setAudio] = useState(true); // Default to audio on
//   const [remoteStreams, setRemoteStreams] = useState([]);
//   const [chat, setChat] = useState([]);
//   const userId = localStorage.getItem("username");

//   let pc;

//   useEffect(() => {
//     leaveButton.current.disabled = true;

//     socket.on("message", async (e) => {
//       if (e.type === "chat") {
//         setChat((prevChat) => [...prevChat, { userId: e.userId, message: e.message }]);
//         scrollToBottom();
//       } else if (!remoteStreams.length) {
//         console.log("no remote streams yet");
//         return;
//       } else {
//         switch (e.type) {
//           case "offer":
//             await handleOffer(e);
//             break;
//           case "answer":
//             await handleAnswer(e);
//             break;
//           case "candidate":
//             await handleCandidate(e);
//             break;
//           case "ready":
//             if (pc) {
//               console.log("already in call, ignoring");
//               return;
//             }
//             await makeCall();
//             break;
//           case "bye":
//             if (pc) {
//               leaveCall();
//             }
//             break;
//           default:
//             console.log("unhandled", e);
//             break;
//         }
//       }
//     });

//     return () => {
//       socket.off("message");
//     };
//   }, [remoteStreams, pc]);

//   const scrollToBottom = () => {
//     chatMessages.current.scrollTop = chatMessages.current.scrollHeight;
//   };

//   async function makeCall() {
//     try {
//       pc = new RTCPeerConnection(configuration);
//       pc.onicecandidate = (e) => {
//         const message = {
//           type: "candidate",
//           candidate: e.candidate ? e.candidate.candidate : null,
//           sdpMid: e.candidate ? e.candidate.sdpMid : null,
//           sdpMLineIndex: e.candidate ? e.candidate.sdpMLineIndex : null,
//         };
//         socket.emit("message", message);
//       };

//       pc.ontrack = (e) => {
//         setRemoteStreams((prevStreams) => [...prevStreams, e.streams[0]]);
//         if (remoteVideo.current) {
//           remoteVideo.current.srcObject = e.streams[0];
//         }
//       };

//       const offer = await pc.createOffer();
//       socket.emit("message", { type: "offer", sdp: offer.sdp });
//       await pc.setLocalDescription(offer);
//     } catch (e) {
//       console.error("Error making call:", e);
//     }
//   }

//   async function handleOffer(offer) {
//     if (pc) {
//       console.error("existing peerconnection");
//       return;
//     }
//     try {
//       pc = new RTCPeerConnection(configuration);
//       pc.onicecandidate = (e) => {
//         const message = {
//           type: "candidate",
//           candidate: e.candidate ? e.candidate.candidate : null,
//           sdpMid: e.candidate ? e.candidate.sdpMid : null,
//           sdpMLineIndex: e.candidate ? e.candidate.sdpMLineIndex : null,
//         };
//         socket.emit("message", message);
//       };

//       pc.ontrack = (e) => {
//         setRemoteStreams((prevStreams) => [...prevStreams, e.streams[0]]);
//         if (remoteVideo.current) {
//           remoteVideo.current.srcObject = e.streams[0];
//         }
//       };

//       await pc.setRemoteDescription(offer);

//       const answer = await pc.createAnswer();
//       socket.emit("message", { type: "answer", sdp: answer.sdp });
//       await pc.setLocalDescription(answer);
//     } catch (e) {
//       console.error("Error handling offer:", e);
//     }
//   }

//   async function handleAnswer(answer) {
//     if (!pc) {
//       console.error("no peerconnection");
//       return;
//     }
//     try {
//       await pc.setRemoteDescription(answer);
//     } catch (e) {
//       console.error("Error handling answer:", e);
//     }
//   }

//   async function handleCandidate(candidate) {
//     if (!pc) {
//       console.error("no peerconnection");
//       return;
//     }
//     try {
//       await pc.addIceCandidate(candidate ? candidate : null);
//     } catch (e) {
//       console.error("Error handling candidate:", e);
//     }
//   }

//   async function leaveCall() {
//     if (pc) {
//       pc.close();
//       pc = null;
//     }
//     setRemoteStreams([]);
//     leaveButton.current.disabled = false;
//   }

//   const leaveB = async () => {
//     leaveCall();
//     socket.emit("message", { type: "bye" });
//   };

//   function muteAudio() {
//     if (audiostate) {
//       if (pc) {
//         pc.getSenders().forEach((sender) => {
//           if (sender.track && sender.track.kind === "audio") {
//             sender.track.enabled = false;
//           }
//         });
//       }
//       setAudio(false);
//     } else {
//       if (pc) {
//         pc.getSenders().forEach((sender) => {
//           if (sender.track && sender.track.kind === "audio") {
//             sender.track.enabled = true;
//           }
//         });
//       }
//       setAudio(true);
//     }
//   }

//   const sendChatMessage = () => {
//     const message = chatInput.current.value;
//     if (message.trim()) {
//       socket.emit("chat", { userId, message });
//       chatInput.current.value = "";
//     }
//   };

//   return (
//     <main className="w-full flex">
//       <div className="relative w-[80%] bg-slate-600 flex flex-col gap-2">
//         <video
//           ref={remoteVideo}
//           className="w-full h-full object-fill"
//           autoPlay
//           playsInline
//         ></video>

//         <div className="absolute bottom-5 left-[35%] flex flex-row gap-2">
//           <button
//             ref={leaveButton}
//             onClick={leaveB}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Leave
//           </button>
//           <button
//             onClick={muteAudio}
//             className="bg-yellow-500 text-white px-4 py-2 rounded"
//           >
//             {audiostate ? <FiMic /> : <FiMicOff />}
//           </button>
//         </div>
//       </div>
//       <div className="w-[20%] relative bg-gray-800 px-3">
//         <h1 className="text-white py-3">Welcome to the room, {userId}! 👋</h1>
//         <div ref={chatMessages} className="flex flex-col gap-2">
//           {chat.map((msg, index) => (
//             <div
//               key={index}
//               className="p-2 flex items-start flex-col bg-gray-700 text-white rounded-md"
//             >
//               <p className="text-coching-text_color font-medium">{msg.userId}</p>
//               <p>{msg.message}</p>
//             </div>
//           ))}
//         </div>
//         <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-col">
//           <div className="flex">
//             <input
//               ref={chatInput}
//               type="text"
//               className="flex-1 p-2 border border-gray-700 bg-gray-800 text-white"
//               placeholder="Type a message..."
//             />
//             <button
//               onClick={sendChatMessage}
//               className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default UserStream;
