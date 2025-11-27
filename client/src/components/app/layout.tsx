import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "../app-sidebart";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className="flex-1 w-full p-4">
          <SidebarTrigger />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
