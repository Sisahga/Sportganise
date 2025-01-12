import React from "react";
import { VerificationCode } from "../components/VerificationCode/index";

const VerificationCodePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <VerificationCode />
    </div>
  );
};

export default VerificationCodePage;
