/* eslint-disable react/prop-types */
import { Navigate, Outlet, useLocation } from "react-router";
import useGetCookies from "@/hooks/useGetCookies.ts";
import { LoaderCircle } from "lucide-react";
import React from "react";

interface PublicRouteProps {
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ redirectTo = "/" }) => {
  const location = useLocation();
  const { userId, preLoading } = useGetCookies();

  if (preLoading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

  if (userId && userId !== 0) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PublicRoute;
