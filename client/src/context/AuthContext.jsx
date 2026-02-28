import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user,         setUser]         = useState(null);
  const [admin,        setAdmin]        = useState(null);
  const [adminToken,   setAdminToken]   = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [avatarVersion, setAvatarVersion] = useState(0); // bumped after every profile save

  useEffect(() => {
    const verifyTokens = async () => {
      const storedAlumniToken = localStorage.getItem("alumni_token");
      const storedAdminToken  = localStorage.getItem("admin_token");

      if (storedAlumniToken) {
        try {
          const res = await axios.get("/api/auth/alumni/info", {
            headers: { Authorization: `Bearer ${storedAlumniToken}` },
          });
          setUser(res.data.data);
        } catch {
          localStorage.removeItem("alumni_token");
          setUser(null);
        }
      }

      if (storedAdminToken) {
        try {
          const payload = JSON.parse(atob(storedAdminToken.split(".")[1]));
          if (payload.exp * 1000 > Date.now()) {
            const infoRes = await axios.get("/api/auth/admin/info", {
              headers: { Authorization: `Bearer ${storedAdminToken}` },
            });
            const adminInfo = infoRes.data.data;
            setAdmin({
              email: adminInfo.email,
              name: adminInfo.full_name,
              role: payload.role,
              id: adminInfo._id,
            });
            setAdminToken(storedAdminToken);
          } else {
            localStorage.removeItem("admin_token");
          }
        } catch {
          localStorage.removeItem("admin_token");
        }
      }

      setLoading(false);
    };

    verifyTokens();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    const { token } = res.data.data;
    localStorage.setItem("alumni_token", token);

    try {
      const infoRes = await axios.get("/api/auth/alumni/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(infoRes.data.data);
    } catch {
      setUser(res.data.data.alumni);
    }

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("alumni_token");
    setUser(null);
  };

  /**
   * Call after a successful profile save.
   * Merges new fields into user state AND bumps avatarVersion so
   * any component depending on avatarVersion (e.g. AlumniNavbar)
   * knows to re-fetch the latest profile from the API.
   */
  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
    setAvatarVersion((v) => v + 1); // ← this is the reliable re-fetch trigger
  };

  // ───────── Admin ─────────

  const adminSendOtp = async (email) => {
    const res = await axios.post("/api/auth/admin/init", { email });
    return res.data;
  };

  const adminVerifyOtp = async (email, otp) => {
    const res = await axios.post("/api/auth/admin/otp", { email, otp });
    const { token } = res.data.data;

    localStorage.setItem("admin_token", token);
    const payload = JSON.parse(atob(token.split(".")[1]));

    try {
      const infoRes = await axios.get("/api/auth/admin/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const adminInfo = infoRes.data.data;
      setAdmin({ email: adminInfo.email, name: adminInfo.full_name, role: payload.role, id: adminInfo._id });
    } catch {
      setAdmin({ email, role: payload.role, id: payload.id });
    }

    setAdminToken(token);

    return res.data;
  };

  const updateAdmin = (newData) => {
    setAdmin((prev) => ({ ...prev, ...newData }));
  };

  const adminLogout = () => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
    setAdminToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        adminToken,
        loading,
        avatarVersion,      // ← expose so navbar can depend on it
        isAuthenticated:      !!user,
        isAdminAuthenticated: !!admin,
        login,
        logout,
        updateUser,
        adminSendOtp,
        adminVerifyOtp,
        updateAdmin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;