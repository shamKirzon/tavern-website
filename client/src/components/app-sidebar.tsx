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
  IconGroup,
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

  const [activeButton, setActiveButton] = useState<string>("dashboard");

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
            <p className="mt-0f text-xs text-gray-500">tavernadmin@gmail.com</p>
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

              {/* Calendar */}
              <SidebarMenuItem className="ml-6 pr-8">
                <Link to="/reservations/calendar">
                  <SidebarMenuButton
                    onClick={() => setActiveButton("calendar")}
                    isActive={activeButton === "calendar"}
                  >
                    <span>Calendar</span>
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
                    <IconGroup />
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
