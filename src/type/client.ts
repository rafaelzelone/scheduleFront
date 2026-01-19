
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
  permissoes?: {
    agendamentos: boolean;
    logs: boolean;
  };
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    active: boolean;
  };
}