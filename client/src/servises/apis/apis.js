import axios from "axios";
const api = axios.create({
  baseURL: `https://wealthmanager-backend-1y3o.onrender.com`,
  withCredentials: true,
});
export default api;
