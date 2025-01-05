import React from "react";
import { VerificationInput } from "@/components/ui/verificationinput";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
    // Triggers another email with a verification code being sent
    navigate("/");
  };

  return (
    <div>
      <div className="bg-white w-screen pt-32">
        <div className="m-5 p-4">
          <h1 className="text-4xl space-y-6 text-left">
            Email Verification
            <p className="mt-4 text-lg text-primaryColour-600">
              Please enter the verification code that was sent to your email
              address.
            </p>
          </h1>
        </div>
        <div className="mx-20 mt-20 p-10">
          <p className="text-lg mb-4">Enter Verification Code</p>
          <form className="max-w-sm mx-auto">
            <div className="flex mb-2 space-x-7">
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
              <VerificationInput id="code-4" handleInput={handleInput} />
            </div>
            <p
              id="helper-text-explanation"
              className="my-2 ml-5 text-sm text-black"
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
              className="text-white bg-primaryColour py-1 rounded-lg flex items-center justify-center"
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
