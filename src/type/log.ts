export type Log = {
  id: string;
  typeActivity: TypeActivity;
  page: PageData;
  createdAt: string;
  logUser: {
    firstName: string;
    lastName: string;
    email: string;
    admin: boolean;
  };
  logCustomer: {
    CEP: string;
    street: string;
    number: number;
    city: string;
    state: string;
  };
};


export const PageData = {
  SCHEDULE: "SCHEDULE",
  MYACCOUNT: "MYACCOUNT",
} as const;

export type PageData = typeof PageData[keyof typeof PageData];

export const PageLabel: Record<PageData, string> = {
  [PageData.SCHEDULE]: "Agendamentos",
  [PageData.MYACCOUNT]: "Minha Conta",
};

export const TypeActivity = {
  CREATESCHEDULE: "CREATESCHEDULE",
  CONFIRMSCHEDULE: "CONFIRMSCHEDULE",
  CREATEACCOUNT: "CREATEACCOUNT",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  CANCELASCHEDULE: "CANCELASCHEDULE",
  UPDATEEMAIL: "UPDATEEMAIL",
  UPDATEADRESS: "UPDATEADRESS",
} as const;

export type TypeActivity =
  typeof TypeActivity[keyof typeof TypeActivity];


export const ActivityLabel: Record<TypeActivity, string> = {
  [TypeActivity.CREATESCHEDULE]: "Criou um agendamento",
  [TypeActivity.CONFIRMSCHEDULE]: "Confirmou o agendamento",
  [TypeActivity.CANCELASCHEDULE]: "Cancelou o agendamento",
  [TypeActivity.CREATEACCOUNT]: "Criou a conta",
  [TypeActivity.LOGIN]: "Login",
  [TypeActivity.LOGOUT]: "Logout",
  [TypeActivity.UPDATEEMAIL]: "Atualizou o e-mail",
  [TypeActivity.UPDATEADRESS]: "Atualizou o endereço",
};