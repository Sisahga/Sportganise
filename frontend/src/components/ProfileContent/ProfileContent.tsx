/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- TODO: fix a11y issues*/
import React from "react";
import { Button } from "@/components/ui/Button";
import {
  MoveLeft,
  ChevronRight,
  SquarePen,
  CircleUserRound,
  Settings,
  KeyRound,
  UserX,
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
            onClick={() => navigate("/")}
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

          <div className="space-y-8 max-w-3xl mx-auto pt-10 border-none shadow-none">
            {/* Personal Information */}
            <div
              className="w-full px-4 py-3 text-left flex justify-between items-center rounded-full border-2 border-2 border-textPlaceholderColour cursor-pointer hover:bg-textPlaceholderColour/50"
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
              className="w-full px-4 py-3 text-left flex justify-between items-center rounded-full mb-2 border-2 border-2 border-textPlaceholderColour cursor-pointer hover:bg-textPlaceholderColour/50"
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
              className="w-full px-4 py-3 text-left flex justify-between items-center rounded-full border-2 border-textPlaceholderColour cursor-pointer hover:bg-textPlaceholderColour/50"
              onClick={() => navigate("/pages/ChangePasswordPage")}
            >
              <span className="flex">
                <KeyRound className="mr-2" />
                Change Password
              </span>
              <ChevronRight />
            </div>
            {/* Blocked Users*/}
            <div
              className="w-full px-4 py-3 text-left flex justify-between items-center rounded-full border-2 border-textPlaceholderColour cursor-pointer hover:bg-textPlaceholderColour/50"
              onClick={() => navigate("/pages/BlockedUserListPage")}
            >
              <span className="flex">
                <UserX className="mr-2" />
                Blocked Users
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
