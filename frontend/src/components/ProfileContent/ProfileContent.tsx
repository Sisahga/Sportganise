import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  ChevronRight,
  CircleUserRound,
  Settings,
  KeyRound,
  UserX,
  LoaderCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import { getTypeCookie } from "@/services/cookiesService";
import useGetCookies from "@/hooks/useGetCookies.ts";

const ProfileContent: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);

  const { userId, cookies, preLoading } = useGetCookies();

  const { data, loading, error, fetchAccountData } = usePersonalInformation();

  useEffect(() => {
    if (!preLoading) {
      if (!cookies) {
        navigate("/login");
      } else {
        setUserType(getTypeCookie(cookies));
        fetchAccountData(userId).then((_) => _);
      }
    }
  }, [cookies, userId, preLoading, navigate]);

  if (preLoading || loading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red">{error}</div>;
  }

  return (
    <div className="mt-4 flex flex-col gap-6 md:gap-6">
      <h2 className="font-semibold text-3xl text-secondaryColour text-center">
        Profile
      </h2>
      <div
        className="container mx-auto max-w-2xl md:flex md:gap-20 md:p-16
                   md:shadow-xl md:rounded-xl md:bg-white md:border md:border-navbar"
      >
        <div className="flex flex-col items-center justify-between gap-2 md:gap-0">
          {/* Profile image */}
          <Link to="/pages/PersonalInformationPage">
            {" "}
            <img
              className="h-44 w-44 rounded-full border-2 border-gray
                        dark:border-gray-800 mx-auto object-cover"
              src={data?.pictureUrl || "https://via.placeholder.com/150"}
              alt="Profile"
            />
          </Link>
          <div className="flex flex-col justify-end items-center mb-4 md:mb-0">
            <p className="text-xl text-center text-primaryColour font-medium">
              {data?.firstName} {data?.lastName}
            </p>
            <p className="text-base font-semibold text-primaryColour">
              {data?.type
                ? data?.type.charAt(0).toUpperCase() + data?.type.slice(1)
                : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-col mt-4 md:mt-0 md:flex-grow md:gap-4 md:justify-between">
          {/* Personal Information */}
          <Button
            className="w-full px-4 py-6 mb-4 md:mb-0 text-left flex justify-between items-center rounded-xl"
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
            className="w-full px-4 py-6 mb-4 md:mb-0 text-left flex justify-between items-center rounded-xl"
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
            className="w-full px-4 py-6 mb-4 md:mb-0 text-left flex justify-between items-center rounded-xl"
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
            className="w-full px-4 py-6 mb-4 md:mb-0 text-left flex justify-between items-center rounded-xl"
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
              className="w-full px-4 py-6 mb-4 md:mb-0 text-left flex justify-between items-center rounded-xl"
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
