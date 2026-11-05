/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const readUser = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return {
      token,
      username: localStorage.getItem("username") || "",
      emailId: localStorage.getItem("emailId") || "",
    };
  } catch {
    return null;
  }
};

const persist = (user) => {
  try {
    ["token", "username", "emailId"].forEach((k) =>
      user ? localStorage.setItem(k, user[k]) : localStorage.removeItem(k)
    );
  } catch {
    /* storage unavailable: session lasts until reload */
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const login = useCallback((next) => {
    persist(next);
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    persist(null);
    setUser(null);
  }, []);

  const setUsername = useCallback((username) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, username };
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ user, login, logout, setUsername }), [user, login, logout, setUsername]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
