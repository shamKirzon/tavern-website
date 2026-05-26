import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `http://localhost:${import.meta.env.VITE_PORT}/api`,
  withCredentials: true,
});
