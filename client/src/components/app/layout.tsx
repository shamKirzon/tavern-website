import { SidebarProvider } from "../ui/sidebar";
import AppSidebar from "../app-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className=" w-full px-6 py-3 bg-[#F4EFE8]">
          {/* <SidebarTrigger /> */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
