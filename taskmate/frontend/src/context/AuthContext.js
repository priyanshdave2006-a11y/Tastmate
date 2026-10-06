// context/AuthContext.js
// This makes the logged-in user's info available to every component
// in the app, without passing it down manually through props.

import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if the user was already logged in
  // (their token + info were saved in localStorage from a previous visit).
  useEffect(() => {
    const savedUser = localStorage.getItem("taskmate_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("taskmate_token", token);
    localStorage.setItem("taskmate_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("taskmate_token");
    localStorage.removeItem("taskmate_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so components can just call useAuth() instead of
// importing useContext + AuthContext every time.
export const useAuth = () => useContext(AuthContext);
