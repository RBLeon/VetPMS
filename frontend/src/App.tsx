import { BrowserRouter } from "react-router-dom";
import { TenantProvider } from "./lib/context/TenantContext";
import { RoleProvider } from "./lib/context/RoleContext";
import { UiProvider } from "./lib/context/UiContext";
import { AuthProvider } from "./lib/context/AuthContext";
import { ErrorBoundaryContext } from "./components/error-boundary/ErrorBoundary";
import { Toaster } from "./components/ui/toaster";
import { RefineKbarProvider } from "@refinedev/kbar";
import { AppRoutes } from "./AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter basename="/VetPMS">
      <TenantProvider>
        <AuthProvider>
          <RoleProvider>
            <UiProvider>
              <RefineKbarProvider>
                <ErrorBoundaryContext>
                  <AppRoutes />
                  <Toaster />
                </ErrorBoundaryContext>
              </RefineKbarProvider>
            </UiProvider>
          </RoleProvider>
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}

export default App;
