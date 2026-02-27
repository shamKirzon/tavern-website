"use client";

import { Link, useLocation } from "react-router-dom";

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
  SideBarDashboard,
  SideBarEmployee,
  SideBarLogout,
  SideBarOrder,
  SideBarReportsAndAnalytics,
  SideBarReservation,
} from "../assets/icons/icons";
import { useState } from "react";

export default function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const current = location.pathname;

  const [activeButton, setActiveButton] = useState<string>("dashboard");

  return (
    <Sidebar className="border-none bg-white">
      <SidebarHeader className="flex flex-col items-center pt-6">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-3xl font-bold">Tavern Asia</h3>
        </div>

        <img
          src="src/assets/images/johnny.png"
          alt="Admin Avatar"
          className="rounded-full w-20 h-20"
        />

        {state !== "collapsed" && (
          <div className="mt-3 text-center">
            <p className="font-semibold">Hello, Admin</p>
            <p className="text-xs text-gray-500">tavernadmin@gmail.com</p>
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
                  <SidebarMenuButton
                    onClick={() => setActiveButton("dashboard")}
                    isActive={activeButton === "dashboard"}
                  >
                    <SideBarDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Reservation */}
              <SidebarMenuItem>
                <Link to="/reservations">
                  <SidebarMenuButton
                    onClick={() => setActiveButton("reservation")}
                    isActive={activeButton === "reservation"}
                  >
                    <SideBarReservation />
                    <span>Reservations</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* History */}
              <SidebarMenuItem className="ml-6 pr-8">
                <Link to="/reservations/history">
                  <SidebarMenuButton
                    onClick={() => setActiveButton("history")}
                    isActive={activeButton === "history"}
                  >
                    <span>History</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Orders */}
              <SidebarMenuItem>
                <Link to="/orders">
                  <SidebarMenuButton
                    onClick={() => setActiveButton("orders")}
                    isActive={activeButton === "orders"}
                  >
                    <SideBarOrder />
                    <span>Orders</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Employees */}
              <SidebarMenuItem>
                <Link to="/employee-management">
                  <SidebarMenuButton
                    onClick={() => setActiveButton("employees")}
                    isActive={activeButton === "employees"}
                  >
                    <SideBarEmployee />
                    <span>Employees</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Report & Analytics */}
              <SidebarMenuItem>
                <Link to="/report-and-analytics">
                  <SidebarMenuButton
                    onClick={() => setActiveButton("reportAndAnalytics")}
                    isActive={activeButton === "reportAndAnalytics"}
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
            <Link to="/logout">
              <SidebarMenuButton>
                <SideBarLogout />
                <span>Logout</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
