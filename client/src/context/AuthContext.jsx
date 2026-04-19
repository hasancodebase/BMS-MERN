import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMe = async () => {
      try {
        if (localStorage.getItem("token")) { const { data } = await api.get("/auth/profile"); setUser(data); }
      } catch { localStorage.removeItem("token"); }
      finally { setLoading(false); }
    };
    fetchMe();
  }, []);
  const login = (token, userData) => { localStorage.setItem("token", token); setUser(userData); };
  const logout = () => { localStorage.removeItem("token"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => useContext(AuthContext);
