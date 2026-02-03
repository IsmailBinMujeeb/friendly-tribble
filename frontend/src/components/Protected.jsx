import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { DashboardLayout } from "./DashboardLayout";

// ==================== Protected Route ====================
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};
