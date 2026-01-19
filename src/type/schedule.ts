import type { Cliente } from "./client";

export type Schedule = {
  id: string;
  date: string;
  status: string;
  customer: Cliente;
  room: { name: string };
};