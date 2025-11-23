import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import { Route, Routes } from "react-router-dom";
import OrderTracking from "./components/OrderTracking";
import ReportAndAnalytics from "./components/ReportAndAnalytics";
import ReservationManagement from "./components/ReservationManagement";
import EmployeeManagement from "./components/EmployeeManagement";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/order-tracking" element={<OrderTracking />} />
      <Route path="/report-and-analytics" element={<ReportAndAnalytics />} />
      <Route
        path="/reservation-management"
        element={<ReservationManagement />}
      />
      <Route path="/employee-management" element={<EmployeeManagement />} />
    </Routes>
  );
};

export default App;
