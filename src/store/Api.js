import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:5000", // your backend URL
});

Api.interceptors.request.use((config) => {
  try {
    const raw = sessionStorage.getItem("quickmeds_superadmin_token");
    if (raw && raw !== "undefined") {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    sessionStorage.removeItem("quickmeds_superadmin_token");
  }
  return config;
});

export default Api;