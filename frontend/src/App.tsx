// import React from "react";
// import { useNavigate } from "react-router-dom";
import { Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";
import routerBindings from "@refinedev/react-router-v6";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { TenantProvider } from "./lib/context/TenantContext";
import { RoleProvider } from "./lib/context/RoleContext";
import { UiProvider } from "./lib/context/UiContext";
import { AuthProvider } from "./lib/context/AuthContext";
import { AppRoutes } from "./AppRoutes";
import { ErrorBoundaryContext } from "./components/error-boundary/ErrorBoundary";
import "./App.css";

function App() {
  // const navigate = useNavigate();

  return (
    <BrowserRouter basename="/VetPMS">
      <TenantProvider>
        <AuthProvider>
          <RoleProvider>
            <UiProvider>
              <RefineKbarProvider>
                <ErrorBoundaryContext>
                  <AppRoutes />
                </ErrorBoundaryContext>
              </RefineKbarProvider>
              <div className="min-h-screen bg-background">
                <Toaster />
              </div>
            </UiProvider>
          </RoleProvider>
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}

export default App;
