import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Refine } from "@refinedev/core";
import routerBindings, {
  UnsavedChangesNotifier,
  NavigateToResource,
} from "@refinedev/react-router-v6";
import { RefineKbar } from "@refinedev/kbar";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRole } from "@/lib/context/RoleContext";
import { useTenant } from "@/lib/context/TenantContext";
import { LoginPage } from "@/pages/auth/LoginPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import RoleSelectionPage from "@/features/role-selection/RoleSelectionPage";
import { Layout } from "@/components/layout/Layout";
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
import { dataProvider } from "@/lib/data-providers/supabase-data-provider";
import { authProvider } from "@/providers/auth-provider";
import { notificationProvider } from "@/providers/notification-provider";
import { accessControlProvider } from "@/providers/access-control-provider";
import { ClientListPage } from "@/features/clients/ClientListPage";

// Wrapper components to handle form navigation and state
const AppointmentFormWrapper = () => {
  const navigate = useNavigate();
  return (
    <AppointmentForm
      onSubmit={() => {
        navigate("/appointments");
      }}
      onCancel={() => navigate("/appointments")}
    />
  );
};

const MedicalRecordFormWrapper = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  return (
    <MedicalRecordForm
      onSubmit={() => {
        navigate(`/patients/${patientId}/records`);
      }}
      onCancel={() => navigate(`/patients/${patientId}/records`)}
    />
  );
};

const FollowUpFormWrapper = () => {
  const navigate = useNavigate();
  const { patientId, recordId } = useParams();
  return (
    <FollowUpForm
      onSubmit={() => {
        navigate(`/patients/${patientId}/records`);
      }}
      onCancel={() => navigate(`/patients/${patientId}/records`)}
    />
  );
};

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const { role } = useRole();
  const { currentTenant } = useTenant();
  const shouldShowProtectedRoutes = isAuthenticated && role;

  return (
    <Refine
      dataProvider={dataProvider}
      authProvider={authProvider}
      notificationProvider={notificationProvider}
      accessControlProvider={accessControlProvider}
      routerProvider={routerBindings}
      resources={[
        {
          name: "dashboard",
          list: "/",
          meta: {
            label: "Dashboard",
            icon: "Dashboard",
            canAccess: [
              "CEO",
              "MANAGER",
              "VETERINARIAN",
              "NURSE",
              "RECEPTIONIST",
            ],
          },
        },
        {
          name: "clients",
          list: "/clients",
          create: "/clients/new",
          edit: "/clients/:id/edit",
          show: "/clients/:id",
          meta: {
            label: "Clients",
            icon: "People",
            canAccess: [
              "CEO",
              "MANAGER",
              "VETERINARIAN",
              "NURSE",
              "RECEPTIONIST",
            ],
            tenant: currentTenant?.id,
          },
        },
        {
          name: "patients",
          list: "/patients",
          create: "/patients/new",
          edit: "/patients/:id/edit",
          show: "/patients/:id",
          meta: {
            label: "Patients",
            icon: "Pets",
            canAccess: [
              "CEO",
              "MANAGER",
              "VETERINARIAN",
              "NURSE",
              "RECEPTIONIST",
            ],
            tenant: currentTenant?.id,
          },
        },
        {
          name: "appointments",
          list: "/appointments",
          create: "/appointments/new",
          edit: "/appointments/:id/edit",
          show: "/appointments/:id",
          meta: {
            label: "Appointments",
            icon: "Calendar",
            canAccess: [
              "CEO",
              "MANAGER",
              "VETERINARIAN",
              "NURSE",
              "RECEPTIONIST",
            ],
            tenant: currentTenant?.id,
          },
        },
        {
          name: "medical-records",
          list: "/medical-records",
          create: "/patients/:patientId/records/new",
          edit: "/patients/:patientId/records/:id/edit",
          show: "/patients/:patientId/records/:id",
          meta: {
            label: "Medical Records",
            icon: "MedicalRecords",
            canAccess: ["CEO", "MANAGER", "VETERINARIAN", "NURSE"],
            tenant: currentTenant?.id,
          },
        },
        {
          name: "billing",
          list: "/billing",
          create: "/billing/new",
          edit: "/billing/:id/edit",
          show: "/billing/:id",
          meta: {
            label: "Billing",
            icon: "Money",
            canAccess: ["CEO", "MANAGER", "RECEPTIONIST"],
            tenant: currentTenant?.id,
          },
        },
        {
          name: "tasks",
          list: "/tasks",
          meta: {
            label: "Tasks",
            icon: "Task",
            canAccess: [
              "CEO",
              "MANAGER",
              "VETERINARIAN",
              "NURSE",
              "RECEPTIONIST",
            ],
            tenant: currentTenant?.id,
          },
        },
        {
          name: "analytics",
          list: "/analytics",
          meta: {
            label: "Analytics",
            icon: "Analytics",
            canAccess: ["CEO", "MANAGER"],
            tenant: currentTenant?.id,
          },
        },
        {
          name: "settings",
          list: "/settings",
          meta: {
            label: "Settings",
            icon: "Settings",
            canAccess: ["CEO", "MANAGER"],
            tenant: currentTenant?.id,
          },
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
        liveMode: "auto",
        reactQuery: {
          defaultOptions: {
            queries: {
              staleTime: 5 * 60 * 1000, // 5 minutes
              retry: 1,
            },
          },
        },
        mutationMode: "optimistic",
        disableTelemetry: true,
        meta: {
          tenant_id: currentTenant?.id,
        },
      }}
    >
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
            <Route index element={<ClientListPage />} />
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
      <RefineKbar />
      <UnsavedChangesNotifier />
    </Refine>
  );
};
