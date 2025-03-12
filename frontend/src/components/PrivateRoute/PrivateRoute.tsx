import { Navigate, Outlet, useLocation } from "react-router";
import { clearCookies, getCookies } from "@/services/cookiesService";
import { getBearerToken } from "@/services/apiHelper.ts";
import { Capacitor } from "@capacitor/core";
import requestNotificationPermission from "@/services/fcm.ts";
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

  const initializeFcm = async () => {
    if (typeof Capacitor !== "undefined" && Capacitor.getPlatform() === "web") {
      await requestNotificationPermission();
    } else {
      console.warn("Mobile app suspected.");
    }
  };

  if (
    token === null ||
    token === "" ||
    token === undefined ||
    user.accountId === null ||
    user.accountId === undefined
  ) {
    clearCookies();
    return (
      <Navigate to={redirectingRoute} replace state={{ from: location }} />
    );
  } else {
    initializeFcm().then((r) => r);
  }

  if (requiredRole && user.type !== requiredRole && user.type !== "ADMIN") {
    return (
      <Navigate to={redirectingRoute} replace state={{ from: location }} />
    );
  }
  return <Outlet />;
};

export default PrivateRoute;
