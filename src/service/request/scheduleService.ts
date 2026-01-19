import { api } from "./api";

export function getSchedules(params: {
  page: number;
  pageSize: number;
  customerName?: string;
  date?: string;
}) {
  return api.get("/schedules", { params });
}

export function cancelSchedule(id: string) {
  return api.patch(`/schedules/${id}/cancel`);
}

export function confirmSchedule(id: string) {
  return api.patch(`/schedules/${id}/confirm`);
}


export function createSchedule(payload: { date: string; time: string; roomId: string }) {
  return api.post("/schedules", payload);
}