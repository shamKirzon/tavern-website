// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import { toast } from "sonner";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && !location.state?.loggedOut) {
      toast.error("Please login to access this page.", {
        style: {
          background: "#8B1A1A",
          color: "#fff",
          border: "1px solid #6e1414",
        },
      });
    }
  }, [user, loading, location.state]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
