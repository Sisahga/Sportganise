import React from "react";
import { PriceComparisonToolContent } from "@/components/PriceComparisonToolContent";

const PriceComparisonToolPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-primaryColour">
      <PriceComparisonToolContent />
    </div>
  );
};

export default PriceComparisonToolPage;
