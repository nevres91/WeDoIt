import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user } = useAuth();

  // If no user is logged in, redirect to the login page
  if (!user) {
    return <Navigate to="/" />;
  }

  // If user is logged in but email is not verified, redirect to verify-email page
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" />;
  }

  // If user is logged in and email is verified, allow access to the protected route
  return <Outlet />;
};

export default PrivateRoute;
