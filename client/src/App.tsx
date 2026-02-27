import Dashboard from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { Route, Routes } from "react-router-dom";
import EmployeeManagement from "./pages/EmployeePage";
import Layout from "./components/app/layout";
import ReportAndAnalyticsPage from "./pages/ReportAndAnalyticsPage";
import ReservationPage from "./pages/ReservationPage";
import OrderPage from "./pages/OrderPage";
import ReservationHistory from "./pages/ReservationHistory";

const App = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<LoginPage />} />

      {/* Layout routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reservations" element={<ReservationPage />} />
        <Route path="/reservations/history" element={<ReservationHistory />} />
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
