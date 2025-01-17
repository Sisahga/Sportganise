import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import logo from "../../assets/Logo.png";

export default function HeaderNav() {
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
          <DrawerContent className="w-[50%]">
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
                to="/" //add actual redirect once forum page is set up
                className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Forum
              </Link>
              <Link
                to="/pages/CreateTrainingSessionPage"
                className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Training Session
              </Link>
              <Link
                to="/" //add actual redirect once training plan page is set up
                className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Training Plan
              </Link>
              <Link
                to="/" //add actual redirect once setting page is set up
                className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Setting
              </Link>
              <Link
                to="/login"
                className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
              >
                Log In
              </Link>
            </nav>
          </DrawerContent>
        </Drawer>
      </header>
    </div>
  );
}
