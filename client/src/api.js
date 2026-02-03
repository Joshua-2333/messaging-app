// client/src/api.js
import axios from "axios";
import Cookies from "js-cookie";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // backend URL
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // important to send cookies
});

// Attach token from cookie automatically
API.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
