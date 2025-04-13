import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "react-app-polyfill/ie11"; // For older browsers like IE11
import "react-app-polyfill/stable"; // For all stable features

console.log(window.crypto);
console.log(window.crypto.getRandomValues);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="385875401714-jlqu0kkr8mbugsoiku32lea9ueqpt0pp.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
