import Dashboard from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { Route, Routes } from "react-router-dom";
import EmployeeManagement from "./pages/EmployeePage";
import Layout from "./components/app/layout";
import ReportAndAnalyticsPage from "./pages/ReportAndAnalyticsPage";
import ReservationPage from "./pages/ReservationPage";
import OrderPage from "./pages/OrderPage";
import ReservationCalendarPage from "./pages/ReservationCalendarPage";

const App = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Layout routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reservations" element={<ReservationPage />} />
        <Route
          path="/reservations/calendar"
          element={<ReservationCalendarPage />}
        />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/employee-management" element={<EmployeeManagement />} />
        <Route
          path="/report-and-analytics"
          element={<ReportAndAnalyticsPage />}
        />
      </Route>
    </Routes>
  );
};

export default App;
