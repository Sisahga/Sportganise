import { useLocation, Link } from "react-router";
import { Home, Calendar, Bell, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import log from "loglevel";

log.setLevel("info");

const routes = [
  {
    label: "Home",
    icon: Home,
    href: "/",
    activeRoutes: ["/"],
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/pages/CalendarPage",
    activeRoutes: [
      "/pages/CalendarPage",
      "/pages/ViewTrainingSessionPage",
      "/pages/CreateTrainingSessionPage",
      "/pages/ModifyTrainingSessionPage",
    ],
  },
  {
    label: "Alerts",
    icon: Bell,
    href: "/pages/NotificationsPage",
    activeRoutes: ["/pages/NotificationsPage"],
  },
  {
    label: "Inbox",
    icon: MessageSquare,
    href: "/pages/DirectMessagesDashboard",
    activeRoutes: [
      "/pages/DirectMessagesDashboard",
      "/pages/CreateDmChannelPage",
      "/pages/DirectMessageChannelPage",
      "/pages/DirectMessagesDashboard",
    ],
  },
  {
    label: "Profile",
    icon: User,
    href: "/pages/ProfilePage",
    activeRoutes: [
      "/pages/ProfilePage",
      "/pages/ChangePasswordPage",
      "/pages/EditProfilePage",
      "/pages/ModifyPermissionPage",
      "/pages/PersonalInformationPage",
      "/pages/BlockedUserListPage",
      "/pages/NotificationSettingsPage",
    ],
  },
];

export default function FooterNav() {
  const location = useLocation();
  log.info("FooterNav rendered");
  log.info("Current location:", location.pathname);
  return (
    <div className="z-50">
      <nav
        className="fixed shadow-md rounded-xl bottom-2 left-0 right-0 mx-4 bg-white p-3
            grid grid-cols-5 text-xs sm:text-base md:w-2/3 lg:w-1/2 2xl:w-2/5 md:left-1/2 md:transform md:-translate-x-1/2"
      >
        {routes.map((route) => {
          const isActive = route.activeRoutes.includes(location.pathname);
          log.info(`Rendering route: ${route.label}, Active: ${isActive}`);

          return (
            <Link
              key={route.href}
              to={route.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg transition-colors px-2 py-2 h-16",
                isActive
                  ? "text-secondaryColour hover:text-secondaryColour bg-textPlaceholderColour"
                  : "text-primaryColour hover:text-secondaryColour",
              )}
            >
              <route.icon className="w-6 h-6" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
