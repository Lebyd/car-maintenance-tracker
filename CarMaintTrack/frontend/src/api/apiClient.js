import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Backend API
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
