import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("alumni_token"));
  const [admin, setAdmin] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem("admin_token"));
  const [loading, setLoading] = useState(true);

  // On mount, validate stored tokens
  useEffect(() => {
    const verifyTokens = async () => {
      setLoading(true);

      // 1. Verify Alumni Token
      if (token) {
        try {
          const res = await axios.get("/api/v1/alumni/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data.alumni);
        } catch {
          localStorage.removeItem("alumni_token");
          setToken(null);
          setUser(null);
        }
      }

      // 2. Verify Admin Token
      if (adminToken) {
        try {
          const res = await axios.get("/api/v1/admin/me", {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          setAdmin(res.data.admin);
        } catch {
          localStorage.removeItem("admin_token");
          setAdminToken(null);
          setAdmin(null);
        }
      }

      setLoading(false);
    };

    verifyTokens();
  }, [token, adminToken]);

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
    return res.data;
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

  // ── Admin Functions ──────────────────────

  const adminSendOtp = async (email) => {
    const res = await axios.post("/api/v1/admin/request-otp", { email });
    return res.data;
  };

  const adminVerifyOtp = async (email, otp) => {
    const res = await axios.post("/api/v1/admin/verify-otp", { email, otp });
    const { token: newToken, admin: adminData } = res.data;
    localStorage.setItem("admin_token", newToken);
    setAdminToken(newToken);
    setAdmin(adminData);
    return res.data;
  };

  const adminLogout = () => {
    localStorage.removeItem("admin_token");
    setAdminToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        admin,
        adminToken,
        loading,
        isAuthenticated: !!user,
        isAdminAuthenticated: !!admin,
        login,
        register,
        setPasswordFn,
        logout,
        adminSendOtp,
        adminVerifyOtp,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
