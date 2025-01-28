import { Outlet, useLocation } from "react-router";
import { HeaderNav } from "./HeaderNav";
import { FooterNav } from "./FooterNav";
import { Toaster } from "@/components/ui/toaster";

// Paths where the header should be hidden
const hideHeaderPaths = [
  "/login",
  "/signup",
  "/forgotpassword",
  "/verificationcode",
]; // Header hidden on all these pages

const noTopMarginPaths = [
  "/pages/DirectMessagesDashboard",
  "/pages/DirectMessageChannelPage",
  "/pages/CreateDmChannelPage",
];

// Paths where the footer should be hidden
const hideFooterPaths = [
  "/pages/DirectMessageChannelPage",
  "/login",
  "/signup",
  "/forgotpassword",
  "/verificationcode",
]; // Footer hidden on /chat, login and signup pages

// Define paths where you don't want horizontal margins (like full-width pages)
const fullWidthPaths = [
  "/pages/DirectMessagesDashboard",
  "/pages/DirectMessageChannelPage",
  "/pages/CreateDmChannelPage",
]; // Full-width layout on these paths

// Function to check if the current path matches any hide paths
const shouldHide = (paths: string[], pathname: string): boolean =>
  paths.some((path: string) => pathname.startsWith(path));

const Layout = () => {
  const location = useLocation();

  const hideHeader = shouldHide(hideHeaderPaths, location.pathname);
  const hideFooter = shouldHide(hideFooterPaths, location.pathname);
  const isFullWidth = shouldHide(fullWidthPaths, location.pathname);
  const noTopMargin = shouldHide(noTopMarginPaths, location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster />
      {/* Conditionally render HeaderNav */}
      {!hideHeader && <HeaderNav />}

      {/* Main content area */}
      <main
        className={`flex-1 ${
          !hideHeader && !noTopMargin ? "mt-40" : "mt-28"
        } ${isFullWidth ? "mx-0" : "mx-6"}`}
      >
        <Outlet /> {/* This will render the routed page content */}
      </main>

      {/* Conditionally render FooterNav */}
      {!hideFooter && <FooterNav />}
    </div>
  );
};
export default Layout;
