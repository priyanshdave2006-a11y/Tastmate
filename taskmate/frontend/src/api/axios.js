// api/axios.js
// A pre-configured axios instance used by the whole app to talk to the backend.

import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// This "interceptor" runs before every single request.
// It automatically attaches the JWT token (if we have one) to the
// Authorization header, so we don't have to repeat this code everywhere.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskmate_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
