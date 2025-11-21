export const saveUser = (data) =>
  localStorage.setItem("user", JSON.stringify(data));

export const loadUser = () =>
  JSON.parse(localStorage.getItem("user")) || null;

export const clearUser = () => localStorage.removeItem("user");