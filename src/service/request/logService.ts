import { api } from "./api";

export const logService = {
  list: (params?: { page?: number; search?: string }) =>
    api.get("/logs", { params }),

  getById: (id: string) => api.get(`/logs/${id}`),
};
