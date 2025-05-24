import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Refine } from "@refinedev/core";
import routerBindings from "@refinedev/react-router-v6";
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

// Wrapper components to handle form navigation and state
const AppointmentFormWrapper = () => {
  const navigate = useNavigate();
  return (
    <AppointmentForm
      onSubmit={() => navigate("/appointments")}
      onCancel={() => navigate("/appointments")}
    />
  );
};

const MedicalRecordFormWrapper = () => {
  return (
    <MedicalRecordForm
      patientId="default" // This should be set from URL params in a real implementation
    />
  );
};

const FollowUpFormWrapper = () => {
  const navigate = useNavigate();
  return (
    <FollowUpForm
      recordDate="2023-01-01" // This should be set from the actual record in a real implementation
      onSchedule={() => navigate("/medical-records")}
      onCancel={() => navigate("/medical-records")}
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
            icon: "Home",
            color:
              "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
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
            icon: "Users",
            color:
              "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
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
            icon: "Stethoscope",
            color:
              "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
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
          meta: {
            label: "Appointments",
            icon: "Calendar",
            color:
              "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
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
          create: "/medical-records/new",
          edit: "/medical-records/:id/edit",
          show: "/medical-records/:id",
          meta: {
            label: "Medical Records",
            icon: "FileText",
            color:
              "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
            canAccess: ["CEO", "MANAGER", "VETERINARIAN", "NURSE"],
            tenant: currentTenant?.id,
          },
        },
        {
          name: "tasks",
          list: "/tasks",
          meta: {
            label: "Tasks",
            icon: "CheckSquare",
            color:
              "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
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
          name: "billing",
          list: "/billing",
          meta: {
            label: "Billing",
            icon: "CreditCard",
            color:
              "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300",
            canAccess: ["CEO", "MANAGER", "RECEPTIONIST"],
            tenant: currentTenant?.id,
          },
        },
        {
          name: "analytics",
          list: "/analytics",
          meta: {
            label: "Analytics",
            icon: "BarChart3",
            color:
              "bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300",
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
            color:
              "bg-slate-100 text-slate-700 dark:bg-slate-900/20 dark:text-slate-300",
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
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      <Routes>
        {/* Unauthenticated routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={role ? "/" : "/role-selection"} />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? <Navigate to="/" /> : <ForgotPasswordPage />
          }
        />
        <Route
          path="/reset-password"
          element={
            isAuthenticated ? <Navigate to="/" /> : <ResetPasswordPage />
          }
        />

        {/* Role selection */}
        <Route
          path="/role-selection"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" />
            ) : role ? (
              <Navigate to="/" />
            ) : (
              <RoleSelectionPage />
            )
          }
        />

        {/* Authenticated routes */}
        {shouldShowProtectedRoutes && (
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/new" element={<ClientForm />} />
            <Route path="/clients/:id" element={<ClientForm />} />
            <Route path="/clients/:id/edit" element={<ClientForm />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientForm />} />
            <Route path="/patients/:id/edit" element={<PatientForm />} />
            <Route path="/appointments" element={<AppointmentScheduler />} />
            <Route
              path="/appointments/new"
              element={<AppointmentFormWrapper />}
            />
            <Route
              path="/appointments/:id/edit"
              element={<AppointmentFormWrapper />}
            />
            <Route path="/medical-records" element={<MedicalRecordsPage />} />
            <Route
              path="/medical-records/new"
              element={<MedicalRecordFormWrapper />}
            />
            <Route
              path="/medical-records/:id"
              element={<MedicalRecordFormWrapper />}
            />
            <Route
              path="/medical-records/:id/edit"
              element={<MedicalRecordFormWrapper />}
            />
            <Route
              path="/medical-records/:id/follow-up"
              element={<FollowUpFormWrapper />}
            />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/profile" element={<SettingsPage />} />
            <Route path="/billing" element={<BillingPage />} />
          </Route>
        )}

        {/* Fallback routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route
          path="*"
          element={
            isAuthenticated ? <Navigate to="/404" /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Refine>
  );
};
