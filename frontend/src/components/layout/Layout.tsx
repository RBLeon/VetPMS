import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { RefineContextAwareNavigation } from "./RefineContextAwareNavigation";

export const Layout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">
        <Outlet />
      </main>
      <RefineContextAwareNavigation />
    </div>
  );
};
