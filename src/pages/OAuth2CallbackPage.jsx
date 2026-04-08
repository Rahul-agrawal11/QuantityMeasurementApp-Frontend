// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// // Spring Boot redirects here after Google OAuth2:
// // e.g. http://localhost:3000/oauth2/callback?token=eyJ...
// const OAuth2CallbackPage = () => {
//   const { saveToken } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("token");
//     if (token) {
//       saveToken(token);
//       navigate("/dashboard", { replace: true });
//     } else {
//       navigate("/login?error=oauth_failed", { replace: true });
//     }
//   }, [saveToken, navigate]);

//   return (
//     <div style={{
//       minHeight: "100vh", display: "flex", alignItems: "center",
//       justifyContent: "center", flexDirection: "column", gap: "1rem",
//       background: "var(--bg)", color: "var(--text)"
//     }}>
//       <div style={{ fontSize: "2rem" }}>⚗️</div>
//       <p style={{ color: "var(--text-muted)" }}>Completing sign in...</p>
//     </div>
//   );
// };

// export default OAuth2CallbackPage;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Spring Boot redirects here after Google OAuth2:
// e.g. http://localhost:3000/oauth2/callback?token=eyJ...
const OAuth2CallbackPage = () => {
  const { saveToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      // Write to localStorage FIRST so ProtectedRoute sees it immediately
      localStorage.setItem("jwt_token", token);
      saveToken(token);
      // Small delay to let AuthContext state update before ProtectedRoute checks it
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    } else {
      navigate("/login?error=oauth_failed", { replace: true });
    }
  }, [saveToken, navigate]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", flexDirection: "column", gap: "1rem",
      background: "var(--bg)", color: "var(--text)"
    }}>
      <div style={{ fontSize: "2rem" }}>⚗️</div>
      <p style={{ color: "var(--text-muted)" }}>Completing sign in...</p>
    </div>
  );
};

export default OAuth2CallbackPage;