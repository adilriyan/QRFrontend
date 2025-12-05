import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
});

// Automatically attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");   // Or sessionStorage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
