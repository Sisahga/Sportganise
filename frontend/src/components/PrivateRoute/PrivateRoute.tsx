import { Navigate, Outlet, useLocation } from "react-router";
import { clearCookies, getCookies } from "@/services/cookiesService";
import { getBearerToken } from "@/services/apiHelper.ts";
import { useRequestNotificationPermission } from "@/hooks/useFcmRequestPermission.ts";
import { CookiesDto } from "@/types/auth.ts";
import React, { useEffect, useState } from "react";
import { isMobilePlatform } from "@/utils/isMobilePlatform.ts";
import { LoaderCircle } from "lucide-react";
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
  const [user, setUser] = useState<CookiesDto | null>(null);
  const [bearerToken, setBearerToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const notified = localStorage.getItem("pushNotifications");

  const { requestPermission } = useRequestNotificationPermission();

  // If user already granted permission, it won't do anything.
  const initializeFcm = async (userId: number) => {
    if (!isMobilePlatform()) {
      await requestPermission(userId);
    } else {
      console.warn("Mobile app suspected.");
    }
  };

  const fetchUser = async () => {
    const cookies = await getCookies();
    setUser(cookies);
  };
  const fetchToken = async () => {
    const token = await getBearerToken();
    setBearerToken(token);
    setLoadingToken(false);
  };

  useEffect(() => {
    fetchUser().then((r) => r);
    fetchToken().then((r) => r);
  }, [location.pathname]);

  if (!user || loadingToken) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (
    !user.accountId ||
    (!loadingToken && (!bearerToken || bearerToken === ""))
  ) {
    clearCookies().then((r) => r);
    return (
      <Navigate to={redirectingRoute} replace state={{ from: location }} />
    );
  } else {
    if (notified === undefined || notified === null) {
      initializeFcm(user.accountId).then((r) => r);
    }
  }

  if (requiredRole && user.type !== requiredRole && user.type !== "ADMIN") {
    return (
      <Navigate to={redirectingRoute} replace state={{ from: location }} />
    );
  }
  return <Outlet />;
};

export default PrivateRoute;
