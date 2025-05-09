import React from "react";
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
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppointmentProvider } from "./lib/context/AppointmentContext";
import { ClientProvider } from "./lib/context/ClientContext";
import { PatientProvider } from "./lib/context/PatientContext";
import { TaskProvider } from "./lib/context/TaskContext";
import { MedicationProvider } from "./lib/context/MedicationContext";
import { RevenueProvider } from "./lib/context/RevenueContext";
import { StaffProvider } from "./lib/context/StaffContext";
import { TestResultProvider } from "./lib/context/TestResultContext";
import { InventoryProvider } from "./lib/context/InventoryContext";
import { AppRoutes } from "./AppRoutes";
import { ClientList } from "./features/clients/ClientList";
import { ClientForm } from "./features/clients/ClientForm";
import { ClientDetails } from "./features/clients/ClientDetails";
import { PatientList } from "@/features/patients/PatientList";
import { PatientForm } from "@/features/patients/PatientForm";
import { PatientDetails } from "@/features/patients/PatientDetails";
import { Calendar } from "@/features/calendar/Calendar";
import { AppointmentForm } from "@/features/calendar/AppointmentForm";
import RoleSelectionPage from "./features/role-selection/RoleSelectionPage";

// Protected route component that redirects to login if user is not authenticated
const ProtectedRouteComponent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <UiProvider>
            <RoleProvider>
              <BrowserRouter>
                <AppointmentProvider>
                  <ClientProvider>
                    <PatientProvider>
                      <TaskProvider>
                        <MedicationProvider>
                          <RevenueProvider>
                            <StaffProvider>
                              <TestResultProvider>
                                <InventoryProvider>
                                  <Routes>
                                    <Route
                                      path="login"
                                      element={<LoginPage />}
                                    />
                                    <Route
                                      path="role-selection"
                                      element={<RoleSelectionPage />}
                                    />

                                    {/* Protected routes inside Modern AppLayout */}
                                    <Route
                                      path="/"
                                      element={
                                        <ProtectedRouteComponent>
                                          <AppLayout />
                                        </ProtectedRouteComponent>
                                      }
                                    >
                                      <Route
                                        index
                                        element={<DashboardView />}
                                      />
                                      <Route
                                        path="appointments"
                                        element={<AppointmentScheduler />}
                                      />
                                      <Route
                                        path="clients"
                                        element={<ClientList />}
                                      />
                                      <Route
                                        path="clients/new"
                                        element={<ClientForm />}
                                      />
                                      <Route
                                        path="clients/:id"
                                        element={<ClientDetails />}
                                      />
                                      <Route
                                        path="clients/:id/edit"
                                        element={<ClientForm />}
                                      />
                                      <Route
                                        path="patients"
                                        element={<PatientList />}
                                      />
                                      <Route
                                        path="patients/new"
                                        element={<PatientForm />}
                                      />
                                      <Route
                                        path="patients/:id"
                                        element={<PatientDetails />}
                                      />
                                      <Route
                                        path="patients/:id/edit"
                                        element={<PatientForm />}
                                      />
                                      <Route
                                        path="calendar"
                                        element={<Calendar />}
                                      />
                                      <Route
                                        path="calendar/new"
                                        element={<AppointmentForm />}
                                      />
                                      <Route
                                        path="calendar/:id/edit"
                                        element={<AppointmentForm />}
                                      />
                                      <Route
                                        path="*"
                                        element={<Navigate to="/" replace />}
                                      />
                                    </Route>
                                  </Routes>
                                </InventoryProvider>
                              </TestResultProvider>
                            </StaffProvider>
                          </RevenueProvider>
                        </MedicationProvider>
                      </TaskProvider>
                    </PatientProvider>
                  </ClientProvider>
                </AppointmentProvider>
              </BrowserRouter>
            </RoleProvider>
          </UiProvider>
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
