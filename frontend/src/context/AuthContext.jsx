import { createContext, useState, useEffect } from "react";
import { refreshToken } from "../api/authApi";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Auto-refresh login
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await refreshToken();
        setUser(res.data.user);
      } catch {}
    }
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}