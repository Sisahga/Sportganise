import { Outlet, useLocation } from "react-router-dom";
import { HeaderNav } from "./HeaderNav";
import { FooterNav } from "./FooterNav";

const Layout = () => {
  const location = useLocation();

  // Paths where the header should be hidden
  const hideHeaderPaths = ["/messages", "/chat"]; // Header hidden on both

  // Paths where the footer should be hidden
  const hideFooterPaths = ["/chat"]; // Footer hidden only on /chat

  // Function to check if the current path matches any hide paths
  const shouldHide = (paths: string[]): boolean =>
    paths.some((path: string) => location.pathname.startsWith(path));
  

  const hideHeader = shouldHide(hideHeaderPaths);
  const hideFooter = shouldHide(hideFooterPaths);

  // Define paths where you don't want horizontal margins (like full-width pages)
  const fullWidthPaths = ["/messages", "/chat"]; // Full-width layout on these paths
  const isFullWidth = shouldHide(fullWidthPaths);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditionally render HeaderNav */}
      {!hideHeader && <HeaderNav />}

      {/* Main content area */}
      <main
        className={`flex-1 ${
          !hideHeader ? "mt-40" : ""
        } ${isFullWidth ? "mx-0" : "mx-6"}`}
      >
        <Outlet /> {/* This will render the routed page content */}
      </main>

      {/* Conditionally render FooterNav */}
      {!hideFooter && <FooterNav />}
    </div>
  );
}
