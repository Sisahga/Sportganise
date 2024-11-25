import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import logo from "../../assets/Logo.png";

export default function HeaderNav() {
  const navigate = useNavigate();
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
          <DrawerContent className="w-[80%]">
            <DrawerHeader>
              <div className="flex justify-center items-center py-10 gap-2">
                <img src={logo} alt="Logo" className="h-24 rounded-lg" />
              </div>
            </DrawerHeader>
            <nav className="flex flex-col gap-4">
              <Button
                variant="link"
                className="text-lg font-font font-medium bg-white text-primaryColour hover:bg-white hover:outline-none"
              >
                Home
              </Button>
              <Button
                variant="link"
                className="text-lg font-font font-medium bg-white text-primaryColour hover:bg-white hover:outline-none"
              >
                Forum
              </Button>
              <Button
                variant="link"
                className="text-lg font-font font-medium bg-white text-primaryColour hover:bg-white hover:outline-none"
              >
                Training Session
              </Button>
              <Button
                variant="link"
                className="text-lg font-font font-medium bg-white text-primaryColour hover:bg-white hover:outline-none"
              >
                Training Plan
              </Button>
              <Button
                variant="link"
                className="text-lg font-font font-medium bg-white text-primaryColour hover:bg-white hover:outline-none"
              >
                Setting
              </Button>
              <Button
                variant="link"
                className="text-lg font-font font-medium bg-white text-primaryColour hover:bg-white hover:outline-none"
                onClick={() => navigate("/signup")} //redirect to the SignUp page
              >
                Sign Up
              </Button>
            </nav>
          </DrawerContent>
        </Drawer>
      </header>
    </div>
  );
}
