import React from "react";
import { SignUp } from "@/components/SignUp";
// import { SecondaryHeaderNav } from "../components/SecondaryHeaderNav/index";

const SignUpPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <SecondaryHeaderNav /> */}
      <SignUp />
    </div>
  );
};

export default SignUpPage;