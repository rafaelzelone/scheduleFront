
export type Log = {
  id: string;
  typeActivity: string;
  page: string;
  createdAt: string;
  logUser: {
    firstName: string;
    lastName: string;
    email: string;
  };
  logCustomer: {
    CEP: string;
    street: string;
    number: number;
    city: string;
    state: string;
  };
};