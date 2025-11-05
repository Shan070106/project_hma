import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, signup as signupApi, me as meApi } from "../services/authService";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // {id, name, email}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }
    meApi()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { user, token } = await loginApi({ email, password });
    localStorage.setItem("token", token);
    setUser(user);
  };

  const signup = async (name, email, password) => {
    const { user, token } = await signupApi({ name, email, password });
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
