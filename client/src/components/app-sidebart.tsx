"use client"

import { Link, useLocation } from "react-router-dom"

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
} from "../components/ui/sidebar"

import homeIcon from "../assets/icons/home.svg"
import reportIcon from "../assets/icons/report.svg"
import eventIcon from "../assets/icons/event.svg"
import historyIcon from "../assets/icons/history.svg"
import fastfoodIcon from "../assets/icons/fastfood.svg"
import groupIcon from "../assets/icons/group.svg"
import logoutIcon from "../assets/icons/logout.svg"

export default function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const current = location.pathname

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="flex flex-col items-center pt-6">

        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-3xl font-bold">Tavern Asia</h3>
        </div>

        <img
          src="https://i.pravatar.cc/150?img=3"
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
                  <SidebarMenuButton isActive={current === "/dashboard"}>
                    <img src={homeIcon} className="w-4 h-4" />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Report & Analytics */}
              <SidebarMenuItem>
                <Link to="/report-and-analytics">
                  <SidebarMenuButton isActive={current === "/report-and-analytics"}>
                    <img src={reportIcon} className="w-4 h-4" />
                    <span>Report & Analytics</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Reservation Management */}
              <SidebarMenuItem>
                <Link to="/reservation-management">
                  <SidebarMenuButton isActive={current === "/reservation-management"}>
                    <img src={eventIcon} className="w-4 h-4" />
                    <span>Reservations</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Reservation History */}
              <SidebarMenuItem>
                <Link to="/reservations/history">
                  <SidebarMenuButton isActive={current === "/reservations/history"}>
                    <img src={historyIcon} className="w-4 h-4" />
                    <span>Reservation History</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Orders */}
              <SidebarMenuItem>
                <Link to="/order-tracking">
                  <SidebarMenuButton isActive={current === "/order-tracking"}>
                    <img src={fastfoodIcon} className="w-4 h-4" />
                    <span>Orders</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              {/* Employees */}
              <SidebarMenuItem>
                <Link to="/employee-management">
                  <SidebarMenuButton isActive={current === "/employee-management"}>
                    <img src={groupIcon} className="w-4 h-4" />
                    <span>Employees</span>
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
                <img src={logoutIcon} className="w-4 h-4" />
                <span>Logout</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}