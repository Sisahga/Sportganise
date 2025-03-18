import { Menu } from "lucide-react";
import { Link, useNavigate } from "react-router";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import logo from "../../assets/Logo.png";
import { useState, useEffect } from "react";
import { getCookies } from "@/services/cookiesService";
import log from "loglevel";
import { clearCookies } from "@/services/cookiesService";

log.info("HeaderNav component is being rendered.");

export default function HeaderNav() {
  const [accountType, setAccountType] = useState<string | null | undefined>();
  useEffect(() => {
    const user = getCookies();
    setAccountType(user?.type);
  }, [accountType]);
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const clearCookiesAndNavigate = () => {
    clearCookies();
    navigate("/login");
  };

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-10 bg-primaryColour text-white p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-20 cursor-pointer" />
        </Link>

        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger
            className="bg-primaryColour hover:outline-none"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu className="h-10 w-10" />
          </DrawerTrigger>
          <DrawerContent className="md:w-[20%] w-[50%]">
            <DrawerHeader>
              <div className="flex justify-center items-center py-10 gap-2">
                <img src={logo} alt="Logo" className="h-24 rounded-lg" />
              </div>
            </DrawerHeader>
            <nav className="flex flex-col gap-4">
              <Link
                to="/"
                className="text-lg font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
                onClick={closeDrawer}
              >
                Home
              </Link>
              <Link
                to="/pages/ForumPage"
                className="text-lg font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
                onClick={closeDrawer}
              >
                Forum
              </Link>
              {(accountType?.toLowerCase() === "coach" ||
                accountType?.toLowerCase() === "admin") && (
                <>
                  <Link
                    to="/pages/CreateTrainingSessionPage"
                    className="text-lg font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
                    onClick={closeDrawer}
                  >
                    Create Program
                  </Link>
                  <Link
                    to="/pages/TrainingPlanPage"
                    className="text-lg font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
                    onClick={closeDrawer}
                  >
                    Training Plan
                  </Link>
                </>
              )}
              {accountType?.toLowerCase() === "admin" && (
                <>
                  <Link
                    to="/pages/ModifyPermissionPage"
                    className="text-lg font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
                    onClick={closeDrawer}
                  >
                    User Permissions
                  </Link>
                </>
              )}
              <Link
                to="/pages/WaitlistTrainingSessionPage"
                className="text-lg font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Waitlist
              </Link>
              <Link
                to="/pages/NotificationSettingsPage"
                className="text-lg font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
                onClick={closeDrawer}
              >
                Settings
              </Link>
              <button
                onClick={clearCookiesAndNavigate}
                className="text-lg font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Log Out
              </button>
            </nav>
          </DrawerContent>
        </Drawer>
      </header>
    </div>
  );
}
