import React from "react";
import { Outlet } from "react-router-dom";
import { HeaderNav } from "./HeaderNav";
import { FooterNav } from "./FooterNav";

const Layout = () => {
  return (
    <div>
      <HeaderNav />
      <main className="my-40 mx-6">
        <Outlet /> {/* This will render the routed page content */}
      </main>
      <FooterNav />
    </div>
  );
};

export default Layout;
