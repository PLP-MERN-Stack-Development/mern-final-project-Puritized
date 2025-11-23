import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { saveUser, loadUser, clearUser } from "../services/storage.js";

const AuthContext = createContext();

// Backend URL
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://mern-final-project-puritized.onrender.com";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser());
  const [loading, setLoading] = useState(!user);

  useEffect(() => {
    const fetchUser = async () => {
      const savedUser = loadUser();

      if (!savedUser?.token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${BACKEND_URL}/routes/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedUser.token}`,
          },
          withCredentials: true,
        });

        const fetchedUser = res?.data?.user || null;
        setUser(fetchedUser);

        if (fetchedUser) {
          // Preserve token in localStorage
          saveUser({ ...fetchedUser, token: savedUser.token });
        }
      } catch (err) {
        setUser(null);
        clearUser();
        console.error(
          "Fetch current user failed:",
          err.response?.status,
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (!user) fetchUser();
    else setLoading(false);
  }, [user]);

  const login = (userData, token) => {
    const userWithToken = { ...userData, token };
    setUser(userWithToken);
    saveUser(userWithToken);
  };

  const logout = async () => {
    try {
      if (user?.token) {
        await axios.post(
          `${BACKEND_URL}/routes/auth/logout`,
          {},
          { headers: { Authorization: `Bearer ${user.token}` }, withCredentials: true }
        );
      }

      setUser(null);
      clearUser();
    } catch (err) {
      console.error(
        "Logout failed:",
        err.response?.status,
        err.response?.data || err.message
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);