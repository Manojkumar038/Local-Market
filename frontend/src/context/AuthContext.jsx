// ...existing code...
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const AuthContext = createContext(null);

const parseExpiry = (val) => {
  if (!val) return null;
  const n = Number(val);
  if (!Number.isNaN(n)) return n;
  const parsed = Date.parse(val);
  return Number.isNaN(parsed) ? null : parsed;
};

export const AuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem("token");
  const expiryFromStorage = localStorage.getItem("expiryTime");

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const logoutTimer = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  const logout = () => {
    clearLogoutTimer();
    localStorage.removeItem("token");
    localStorage.removeItem("expiryTime");
    setToken(null);
    setUser(null);
  };

  const scheduleAutoLogout = (expiryTs) => {
    clearLogoutTimer();
    if (!expiryTs) return;
    const remaining = expiryTs - Date.now();
    if (remaining <= 0) {
      logout();
      return;
    }
    logoutTimer.current = setTimeout(() => {
      logout();
    }, remaining);
  };

  const login = (tokenValue, expiryTime) => {
    let expiry = null;
    if (typeof expiryTime === "number") expiry = expiryTime;
    else if (expiryTime instanceof Date) expiry = expiryTime.getTime();
    else if (typeof expiryTime === "string") {
      const n = Number(expiryTime);
      expiry = !Number.isNaN(n) ? n : Date.parse(expiryTime);
    }

    if (!expiry) expiry = Date.now() + 5 * 24 * 60 * 60 * 1000;

    localStorage.setItem("token", tokenValue);
    localStorage.setItem("expiryTime", String(expiry));
    setToken(tokenValue);
    scheduleAutoLogout(expiry);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedExpiry = parseExpiry(localStorage.getItem("expiryTime"));

    if (storedToken && storedExpiry) {
      if (Date.now() >= storedExpiry) {
        logout();
      } else {
        setToken(storedToken); 
        scheduleAutoLogout(storedExpiry);
      }
    }
  }, []);


  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
