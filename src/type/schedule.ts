export type Schedule = {
  id: string;
  date: string;
  status: string;
  customer: { name: string };
  room: { name: string };
};