import { api } from "./api";

export const userService = {
  list: () => api.get("/users"),

  getById: (id: string) => api.get(`/users/${id}`),

  create: (payload: any) => api.post("/users", payload),

  update: (id: string, payload: any) =>
    api.put(`/users/${id}`, payload),

  delete: (id: string) => api.delete(`/users/${id}`),
};
