import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
});

api.interceptors.request.use((config) => {
  // sanitize
  Object.keys(config.params || {}).map((key) => {
    if (
      config.params[key] === undefined ||
      config.params[key] === null ||
      (typeof config.params[key] === "string" &&
        !(config.params[key] as string).length)
    ) {
      delete config.params[key];
    }
  });

  config.headers["Cache-Control"] = "no-cache";
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
