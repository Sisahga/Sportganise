import React from "react";
import { VerificationInput } from "@/components/ui/verificationinput";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/Button";

export default function VerificationCode() {
  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    nextInputId: string | undefined,
  ) => {
    if (e.target.value.length === e.target.maxLength && nextInputId) {
      const nextInput = document.getElementById(
        nextInputId,
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const navigate = useNavigate();

  const handleResend = () => {
    navigate("/"); // Triggers another email with a verification code
  };

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <div className="w-full pt-32">
        <div className="mx-4 md:mx-8 lg:mx-16 p-4">
          <h1 className="text-2xl md:text-4xl text-left">
            Email Verification
            <p className="mt-4 text-sm md:text-lg text-primaryColour-600">
              Please enter the verification code that was sent to your email
              address.
            </p>
          </h1>
        </div>
        <div className="mx-4 md:mx-8 lg:mx-16 mt-10 md:mt-20 p-5 md:p-10">
          <p className="text-sm md:text-lg mb-4">Enter Verification Code</p>
          <form className="max-w-full sm:max-w-md mx-auto">
            <div className="flex mb-2 space-x-4 sm:space-x-7">
              <VerificationInput
                id="code-1"
                nextInputId="code-2"
                handleInput={handleInput}
              />
              <VerificationInput
                id="code-2"
                nextInputId="code-3"
                handleInput={handleInput}
              />
              <VerificationInput
                id="code-3"
                nextInputId="code-4"
                handleInput={handleInput}
              />
              <VerificationInput
                id="code-4"
                nextInputId="code-5"
                handleInput={handleInput}
              />
              <VerificationInput
                id="code-5"
                nextInputId="code-6"
                handleInput={handleInput}
              />
              <VerificationInput id="code-6" handleInput={handleInput} />
            </div>
            <p
              id="helper-text-explanation"
              className="my-2 text-xs md:text-sm text-black"
            >
              Did not receive a code?
              <Button
                className="ml-2 text-secondaryColour font-bold underline p-0 bg-white border-none hover:bg-transparent"
                onClick={handleResend}
              >
                Resend
              </Button>
            </p>
            <Link
              className="text-white bg-primaryColour py-2 md:py-3 rounded-lg flex items-center justify-center text-sm md:text-base"
              to="/" // TODO : When "Verify" link is pressed, it needs to check if code is correct, then redirect to homepage
            >
              Verify
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
