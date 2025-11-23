import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import { Route, Routes } from "react-router-dom";
import OrderTracking from "./pages/OrderTracking";
import ReportAndAnalytics from "./pages/ReportAndAnalytics";
import ReservationManagement from "./pages/ReservationManagement";
import EmployeeManagement from "./pages/EmployeeManagement";
import Layout from "./components/app/layout";

const App = () => {
  return (
    <Layout>
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
    </Layout>
  );
};

export default App;
