// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // Also check localStorage directly as fallback for OAuth2 redirect timing
  const hasToken = isAuthenticated || !!localStorage.getItem("jwt_token");
  return hasToken ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;