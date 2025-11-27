import Dashboard from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import { Route, Routes } from "react-router-dom";
import EmployeeManagement from "./pages/EmployeePage";
import Layout from "./components/app/layout";
import ReportAndAnalyticsPage from "./pages/ReportAndAnalyticsPage";
import OrderPage from "./pages/OrderPage";
import ReservationPage from "./pages/ReservationPage";

const App = () => {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<LoginPage />} />

      {/* Layout routes */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order-tracking" element={<OrderPage />} />
        <Route
          path="/report-and-analytics"
          element={<ReportAndAnalyticsPage />}
        />
        <Route path="/reservations" element={<ReservationPage />} />
        <Route path="/employee-management" element={<EmployeeManagement />} />
      </Route>
    </Routes>
  );
};

export default App;
