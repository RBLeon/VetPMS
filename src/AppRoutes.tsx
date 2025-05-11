import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRole } from "@/lib/context/RoleContext";
import { LoginPage } from "@/pages/auth/LoginPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import RoleSelectionPage from "@/features/role-selection/RoleSelectionPage";
import { Layout } from "@/components/layout/Layout";

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { role } = useRole();

  // Helper function to determine if we should show protected routes
  const shouldShowProtectedRoutes = isAuthenticated && role;

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          !isAuthenticated ? (
            <LoginPage />
          ) : (
            <Navigate to="/role-selection" replace />
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          !isAuthenticated ? (
            <ForgotPasswordPage />
          ) : (
            <Navigate to="/role-selection" replace />
          )
        }
      />
      <Route
        path="/reset-password"
        element={
          !isAuthenticated ? (
            <ResetPasswordPage />
          ) : (
            <Navigate to="/role-selection" replace />
          )
        }
      />
      <Route
        path="/role-selection"
        element={
          isAuthenticated && !role ? (
            <RoleSelectionPage />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          shouldShowProtectedRoutes ? (
            <Layout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<DashboardPage />} />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
