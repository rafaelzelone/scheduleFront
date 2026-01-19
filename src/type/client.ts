
export interface Cliente {
  id: string;
  CEP: string;
  street: string;
  number: number;
  complement?: string;
  neighboor?: string;
  city: string;
  state: string;
  userId: string;
  createdAt: string;
  status?: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
    log: boolean;
    schedule: boolean;
  };
}