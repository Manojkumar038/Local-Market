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

export const UserAuthProvider = ({ children }) => {
  const tokenFromStorage = localStorage.getItem("userToken");
  const expiryFromStorage = localStorage.getItem("expiryTime");

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(tokenFromStorage);
  const logoutTimer = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  const logout = () => {
    clearLogoutTimer();
    localStorage.clear();
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
    logoutTimer.current = setTimeout(logout, remaining);
  };

  const login = (tokenValue, userData = null, expiryTime) => {
    let expiry = null;

    if (typeof expiryTime === "number") expiry = expiryTime;
    else if (expiryTime instanceof Date) expiry = expiryTime.getTime();
    else if (expiryTime) expiry = Date.parse(expiryTime);

    if (!expiry) expiry = Date.now() + 5 * 60 * 60 * 1000;

    localStorage.setItem("userToken", tokenValue);
    localStorage.setItem("expiryTime", String(expiry));

    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
    }

    setToken(tokenValue);
    scheduleAutoLogout(expiry);
  };

  useEffect(() => {
    const expiryTs = parseExpiry(expiryFromStorage);

    if (tokenFromStorage && expiryTs) {
      if (Date.now() >= expiryTs) {
        logout();
      } else {
        scheduleAutoLogout(expiryTs);
      }
    }

    return () => clearLogoutTimer();
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within UserAuthProvider");
  }
  return ctx;
};
