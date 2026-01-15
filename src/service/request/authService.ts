import { api } from "./api";

export const authService = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),

  register: (payload: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    admin?: boolean;
    CEP: string;
    street: string;
    number: string;
    complement?: string;
    neighboor: string;
    city: string;
    state: string;
  }) => api.post("/auth/register", payload),

  me: () => api.get("/auth/me"),
};
