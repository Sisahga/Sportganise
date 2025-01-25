import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCookies } from "@/services/cookiesService";
/* eslint-disable react/prop-types */

interface PrivateRouteProps {
  requiredRole?: "PLAYER" | "COACH" | "ADMIN";
  redirectingRoute?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  requiredRole = "PLAYER",
  redirectingRoute = "/login",
}) => {
  const location = useLocation();
  const user = getCookies();

  if (!user?.accountId) {
    return (
      <Navigate to={redirectingRoute} replace state={{ from: location }} />
    );
  }

  if (user.type !== requiredRole && user.type !== "ADMIN") {
    return (
      <Navigate to={redirectingRoute} replace state={{ from: location }} />
    );
  }
  return <Outlet />;
};

export default PrivateRoute;
