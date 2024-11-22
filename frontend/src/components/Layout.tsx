// src/components/Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { HeaderNav } from "./HeaderNav";
import { FooterNav } from "./FooterNav";

const Layout = () => {
  return (
    <div>
      <HeaderNav />
      <main style={{ padding: "1rem" }}>
        <Outlet /> {/* This will render the routed page content */}
      </main>
      <FooterNav />
    </div>
  );
};

export default Layout;
