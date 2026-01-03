import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../services/api";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        return jwtDecode(token);
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = async (form) => {
    const res = await API.post("/auth/login", form);
    localStorage.setItem("token", res.data.token);
    setUser(jwtDecode(res.data.token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
