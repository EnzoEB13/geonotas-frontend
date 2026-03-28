import { api } from "./axios";

export const getAreasRequest = async () => {
  const { data } = await api.get("/areas");
  return data;
};