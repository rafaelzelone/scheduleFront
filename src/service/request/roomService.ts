import { api } from "./api";

export const roomService = {
  list: () => api.get("/rooms"),

  getById: (id: string) => api.get(`/rooms/${id}`),

  create: (payload: any) => api.post("/rooms", payload),

  update: (id: string, payload: any) =>
    api.put(`/rooms/${id}`, payload),

  delete: (id: string) => api.delete(`/rooms/${id}`),
};
