import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/context/AuthContext";
import { TenantProvider } from "./lib/context/TenantContext";
import { UiProvider } from "./lib/context/UiContext";
import { RoleProvider } from "./lib/context/RoleContext";
import { Layout } from "./components/layout/Layout";
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
import { ClientList } from "./features/clients/ClientList";
import { ClientForm } from "./features/clients/ClientForm";
import { ClientDetails } from "./features/clients/ClientDetails";
import { PatientList } from "@/features/patients/PatientList";
import { PatientForm } from "@/features/patients/PatientForm";
import { PatientDetails } from "@/features/patients/PatientDetails";
import { Calendar } from "@/features/calendar/Calendar";
import { AppointmentForm } from "@/features/calendar/AppointmentForm";
import RoleSelectionPage from "./features/role-selection/RoleSelectionPage";
import { Toaster } from "@/components/ui/toaster";
import { AppRoutes } from "@/routes";

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

const ClientDetailsRoute = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <ClientDetails clientId={id} /> : null;
};

const PatientDetailsRoute = () => {
  const { id } = useParams<{ id: string }>();
  return id ? <PatientDetails /> : null;
};

function App() {
  const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoleProvider>
          <UiProvider>
            <div className="min-h-screen bg-background">
              <AppRoutes />
              <Toaster />
            </div>
          </UiProvider>
        </RoleProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
