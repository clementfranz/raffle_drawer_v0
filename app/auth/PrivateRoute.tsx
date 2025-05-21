import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";
import type { ReactElement } from "react";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
