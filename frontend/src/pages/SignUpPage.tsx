import React from "react";
import { SignUp } from "../components/SignUp/index";
import { SecondaryHeader } from "@/components/SecondaryHeader";

const SignUpPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SecondaryHeader />
      <SignUp />
    </div>
  );
};

export default SignUpPage;
