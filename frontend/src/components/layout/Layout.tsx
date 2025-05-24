import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { RoleBasedMenu } from "./RoleBasedMenu";

export const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-64 border-r bg-card">
        <div className="p-4">
          <h2 className="text-xl font-bold">VetPMS</h2>
        </div>
        <RoleBasedMenu />
      </aside>
      <div className="flex-1">
        <Header />
        <main className="container mx-auto py-6 px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
