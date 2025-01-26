import React from "react";
import { VerificationInput } from "@/components/ui/verificationinput";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSendCode } from "@/hooks/useSendCode";
import { useVerifyCode } from "@/hooks/useVerifyCode";

interface VerificationCodeLocationState {
  email?: string;
}

export default function VerificationCode() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    verifyUserCode,
    isLoading: verifyLoading,
    error: verrifyError,
  } = useVerifyCode();
  const {
    sendVerificationCode,
    isLoading: sendCodeLoading,
    error: sendCodeError,
  } = useSendCode();

  const [code, setCode] = useState<string[]>(Array(6).fill(""));

  const location = useLocation();
  const state = location.state as VerificationCodeLocationState | undefined;

  // Retrieve email from location state and trimming it
  const email = state?.email?.trim() || "";

  // Log the email to confirm it's correct
  console.log("Email passed to VerificationCode:", email);
  console.log(location);

  // Ensure email is not null
  useEffect(() => {
    if (!email) {
      console.error("No email provided for verification");
      toast({
        variant: "destructive",
        title: "Error",
        description: "No email provided for verification. Please try again.",
      });
      // Redirect back to sign-up if email is missing
      setTimeout(() => {
        navigate("/signup");
      }, 3000);
    }
  }, [email, navigate, toast]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    nextInputId: string | undefined,
  ) => {
    const value = e.target.value;
    const index = parseInt(e.target.id.split("-")[1]) - 1;

    // Update code array
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value.length === e.target.maxLength && nextInputId) {
      const nextInput = document.getElementById(
        nextInputId,
      ) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleVerify = async () => {
    // const codeString = code.join(""); // To combine code into a string
    const codeString = code.map((char) => char.trim()).join(""); // Ensure no spaces

    // Log the API URL and the request data being sent
    console.log(
      "API URL:",
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-code`,
    );
    console.log("Request Data:", { email, code: code.join("") });

    try {
      const response = await verifyUserCode({ email, code: codeString });

      if (response?.statusCode === 201) {
        // Changed 200 to 201
        toast({
          variant: "success",
          title: "Verification Successful",
          description: "You will be redirected to the home page shortly",
        });

        // Redirect to home page
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        throw new Error("Verification failed. Invalid code or expired.");
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description:
          "You have entered an incorrect verification code. Please try again.",
      });
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Resend failed",
        description: "Please enter an email",
      });
      return;
    }

    try {
      console.log("Sending resend code request for email:", email);
      const response = await sendVerificationCode(email);

      console.log("Resend response:", response);

      if (response?.statusCode === 201) {
        toast({
          variant: "success",
          title: "Resend Verification Code Sucessful",
          description:
            "An email with a new verification code has been sent. It will expire in 10min!!!",
        });
      } else {
        throw new Error("Failed to resend verification code.");
      }
    } catch (err) {
      console.error("Resend error:", err);
      toast({
        variant: "destructive",
        title: "Resend verification code failed.",
        description:
          "Sending a new verification code is not possible at this moment. Try again later.",
      });
    }
  };

  useEffect(() => {
    if (verrifyError) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: verrifyError,
      });
    }
    if (sendCodeError) {
      toast({
        variant: "destructive",
        title: "Resend verification code failed",
        description: sendCodeError,
      });
    }
  }, [verrifyError, sendCodeError, toast]);

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      <div className="w-full pt-32">
        <div className="mx-auto max-w-[90%] md:max-w-[80%] lg:max-w-[60%] p-4">
          <h1 className="text-2xl md:text-4xl text-left">
            Email Verification
            <p className="mt-4 text-sm md:text-lg text-primaryColour-600">
              Please enter the verification code that was sent to your email
              address.
            </p>
          </h1>
        </div>
        <div className="mx-4 md:mx-8 lg:mx-16 mt-10 md:mt-20 p-5 md:p-10">
          <form className="max-w-full sm:max-w-md mx-auto">
            <p className="text-sm md:text-lg mb-4">Enter Verification Code</p>
            <div className="flex mb-2 space-x-4 sm:space-x-10">
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
            <p className="my-2 text-xs md:text-sm text-black">
              Did not receive a code?
              <Button
                variant="link"
                className="ml-2 text-secondaryColour font-bold underline p-0 bg-white border-none hover:bg-transparent"
                onClick={handleResend}
                disabled={sendCodeLoading}
              >
                Resend
              </Button>
            </p>
            <div>
              <Button
                className="w-full text-white bg-primaryColour py-2 md:py-3 rounded-lg flex items-center justify-center text-sm md:text-base"
                onClick={handleVerify}
                disabled={verifyLoading}
              >
                {verifyLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
