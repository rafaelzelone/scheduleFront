export const getToken = () => localStorage.getItem("token");

export const getUser = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const isLogged = () => !!getToken();

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};