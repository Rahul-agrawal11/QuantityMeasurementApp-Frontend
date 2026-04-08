import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("jwt_token"));
  const [user, setUser] = useState(null);

  // On mount: check if token came in via URL params (OAuth2 redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      localStorage.setItem("jwt_token", urlToken);
      setToken(urlToken);
      // Clean up token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Decode basic info from JWT payload (email)
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ email: payload.sub || payload.email });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const saveToken = (newToken) => {
    localStorage.setItem("jwt_token", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, saveToken, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);