import { Outlet } from "react-router-dom";
import { HeaderNav } from "./HeaderNav";
import { FooterNav } from "./FooterNav";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <div>
      <HeaderNav />
      <main className="my-40 mx-6">
        <Outlet /> {/* This will render the routed page content */}
      </main>
      <Toaster />

      <FooterNav />
    </div>
  );
}
