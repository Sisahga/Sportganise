import React from "react";
import { PriceComparisonToolContent } from "@/components/PriceComparisonToolContent";
import { FooterNav } from "@/components/FooterNav";
import { HeaderNav } from "@/components/HeaderNav";

const PriceComparisonToolPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-primaryColour">
      <HeaderNav />
      <PriceComparisonToolContent />
      <FooterNav />
    </div>
  );
};

export default PriceComparisonToolPage;
