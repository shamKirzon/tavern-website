import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { useEffect } from "react";
import { toast } from "sonner";

const PublicRoute = () => {
  const { user, loading } = useAuth();

  // useEffect(() => {
  //   if (!loading && user) {
  //     toast.error("Please logout to access this page.", {
  //       style: {
  //         background: "#8B1A1A",
  //         color: "#fff",
  //         border: "1px solid #6e1414",
  //       },
  //     });
  //   }
  // }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};

export default PublicRoute;
