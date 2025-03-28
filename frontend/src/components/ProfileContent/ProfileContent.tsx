import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ChevronRight,
  CircleUserRound,
  Settings,
  KeyRound,
  UserX,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import {
  getCookies,
  getAccountIdCookie,
  getTypeCookie,
} from "@/services/cookiesService";

const ProfileContent: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);

  const cookies = getCookies();
  const accountId = cookies ? getAccountIdCookie(cookies) : null;

  useEffect(() => {
    if (!cookies) {
      navigate("/login");
    } else {
      setUserType(getTypeCookie(cookies));
    }
  }, [cookies, accountId, navigate]);

  const { data, loading, error } = usePersonalInformation(accountId || 0);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red">{error}</div>;
  }

  return (
    <div className="pb-20">
      <div className="container mx-auto max-w-2xl">
        <div className="flex flex-col items-center justify-center my-4">
          <h2 className="font-semibold text-3xl text-secondaryColour text-center">
            Profile
          </h2>

          {/* Profile image */}
          <Link to="/pages/PersonalInformationPage"> <img
            className="h-48 w-48 rounded-full border-2 border-gray dark:border-gray-800 mx-auto my-2 object-cover"
            src={data?.pictureUrl || "https://via.placeholder.com/150"}
            alt="Profile"
          />
    
         

          <p className="text-3xl text-primaryColour font-medium">
            {data?.firstName} {data?.lastName}
          </p>
          </Link>
          <p className="text-lg font-semibold text-primaryColour">
            {data?.type
              ? data?.type.charAt(0).toUpperCase() + data?.type.slice(1)
              : ""}
          </p>
        </div>
        

        <div className="flex flex-col mt-4">
          {/* Personal Information */}
          <Button
            className="w-full px-4 py-6 mb-4 text-left flex justify-between items-center rounded-xl"
            variant="outline"
            onClick={() => navigate("/pages/PersonalInformationPage")}
          >
            <span className="flex items-center">
              <CircleUserRound className="mr-2" />
              Personal Information
            </span>
            <ChevronRight />
          </Button>

          {/* Settings */}
          <Button
            className="w-full px-4 py-6 mb-4 text-left flex justify-between items-center rounded-xl"
            variant="outline"
            onClick={() => navigate("/pages/NotificationSettingsPage")}
          >
            <span className="flex items-center">
              <Settings className="mr-2" />
              Settings
            </span>
            <ChevronRight />
          </Button>

          {/* Change Password */}
          <Button
            className="w-full px-4 py-6 mb-4 text-left flex justify-between items-center rounded-xl"
            variant="outline"
            onClick={() => navigate("/pages/ChangePasswordPage")}
          >
            <span className="flex items-center">
              <KeyRound className="mr-2" />
              Change Password
            </span>
            <ChevronRight />
          </Button>

          {/* Blocked Users */}
          <Button
            className="w-full px-4 py-6 mb-4 text-left flex justify-between items-center rounded-xl"
            variant="outline"
            onClick={() => navigate("/pages/BlockedUserListPage")}
          >
            <span className="flex items-center">
              <UserX className="mr-2" />
              Blocked Users
            </span>
            <ChevronRight />
          </Button>

          {/* Modify Permissions - Only visible for ADMIN */}
          {userType === "ADMIN" && (
            <Button
              className="w-full px-4 py-6 mb-4 text-left flex justify-between items-center rounded-xl"
              variant="outline"
              onClick={() => navigate("/pages/ModifyPermissionPage")}
            >
              <span className="flex items-center">
                <UserX className="mr-2" />
                Modify Permissions
              </span>
              <ChevronRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
