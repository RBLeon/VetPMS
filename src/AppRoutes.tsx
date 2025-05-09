import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { RoleSelectionPage } from "./features/role-selection/RoleSelectionPage";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardView } from "./features/dashboard/DashboardView";
import { AppointmentScheduler } from "./features/appointments/AppointmentScheduler";
import { ClientList } from "./features/clients/ClientList";
import { ClientForm } from "./features/clients/ClientForm";
import { ClientDetails } from "./features/clients/ClientDetails";
import { PatientList } from "./features/patients/PatientList";
import { PatientForm } from "./features/patients/PatientForm";
import { PatientDetails } from "./features/patients/PatientDetails";
import { Calendar } from "./features/calendar/Calendar";
import { AppointmentForm } from "./features/appointments/AppointmentForm";
import { ProtectedRouteComponent } from "./components/auth/ProtectedRouteComponent";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="role-selection" element={<RoleSelectionPage />} />

      {/* Protected routes inside Modern AppLayout */}
      <Route
        path="/"
        element={
          <ProtectedRouteComponent>
            <AppLayout />
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
        <Route path="calendar" element={<Calendar />} />
        <Route path="calendar/new" element={<AppointmentForm />} />
        <Route path="calendar/:id/edit" element={<AppointmentForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
