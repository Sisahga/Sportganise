import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import logo from "../../assets/Logo.png";
import log from "loglevel";

log.info("HeaderNav component rendering.");

export default function HeaderNav() {
  const links = [
    { path: "/", label: "Home" },
    { path: "/", label: "Forum" }, // add path when forum page is done
    { path: "/pages/CreateTrainingSessionPage", label: "Training Session" },
    { path: "/pages/TrainingPlanPage", label: "Training Plan" },
    { path: "/", label: "Setting" }, // add path when settings page is done
    { path: "/login", label: "Log In" },
  ];

  const handleLinkClick = (label: string) => {
    log.info(`Navigating to ${label} page.`);
  };

  const handleDrawerTrigger = () => {
    log.info("Drawer menu trigger clicked.");
  };

  return (
    <div>
      <header className="fixed top-0 left-0 right-0 z-10 bg-primaryColour text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-20" />
          {(() => {
            log.info("Logo rendered in the header.");
            return null;
          })()}
        </div>

        <Drawer>
          <DrawerTrigger
            className="bg-primaryColour hover:outline-none"
            onClick={handleDrawerTrigger}
          >
            <Menu className="h-10 w-10" />
          </DrawerTrigger>
          <DrawerContent className="w-[50%]">
            <DrawerHeader>
              <div className="flex justify-center items-center py-10 gap-2">
                <img src={logo} alt="Logo" className="h-24 rounded-lg" />
                {(() => {
                  log.info("Drawer logo rendered.");
                  return null;
                })()}
              </div>
            </DrawerHeader>
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-lg font-font font-medium bg-white text-primaryColour hover:text-secondaryColour inline-flex items-center justify-center"
                  onClick={() => handleLinkClick(link.label)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </DrawerContent>
        </Drawer>
      </header>
    </div>
  );
}
