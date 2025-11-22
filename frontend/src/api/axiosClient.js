import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // uses the backend URL from .env
  withCredentials: true, // ensures cookies are sent with requests
});

export default axiosClient;