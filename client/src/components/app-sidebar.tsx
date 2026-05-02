"use client";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";

import {
  IconGroup,
  SideBarDashboard,
  SideBarLogout,
  SideBarOrder,
  SideBarReportsAndAnalytics,
  SideBarReservation,
} from "../assets/icons/icons";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthProvider";

export default function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <Sidebar className="border-none bg-white font-poppins">
      <h3 className="text-lg mt-1 font-bold pl-3 py-2 text-black">
        Tavern Asia
      </h3>
      <SidebarHeader className="flex flex-col pt-1 items-center">
        <SidebarSeparator />

        <img
          src="src/assets/images/johnny.png"
          alt="Admin Avatar"
          className="mt-3 rounded-full w-20 h-20"
        />

        {state !== "collapsed" && (
          <div className="mt-3 text-center">
            <p className="font-semibold text-lg text-black">Hello, Admin</p>
            <p className="mt-0 text-xs text-gray-500">tavernadmin@gmail.com</p>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <Link to="/dashboard">
                  <SidebarMenuButton isActive={currentPath === "/dashboard"}>
                    <SideBarDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Reservation */}
              <SidebarMenuItem>
                <Link to="/reservations">
                  <SidebarMenuButton isActive={currentPath === "/reservations"}>
                    <SideBarReservation />
                    <span>Reservations</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Calendar */}
              <SidebarMenuItem className="ml-6 pr-8">
                <Link to="/reservations/calendar">
                  <SidebarMenuButton
                    isActive={currentPath === "/reservations/calendar"}
                  >
                    <span>Calendar</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Orders */}
              <SidebarMenuItem>
                <Link to="/orders">
                  <SidebarMenuButton isActive={currentPath === "/orders"}>
                    <SideBarOrder />
                    <span>Orders</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Employees */}
              <SidebarMenuItem>
                <Link to="/employee-management">
                  <SidebarMenuButton
                    isActive={currentPath === "/employee-management"}
                  >
                    <IconGroup />
                    <span>Employees</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Report & Analytics */}
              <SidebarMenuItem>
                <Link to="/report-and-analytics">
                  <SidebarMenuButton
                    isActive={currentPath === "/report-and-analytics"}
                  >
                    <SideBarReportsAndAnalytics />
                    <span>Report & Analytics</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setIsLogoutModalOpen(true)}>
              <SideBarLogout />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Logout Confirmation Modal */}
      <Dialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
        <DialogContent className="w-sm p-0 overflow-hidden font-poppins rounded-2xl border-none gap-0">
          <div className="bg-red-900 px-6 py-5">
            <DialogTitle className="text-white text-xl font-medium">
              Confirmation
            </DialogTitle>
          </div>

          <div className="bg-white px-6 pt-6 pb-6 flex flex-col gap-4 text-sm">
            <DialogDescription className="text-gray-600 text-md">
              Are you sure you want to logout?
            </DialogDescription>

            <div className="flex gap-3">
              <DialogClose asChild>
                <Button className="flex-1 bg-[#1C1B1F] hover:bg-gray-900 text-white rounded-xl py-5 text-md">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={async () => {
                  await logout();
                  setIsLogoutModalOpen(false);
                  navigate("/login");
                }}
                className="flex-1 bg-[#EFD974] hover:bg-yellow-300 text-black rounded-xl py-5 text-md"
              >
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
