import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function Protected() {
  const { user, loading } = useAuth();

  console.log("🟢🟢🔴🟢🟢 ACTIVE USER: ", user);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
