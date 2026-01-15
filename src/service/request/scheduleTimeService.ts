import { api } from "./api";

export const scheduleTimeService = {
  list: () => api.get("/scheduletime"),

  getById: (id: string) =>
    api.get(`/scheduletime/${id}`),

  create: (payload: any) =>
    api.post("/scheduletime", payload),

  update: (id: string, payload: any) =>
    api.put(`/scheduletime/${id}`, payload),

  delete: (id: string) =>
    api.delete(`/scheduletime/${id}`),
};
