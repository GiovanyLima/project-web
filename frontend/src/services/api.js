import axios from "axios";
import {getToken} from "./auth";

const API = process.env.REACT_APP_API;

const api = axios.create({
  baseURL: API
});

api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.params = config.params || {};
    config.params['token'] = token;
  }
  return config;
});

export default api;