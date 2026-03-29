import axios from "axios";


export const api = axios.create({
  baseURL: "https://geonotas-backend.onrender.com/api",
  timeout: 30000,
});