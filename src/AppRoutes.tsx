import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRole } from "@/lib/context/RoleContext";
import { LoginPage } from "@/pages/auth/LoginPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import RoleSelectionPage from "@/features/role-selection/RoleSelectionPage";
import { Layout } from "@/components/layout/Layout";

// Import page components
import { AppointmentsPage } from "@/pages/appointments/AppointmentsPage";
import AppointmentScheduler from "@/features/appointments/AppointmentScheduler";
import { AppointmentForm } from "@/features/appointments/AppointmentForm";
import { PatientsPage } from "@/pages/patients/PatientsPage";
import { PatientForm } from "@/features/patients/PatientForm";
import { TasksPage } from "@/pages/tasks/TasksPage";
import { SearchPage } from "@/pages/search/SearchPage";
import { AnalyticsPage } from "@/pages/analytics/AnalyticsPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { BillingPage } from "@/pages/billing/BillingPage";
import { MedicalRecordsPage } from "@/pages/medical-records/MedicalRecordsPage";
import { MedicalRecordForm } from "@/features/medical-records/MedicalRecordForm";
import { FollowUpForm } from "@/features/medical-records/FollowUpForm";
import { ClientsPage } from "@/pages/clients/ClientsPage";
import { ClientForm } from "@/features/clients/ClientForm";

// Wrapper components to handle form navigation and state
const AppointmentFormWrapper = () => {
  const navigate = useNavigate();
  return (
    <AppointmentForm
      onSubmit={(data) => {
        // Handle appointment creation
        navigate("/appointments");
      }}
      onCancel={() => navigate("/appointments")}
    />
  );
};

const MedicalRecordFormWrapper = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  return <MedicalRecordForm patientId={patientId || ""} defaultValues={{}} />;
};

const FollowUpFormWrapper = () => {
  const navigate = useNavigate();
  const { recordId } = useParams();
  return (
    <FollowUpForm
      recordDate={new Date().toISOString()}
      onSchedule={(data) => {
        // Handle follow-up scheduling
        navigate("/medical-records");
      }}
      onCancel={() => navigate("/medical-records")}
    />
  );
};

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
