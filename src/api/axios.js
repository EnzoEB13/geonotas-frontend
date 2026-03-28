import axios from "axios";

/*
  ANDROID EMULADOR:
  http://10.0.2.2:4000/api

  CELULAR FISICO:
  reemplazar por la IP local de tu PC, por ejemplo:
  http://192.168.0.15:4000/api
*/

export const api = axios.create({
  baseURL: "https://geonotas-backend.onrender.com/api",
  timeout: 30000,
});