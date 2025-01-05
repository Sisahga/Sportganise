import React from "react";
import { VerificationCode } from "../components/VerificationCode/index";
import { SecondaryHeader } from "../components/SecondaryHeader";

const VerificationCodePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SecondaryHeader />
      <VerificationCode />
    </div>
  );
};

export default VerificationCodePage;
