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

  const clearCookiesAndNavigate = () => {
    clearCookies();
    navigate("/login");
  };

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-10 bg-primaryColour text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-20" />
        </div>

        <Drawer>
          <DrawerTrigger className="bg-primaryColour hover:outline-none">
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
                className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Home
              </Link>
              <Link
                to="/pages/ForumPage"
                className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Forum
              </Link>
              {(accountType?.toLowerCase() === "coach" ||
                accountType?.toLowerCase() === "admin") && (
                <>
                  <Link
                    to="/pages/CreateTrainingSessionPage"
                    className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
                  >
                    Training Session
                  </Link>
                  <Link
                    to="/pages/TrainingPlanPage" //add actual redirect once training plan page is set up
                    className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
                  >
                    Training Plan
                  </Link>
                </>
              )}
              <Link
                to="/pages/PriceComparisonToolPage"
                className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Price Comparison
              </Link>
              <Link
                to="/" //add actual redirect once setting page is set up
                className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Setting
              </Link>
              <button
                onClick={clearCookiesAndNavigate}
                className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
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
