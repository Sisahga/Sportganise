import React from "react";
import { HomeContent } from "@/components/HomeContent";
import { FooterNav } from "@/components/FooterNav";
import { HeaderNav } from "@/components/HeaderNav";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-primaryColour">
      <HeaderNav />
      <HomeContent />
      <FooterNav />
    </div>
  );
};

export default HomePage;
