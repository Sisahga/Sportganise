import { Outlet } from "react-router-dom";
import { HeaderNav } from "./HeaderNav";
import { FooterNav } from "./FooterNav";
import { Toaster } from "@/components/ui/toaster";

export default function Layout() {
  return (
    <div>
      <Toaster />
      <HeaderNav />
      <main className="my-40 mx-6">
        <Outlet /> {/* This will render the routed page content */}
      </main>
      <FooterNav />
    </div>
  );
}
