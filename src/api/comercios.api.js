import { api } from "./axios";

export const getComerciosRequest = async (params = {}) => {
  const { data } = await api.get("/comercios", { params });
  return data;
};

export const getComercioByIdRequest = async (id) => {
  const { data } = await api.get(`/comercios/${id}`);
  return data;
};

export const createComercioRequest = async (payload) => {
  const { data } = await api.post("/comercios", payload);
  return data;
};

export const updateComercioRequest = async (id, payload) => {
  const { data } = await api.put(`/comercios/${id}`, payload);
  return data;
};

export const deleteComercioRequest = async (id) => {
  const { data } = await api.delete(`/comercios/${id}`);
  return data;
};

export const restoreComercioRequest = async (id) => {
  const { data } = await api.patch(`/comercios/${id}/restore`);
  return data;
};