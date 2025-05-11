import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/hooks/useAuth";
import { Layout } from "@/components/layout/Layout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { PatientsPage } from "@/pages/patients/PatientsPage";
import { PatientDetailsPage } from "@/pages/patients/PatientDetailsPage";
import { AppointmentsPage } from "@/pages/appointments/AppointmentsPage";
import { AppointmentDetailsPage } from "@/pages/appointments/AppointmentDetailsPage";
import { ClientsPage } from "@/pages/clients/ClientsPage";
import { ClientDetailsPage } from "@/pages/clients/ClientDetailsPage";
import { MedicalRecordsPage } from "@/pages/medical-records/MedicalRecordsPage";
import { MedicalRecordDetailsPage } from "@/pages/medical-records/MedicalRecordDetailsPage";
import { BillingPage } from "@/pages/billing/BillingPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { AppointmentForm } from "@/features/calendar/AppointmentForm";
import { useNavigate } from "react-router-dom";

export const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="patients/:id" element={<PatientDetailsPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route
          path="appointments/new"
          element={
            <AppointmentForm
              onSubmit={(data) => {
                // Handle form submission
                console.log(data);
                navigate("/appointments");
              }}
              onCancel={() => navigate("/appointments")}
            />
          }
        />
        <Route path="appointments/:id" element={<AppointmentDetailsPage />} />
        <Route
          path="appointments/:id/edit"
          element={
            <AppointmentForm
              onSubmit={(data) => {
                // Handle form submission
                console.log(data);
                navigate("/appointments");
              }}
              onCancel={() => navigate("/appointments")}
            />
          }
        />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/:id" element={<ClientDetailsPage />} />
        <Route path="medical-records" element={<MedicalRecordsPage />} />
        <Route
          path="medical-records/:id"
          element={<MedicalRecordDetailsPage />}
        />
        <Route path="billing" element={<BillingPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
