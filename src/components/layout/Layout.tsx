import { Outlet } from "react-router-dom";
import { ContextAwareNavigation } from "./ContextAwareNavigation";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ContextAwareNavigation />
      <main className="container mx-auto py-6">
        <Outlet />
      </main>
    </div>
  );
};
