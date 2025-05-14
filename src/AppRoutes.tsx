import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRole } from "@/lib/context/RoleContext";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import { NotFoundPage } from "@/features/layout/pages/NotFoundPage";
import RoleSelectionPage from "@/features/role-selection/RoleSelectionPage";
import { Layout } from "@/features/layout/components/Layout";
import AppointmentScheduler from "@/features/appointments/components/AppointmentScheduler";
import { AppointmentForm } from "@/features/appointments/components/AppointmentForm";
import { PatientsPage } from "@/features/patients/pages/PatientsPage";
import { PatientForm } from "@/features/patients/PatientForm";
import { TasksPage } from "@/features/tasks/pages/TasksPage";
import { SearchPage } from "@/features/search/pages/SearchPage";
import { AnalyticsPage } from "@/features/analytics/pages/AnalyticsPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { BillingPage } from "@/features/billing/pages/BillingPage";
import { MedicalRecordsPage } from "@/features/medical-records/pages/MedicalRecordsPage";
import { MedicalRecordForm } from "@/features/medical-records/MedicalRecordForm";
import { FollowUpForm } from "@/features/medical-records/FollowUpForm";
import { ClientsPage } from "@/features/clients/pages/ClientsPage";
import { ClientForm } from "@/features/clients/ClientForm";

// Wrapper components to handle form navigation and state
const AppointmentFormWrapper = () => {
  const navigate = useNavigate();
  const appointmentTypes = [
    { id: "1", name: "Controle", color: "#22c55e", defaultDuration: 30 },
    { id: "2", name: "Operatie", color: "#ef4444", defaultDuration: 90 },
    { id: "3", name: "Vaccinatie", color: "#3b82f6", defaultDuration: 15 },
    { id: "4", name: "Tandheelkunde", color: "#f97316", defaultDuration: 60 },
    { id: "5", name: "Spoedgeval", color: "#dc2626", defaultDuration: 45 },
  ];

  return (
    <AppointmentForm
      appointmentTypes={appointmentTypes}
      onSubmit={() => {
        navigate("/appointments");
      }}
      onCancel={() => navigate("/appointments")}
    />
  );
};

const MedicalRecordFormWrapper = () => {
  const { patientId } = useParams();
  return <MedicalRecordForm patientId={patientId || ""} defaultValues={{}} />;
};

const FollowUpFormWrapper = () => {
  const navigate = useNavigate();
  return (
    <FollowUpForm
      recordDate={new Date().toISOString()}
      onSchedule={() => {
        navigate("/medical-records");
      }}
      onCancel={() => navigate("/medical-records")}
    />
  );
};

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { role } = useRole();
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
            <Navigate to="/login" replace />
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
        {/* Appointments routes */}
        <Route path="appointments">
          <Route index element={<AppointmentScheduler />} />
          <Route path="new" element={<AppointmentFormWrapper />} />
        </Route>
        {/* Patients routes */}
        <Route path="patients">
          <Route index element={<PatientsPage />} />
          <Route path="new" element={<PatientForm />} />
          <Route path=":patientId/records">
            <Route index element={<MedicalRecordsPage />} />
            <Route path="new" element={<MedicalRecordFormWrapper />} />
            <Route
              path=":recordId/follow-up"
              element={<FollowUpFormWrapper />}
            />
          </Route>
        </Route>
        {/* Clients routes */}
        <Route path="clients">
          <Route index element={<ClientsPage />} />
          <Route path="new" element={<ClientForm />} />
        </Route>
        {/* Medical Records routes */}
        <Route path="medical-records">
          <Route index element={<MedicalRecordsPage />} />
        </Route>
        {/* Other main routes */}
        <Route path="tasks" element={<TasksPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="billing" element={<BillingPage />} />
      </Route>
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
