import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("alumni_token"));
  const [loading, setLoading] = useState(true);

  // On mount, validate stored token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/v1/alumni/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.alumni);
      } catch {
        // Token is invalid or expired
        localStorage.removeItem("alumni_token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post("/api/v1/auth/login", { email, password });
    const { token: newToken, alumni } = res.data;
    localStorage.setItem("alumni_token", newToken);
    setToken(newToken);
    setUser(alumni);
    return res.data;
  };

  const register = async (data) => {
    const res = await axios.post("/api/v1/auth/register", data);
    return res.data; // No token returned — registration is pending approval
  };

  const setPasswordFn = async (tokenValue, password) => {
    const res = await axios.post("/api/v1/auth/set-password", {
      token: tokenValue,
      password,
    });
    const { token: newToken, alumni } = res.data;
    localStorage.setItem("alumni_token", newToken);
    setToken(newToken);
    setUser(alumni);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("alumni_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        setPasswordFn,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
