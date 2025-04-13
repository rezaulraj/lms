// auth.js
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const CardContext = createContext();
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setLoggedIn] = useState(() => {
    const token = localStorage.getItem("x-access-token");
    return token ? true : false;
  });
  const login = (token) => {
    localStorage.setItem("x-access-token", JSON.stringify(token));

    setLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("x-access-token");
    localStorage.removeItem("username");
    localStorage.removeItem("email");

    setLoggedIn(false);
    navigate("/");
  };

  // cart context
  const [cart, setCart] = useState(() => {
    const exitingCart = sessionStorage.getItem("cart");
    return exitingCart ? JSON.parse(exitingCart) : [];
  });

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, cart, setCart }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
