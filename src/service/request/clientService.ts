import { api } from "./api";

interface ListClientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const clientService = {
  list: (params: ListClientsParams = {}) =>
    api.get("/clients", { params }),

  getById: (id: string) => api.get(`/clients/${id}`),

  getMe: () => api.get("/clients/me"),

  create: (payload: any) => api.post("/clients", payload),

  update: (id: string, payload: any) =>
    api.put(`/clients/${id}`, payload),

  delete: (id: string) => api.delete(`/clients/${id}`),
};
