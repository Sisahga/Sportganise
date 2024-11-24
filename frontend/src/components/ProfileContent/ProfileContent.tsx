import React from "react";
import { Button } from "@/components/ui/Button";
import {
  MoveLeft,
  ChevronRight,
  SquarePen,
  CircleUserRound,
  Settings,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileContent: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-primaryColourz-40">
      <div className="px-4 bg-white pb-16">
        <div className="py-1 min-h-screen">
          <Button
            className="rounded-full"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <MoveLeft />
          </Button>
          <div className="flex flex-col items-center justify-center my-4">
            <h1>Profile</h1>

            {/* Profile image */}
            <img
              className="h-48 w-48 rounded-full border-2 border-white dark:border-gray-800 mx-auto my-2"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />

            <p className="text-3xl font-medium">Jane Doe</p>
            <p className="text-lg font-semibold">Player</p>

            {/* Edit Profile Button */}
            <Button
              className="mt-4 px-6 py-2 bg-secondaryColour rounded-full"
              variant="default"
              onClick={() => navigate("/pages/EditProfilePage")}
            >
              {" "}
              <SquarePen />
              Edit Profile
            </Button>
          </div>

          <div className="flex flex-col mt-12">
            {/* Personal Information */}
            <div
              className="w-full px-4 py-3 text-left flex justify-between items-center rounded-full border-2 border-grey mb-4 cursor-pointer hover:bg-gray-100"
              onClick={() => navigate("/pages/PersonalInformationPage")}
            >
              <span className="flex">
                <CircleUserRound className="mr-2" />
                Personal Information
              </span>
              <ChevronRight />
            </div>

            {/* Settings */}
            <div
              className="w-full  px-4  py-3 text-left flex justify-between items-center rounded-full border-2 border-grey mb-4 cursor-pointer hover:bg-gray-100"
              onClick={() => navigate("/settings")}
            >
              <span className="flex">
                <Settings className="mr-2" />
                Settings
              </span>

              <ChevronRight />
            </div>

            {/* Change Password*/}
            <div
              className="w-full  px-4 py-3  text-left flex justify-between items-center rounded-full border-2 border-grey cursor-pointer hover:bg-gray-100"
              onClick={() => navigate("/pages/ChangePasswordPage")}
            >
              <span className="flex">
                <KeyRound className="mr-2" />
                Change Password
              </span>
              <ChevronRight />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
