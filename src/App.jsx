import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Navbar from "./components/layout/Navbar";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OAuth2CallbackPage from "./pages/OAuth2CallbackPage";
import DashboardPage from "./pages/DashboardPage";
import ConverterPage from "./pages/ConverterPage";
import ComparePage from "./pages/ComparePage";
import ArithmeticPage from "./pages/ArithmeticPage";
import HistoryPage from "./pages/HistoryPage";

import "./App.css";

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    <main className="app-main">{children}</main>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/oauth2/callback" element={<OAuth2CallbackPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout><DashboardPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/convert"
            element={
              <ProtectedRoute>
                <AppLayout><ConverterPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <AppLayout><ComparePage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/arithmetic"
            element={
              <ProtectedRoute>
                <AppLayout><ArithmeticPage /></AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <AppLayout><HistoryPage /></AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;