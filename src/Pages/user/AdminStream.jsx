// import { io } from "socket.io-client";
// import { useRef, useEffect, useState } from "react";
// import { FiVideo, FiVideoOff, FiMic, FiMicOff } from "react-icons/fi";
// import { SlScreenDesktop } from "react-icons/sl";

// const configuration = {
//   iceServers: [
//     {
//       urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
//     },
//   ],
//   iceCandidatePoolSize: 10,
// };

// const socket = io("http://localhost:5000", { transports: ["websocket"] });

// function AdminStream() {
//   const startButton = useRef(null);
//   const hangupButton = useRef(null);
//   const muteAudButton = useRef(null);
//   const localVideo = useRef(null);
//   const remoteVideo = useRef(null);
//   const screenShareVideo = useRef(null);
//   const chatInput = useRef(null);
//   const chatMessages = useRef(null);
//   const [participants, setParticipants] = useState([]); // Add participants state

//   const [screenShare, setScreenShare] = useState(false);
//   const [audiostate, setAudio] = useState(false);
//   const [remoteStreams, setRemoteStreams] = useState([]);
//   const [chat, setChat] = useState([]);
//   const userId = localStorage.getItem("username"); // Retrieve userId from localStorage
//   const isAdmin = localStorage.getItem("admin");

//   let pc;
//   let localStream;
//   let screenStream;

//   useEffect(() => {
//     hangupButton.current.disabled = true;
//     muteAudButton.current.disabled = true;

//     // Emit userId when connected

//     socket.on("message", async (e) => {
//       if (e.type === "chat") {
//         setChat((prevChat) => [
//           ...prevChat,
//           { userId: e.userId, message: e.message },
//         ]);
//         scrollToBottom();
//       } else if (!localStream) {
//         console.log("not ready yet");
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
//               hangup();
//             }
//             break;
//           case "participants":
//             setParticipants(e.participants); // Update participants list
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
//   }, [localStream, pc]);

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
//         if (isAdmin) {
//           // Admin's stream logic
//           if (
//             e.streams[0].getVideoTracks()[0].label.includes("screen") &&
//             screenShareVideo.current
//           ) {
//             screenShareVideo.current.srcObject = e.streams[0];
//           } else {
//             setRemoteStreams((prevStreams) => [...prevStreams, e.streams[0]]);
//           }
//         } else {
//           // Participant's stream logic (just view the stream)
//           if (remoteVideo.current) {
//             remoteVideo.current.srcObject = e.streams[0];
//           }
//         }
//       };

//       if (isAdmin) {
//         localStream
//           .getTracks()
//           .forEach((track) => pc.addTrack(track, localStream));
//       }

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
//         if (isAdmin) {
//           // Admin's stream logic
//           if (
//             e.streams[0].getVideoTracks()[0].label.includes("screen") &&
//             screenShareVideo.current
//           ) {
//             screenShareVideo.current.srcObject = e.streams[0];
//           } else {
//             setRemoteStreams((prevStreams) => [...prevStreams, e.streams[0]]);
//           }
//         } else {
//           // Participant's stream logic (just view the stream)
//           if (remoteVideo.current) {
//             remoteVideo.current.srcObject = e.streams[0];
//           }
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

//   async function hangup() {
//     if (pc) {
//       pc.close();
//       pc = null;
//     }
//     if (localStream) {
//       localStream.getTracks().forEach((track) => track.stop());
//     }
//     if (screenStream) {
//       screenStream.getTracks().forEach((track) => track.stop());
//     }
//     localStream = null;
//     screenStream = null;
//     setRemoteStreams([]);
//     startButton.current.disabled = false;
//     hangupButton.current.disabled = true;
//     muteAudButton.current.disabled = true;
//   }

//   const startB = async () => {
//     if (isAdmin) {
//       try {
//         localStream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: { echoCancellation: true },
//         });
//         if (localVideo.current) {
//           localVideo.current.srcObject = localStream;
//         }
//         startButton.current.disabled = true;
//         hangupButton.current.disabled = false;
//         muteAudButton.current.disabled = false;
//         socket.emit("message", { type: "ready" });
//       } catch (err) {
//         console.error("Error starting video:", err);
//       }
//     } else {
//       // Participants should join automatically
//       socket.emit("message", { type: "ready" });
//     }
//   };

//   const hangB = async () => {
//     hangup();
//     socket.emit("message", { type: "bye" });
//   };

//   function muteAudio() {
//     if (audiostate) {
//       if (localStream) {
//         localStream
//           .getAudioTracks()
//           .forEach((track) => (track.enabled = false));
//       }
//       setAudio(false);
//     } else {
//       if (localStream) {
//         localStream.getAudioTracks().forEach((track) => (track.enabled = true));
//       }
//       setAudio(true);
//     }
//   }

//   const shareScreen = async () => {
//     if (screenShare) {
//       if (screenStream) {
//         screenStream.getTracks().forEach((track) => track.stop());
//       }
//       setScreenShare(false);
//       return;
//     }
//     setScreenShare(true);
//     try {
//       screenStream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: false,
//       });
//       if (screenShareVideo.current) {
//         screenShareVideo.current.srcObject = screenStream;
//       }
//       screenStream
//         .getTracks()
//         .forEach((track) => pc.addTrack(track, screenStream));
//     } catch (e) {
//       console.error("Error sharing screen:", e);
//     }
//   };

//   const sendChatMessage = () => {
//     const message = chatInput.current.value;
//     if (message.trim()) {
//       socket.emit("chat", { userId, message }); // Include userId in chat message
//       chatInput.current.value = "";
//     }
//   };

//   useEffect(() => {
//     // Request participants list on mount
//     if (userId) {
//       socket.emit("addParticipant", { userId });
//     }
//     socket.emit("requestParticipants");

//     socket.on("participants", (participantsList) => {
//       setParticipants(participantsList);
//     });

//     return () => {
//       socket.off("participants");
//     };
//   }, []);
//   console.log(participants);

//   return (
//     <>
//       <main className="w-full flex">
//         <div className="h-screen w-[20%] bg-slate-900 text-white">
//           <div className="bg-cyan-800 py-4 text-center text-xl">
//             Participants
//           </div>
//           <div>
//             {participants.map((data, index) => (
//               <h1 key={index}>{data.userId}</h1>
//             ))}
//           </div>
//         </div>
//         <div className="relative w-[60%] bg-slate-600 flex flex-col gap-2">
//           {screenShare && (
//             <div className="flex h-[40%]">
//               <video
//                 ref={screenShareVideo}
//                 className="w-full h-full object-fill"
//                 autoPlay
//                 playsInline
//               ></video>
//             </div>
//           )}
//           <video
//             ref={localVideo}
//             className="w-full h-full object-fill"
//             autoPlay
//             muted
//           ></video>

//           <div className="absolute top-0 flex h-[40%]">
//             <video
//               ref={remoteVideo}
//               className="w-full h-full object-fill"
//               autoPlay
//               playsInline
//             ></video>
//           </div>

//           <div className="absolute bottom-5 left-[35%] flex flex-row gap-2">
//             <button
//               ref={startButton}
//               onClick={startB}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//             >
//               Start
//             </button>
//             <button
//               ref={hangupButton}
//               onClick={hangB}
//               className="bg-red-500 text-white px-4 py-2 rounded"
//             >
//               Hangup
//             </button>
//             <button
//               onClick={muteAudio}
//               ref={muteAudButton}
//               className="bg-yellow-500 text-white px-4 py-2 rounded"
//             >
//               {audiostate ? <FiMic /> : <FiMicOff />}
//             </button>
//             <button
//               onClick={shareScreen}
//               className="bg-green-500 text-white px-4 py-2 rounded"
//             >
//               <SlScreenDesktop />
//             </button>
//           </div>
//         </div>
//         <div className="w-[20%] relative bg-gray-800 px-3">
//           <h1 className="text-white py-3">Welcome to the room Ibrahim! 👋</h1>
//           <div ref={chatMessages} className="flex flex-col gap-2">
//             {chat.map((msg, index) => (
//               <div
//                 key={index}
//                 className="p-2 flex items-start flex-col  bg-gray-700 text-white rounded-md"
//               >
//                 <p className="text-coching-text_color font-medium">
//                   {msg.userId}
//                 </p>
//                 <p className="">{msg.message}</p>
//               </div>
//             ))}
//           </div>
//           <div className="absolute bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-col">
//             <div className="flex">
//               <input
//                 ref={chatInput}
//                 type="text"
//                 className="flex-1 p-2 border border-gray-700 bg-gray-800 text-white"
//                 placeholder="Type a message..."
//               />
//               <button
//                 onClick={sendChatMessage}
//                 className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
//               >
//                 Send
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </>
//   );
// }

// export default AdminStream;
