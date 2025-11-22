// Save user object to localStorage
export const saveUser = (data) =>
  localStorage.setItem("user", JSON.stringify(data));

// Load user object from localStorage
export const loadUser = () =>
  JSON.parse(localStorage.getItem("user")) || null;

// Remove user from localStorage
export const clearUser = () => localStorage.removeItem("user");