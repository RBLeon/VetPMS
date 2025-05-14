// import React from "react";
// import { useNavigate } from "react-router-dom";
import { AuthProvider } from "./lib/context/AuthContext";
import { TenantProvider } from "./lib/context/TenantContext";
import { UiProvider } from "./lib/context/UiContext";
import { RoleProvider } from "./lib/context/RoleContext";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/features/ui/components/toaster";
import { AppRoutes } from "./AppRoutes";

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
  // const navigate = useNavigate();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TenantProvider>
          <RoleProvider>
            <UiProvider>
              <div className="min-h-screen bg-background">
                <AppRoutes />
                <Toaster />
              </div>
            </UiProvider>
          </RoleProvider>
        </TenantProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
