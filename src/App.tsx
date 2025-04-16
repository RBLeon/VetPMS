import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/context/AuthContext";
import { TenantProvider } from "./lib/context/TenantContext";
import { UiProvider } from "./lib/context/UiContext";
import { RoleProvider } from "./lib/context/RoleContext";
import { AppLayout } from "./components/layout/AppLayout";
import LoginPage from "./features/auth/LoginPage";
import { DashboardView } from "./components/dashboard/DashboardView";
import AppointmentScheduler from "./features/appointments/AppointmentScheduler";
import "./App.css";

// Lazy-loaded components
const RoleBasedInterface = lazy(() => import('./features/role-interface/RoleBasedInterface'));

// Protected route component that redirects to login if user is not authenticated
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantProvider>
          <UiProvider>
            <RoleProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected routes inside Modern AppLayout */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DashboardView />} />
                  <Route path="appointments" element={<AppointmentScheduler />} />
                  <Route path="clients" element={<div>Clients Management (Coming Soon)</div>} />
                  <Route path="patients" element={<div>Patients Management (Coming Soon)</div>} />
                  <Route path="role-interface" element={<Suspense fallback={<div>Loading...</div>}><RoleBasedInterface /></Suspense>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </RoleProvider>
          </UiProvider>
        </TenantProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;