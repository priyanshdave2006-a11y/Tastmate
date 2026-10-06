// components/ProtectedRoute.js
// Wraps pages that should only be visible to logged-in users.
// If there's no logged-in user, it redirects to /login.

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // wait until we've checked localStorage

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
