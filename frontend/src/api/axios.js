import axios from "axios";
import { toast } from "react-hot-toast";

// Backend API URL - Your backend runs on port 5002
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5002/api";

const API = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor - Add token to headers
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        // Check if token is stored in user object or separately
        const token = userData.token || localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - Clear user and redirect to login
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          sessionStorage.setItem("loggedOut", "true");
          window.dispatchEvent(new Event("force-logout"));
          toast.error("Session expired. Please login again.");
          window.location.href = "/login";
          break;

        case 403:
          toast.error("Access denied. You do not have permission.");
          break;

        case 404:
          toast.error("Resource not found.");
          break;

        case 500:
          toast.error("Server error. Please try again later.");
          break;

        default:
          toast.error(response.data?.msg || "An error occurred");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  },
);

export default API;
