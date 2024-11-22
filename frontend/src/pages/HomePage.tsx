import React from "react";
import { HomeContent } from "../components/HomeContent/index";
import { FooterNav } from "../components/FooterNav/index";
import { HeaderNav } from "../components/HeaderNav/index";

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
