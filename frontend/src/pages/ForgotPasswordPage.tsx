import React from "react";
import { ForgotPassword } from "../components/ForgotPassword/index";
import { SecondaryHeader } from "@/components/SecondaryHeader";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SecondaryHeader />
      <ForgotPassword />
    </div>
  );
};

export default ForgotPasswordPage;
