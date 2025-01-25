import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCookies } from "@/services/cookiesService";

interface PublicRouteProps {
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ redirectTo = "/" }) => {
  const location = useLocation();
  const user = getCookies();

  console.log(user)
  if (user?.accountId) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PublicRoute;
