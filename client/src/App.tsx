import Dashboard from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import NewPasswordPage from "./pages/NewPasswordPage";
import { Route, Routes } from "react-router-dom";
import EmployeeManagement from "./pages/EmployeePage";
import Layout from "./components/app/layout";
import ReportAndAnalyticsPage from "./pages/ReportAndAnalyticsPage";
import ReservationPage from "./pages/ReservationPage";
import OrderPage from "./pages/OrderPage";
import ReservationCalendarPage from "./pages/ReservationCalendarPage";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  return (
    <>
      <Toaster richColors duration={2000} />
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Layout routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reservations" element={<ReservationPage />} />
            <Route
              path="/reservations/calendar"
              element={<ReservationCalendarPage />}
            />
            <Route path="/orders" element={<OrderPage />} />
            <Route
              path="/employee-management"
              element={<EmployeeManagement />}
            />
            <Route
              path="/report-and-analytics"
              element={<ReportAndAnalyticsPage />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;
