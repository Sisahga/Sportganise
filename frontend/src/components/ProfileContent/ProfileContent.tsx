/**TODO: Remove hardcoded accounID, needs to be fetched */
import { Button } from "@/components/ui/Button";
import {
  MoveLeft,
  ChevronRight,
  CircleUserRound,
  Settings,
  KeyRound,
  UserX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import usePersonalInformation from "@/hooks/usePersonalInfromation";

const ProfileContent: React.FC = () => {
  const navigate = useNavigate();
  const accountId = 1;

  // Use the custom hook to fetch account data
  const { data, loading, error } = usePersonalInformation(accountId);

  // Log the fetched data for debugging purposes
  // useEffect(() => {
  //   if (data) {
  //     console.log("Fetched Profile Information:", data);
  //   }
  // }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red">{error}</div>;
  }

  return (
    <div className="min-h-screen">
      <Button
        className="rounded-full w-2"
        variant="outline"
        onClick={() => navigate(-1)}
      >
        <MoveLeft />
      </Button>
      <div className="flex flex-col items-center justify-center my-4">
        <h2 className="font-semibold text-3xl text-secondaryColour text-center mb-4">
          Profile
        </h2>

        {/* Profile image */}
        <img
          className="h-48 w-48 rounded-full border-2 border-gray dark:border-gray-800 mx-auto my-2"
          src={data?.pictureUrl || "https://via.placeholder.com/150"} // Use fetched picture or fallback
          alt="Profile"
        />

        <p className="text-3xl font-medium">
          {data?.firstName} {data?.lastName}
        </p>
        <p className="text-lg font-semibold">
          {data?.type
            ? data?.type.charAt(0).toUpperCase() + data?.type.slice(1)
            : ""}
        </p>
      </div>

      <div className="flex flex-col mt-4">
        {/* Personal Information */}
        <Button
          className="w-full  px-4 py-3  mb-4 text-left flex justify-between items-center rounded-full"
          variant="outline"
          onClick={() => navigate("/pages/PersonalInformationPage")}
        >
          <span className="flex">
            <CircleUserRound className="mr-2" />
            Personal Information
          </span>
          <ChevronRight />
        </Button>

        {/* Settings */}
        <Button
          className="w-full  px-4 py-3  mb-4 text-left flex justify-between items-center rounded-full"
          variant="outline"
          onClick={() => navigate("/pages/ChangePasswordPage")}
        >
          <span className="flex">
            <Settings className="mr-2" />
            Settings
          </span>

          <ChevronRight />
        </Button>

        {/* Change Password*/}
        <Button
          className="w-full  px-4 py-3  mb-4 text-left flex justify-between items-center rounded-full"
          variant="outline"
          onClick={() => navigate("/pages/ChangePasswordPage")}
        >
          <span className="flex">
            <KeyRound className="mr-2" />
            Change Password
          </span>
          <ChevronRight />
        </Button>

        {/* Blocked Users*/}
        <Button
          className="w-full  px-4 py-3  mb-4 text-left flex justify-between items-center rounded-full"
          variant="outline"
          onClick={() => navigate("/pages/BlockedUserListPage")}
        >
          <span className="flex">
            <UserX className="mr-2" />
            Blocked Users
          </span>
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default ProfileContent;
