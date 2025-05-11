import { Routes, Route, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import LoginPage from "@/features/auth/LoginPage";
import { DashboardView } from "@/components/dashboard/DashboardView";
import AppointmentScheduler from "@/features/appointments/AppointmentScheduler";
import { ClientList } from "@/features/clients/ClientList";
import { ClientForm } from "@/features/clients/ClientForm";
import { ClientDetails } from "@/features/clients/ClientDetails";
import { PatientList } from "@/features/patients/PatientList";
import { PatientForm } from "@/features/patients/PatientForm";
import { PatientDetails } from "@/features/patients/PatientDetails";
import { AppointmentForm } from "@/features/calendar/AppointmentForm";
import RoleSelectionPage from "@/features/role-selection/RoleSelectionPage";
import { ProtectedRouteComponent } from "@/components/auth/ProtectedRoute";

export function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="role-selection" element={<RoleSelectionPage />} />

      {/* Protected routes inside Layout */}
      <Route
        path="/"
        element={
          <ProtectedRouteComponent>
            <Layout />
          </ProtectedRouteComponent>
        }
      >
        <Route index element={<DashboardView />} />
        <Route path="appointments" element={<AppointmentScheduler />} />
        <Route path="clients" element={<ClientList />} />
        <Route path="clients/new" element={<ClientForm />} />
        <Route path="clients/:id" element={<ClientDetails />} />
        <Route path="clients/:id/edit" element={<ClientForm />} />
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/new" element={<PatientForm />} />
        <Route path="patients/:id" element={<PatientDetails />} />
        <Route path="patients/:id/edit" element={<PatientForm />} />
        <Route
          path="appointments/new"
          element={
            <AppointmentForm
              onSubmit={(data) => {
                console.log("Form submitted:", data);
                navigate("/appointments");
              }}
              onCancel={() => navigate("/appointments")}
            />
          }
        />
        <Route
          path="appointments/:id"
          element={
            <AppointmentForm
              onSubmit={(data) => {
                console.log("Form submitted:", data);
                navigate("/appointments");
              }}
              onCancel={() => navigate("/appointments")}
            />
          }
        />
      </Route>
    </Routes>
  );
}
