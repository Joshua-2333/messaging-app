// client/src/api/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Attach JWT token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token logic
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "http://localhost:3000/api/token/refresh",
          {},
          { withCredentials: true }
        );

        localStorage.setItem("token", res.data.accessToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

        return API(originalRequest);
      } catch (err) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
