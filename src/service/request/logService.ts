import { api } from "./api";

export const logService = {
  list: (params?: { page?: number; search?: string; date?: string }) =>
    api.get("/logs", { params }),

  getById: (id: string) => api.get(`/logs/${id}`),
};
