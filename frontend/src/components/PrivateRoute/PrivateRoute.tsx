import { Navigate, Outlet, useLocation } from "react-router";
import { getCookies } from "@/services/cookiesService";
import { getBearerToken } from "@/services/apiHelper.ts";
/* eslint-disable react/prop-types */

interface PrivateRouteProps {
  requiredRole?: "PLAYER" | "COACH" | "ADMIN";
  redirectingRoute?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  requiredRole,
  redirectingRoute = "/login",
}) => {
  const location = useLocation();
  const user = getCookies();
  const token = getBearerToken();

  if (
    token === null ||
    token === "" ||
    token === undefined ||
    user.accountId === null ||
    user.accountId === undefined
  ) {
    return (
      <Navigate to={redirectingRoute} replace state={{ from: location }} />
    );
  }

  if (requiredRole && user.type !== requiredRole && user.type !== "ADMIN") {
    return (
      <Navigate to={redirectingRoute} replace state={{ from: location }} />
    );
  }
  return <Outlet />;
};

export default PrivateRoute;
