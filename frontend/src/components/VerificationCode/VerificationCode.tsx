import React from "react";
import { VerificationInput } from "@/components/ui/verificationinput";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { useSendCode } from "@/hooks/useSendCode";
import { useVerifyCode } from "@/hooks/useVerifyCode";
import log from "loglevel";
import { clearCookies } from "@/services/cookiesService";

interface VerificationCodeLocationState {
  email?: string;
  flow?: string;
}

export default function VerificationCode() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);

  const {
    verifyUserCode,
    isLoading: verifyLoading,
    error: verifyError,
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
    const target = e.target;
    const value = target.value;
    const index = parseInt(target.id.split("-")[1]) - 1;

    // Handle pasting
    if (value.length > 1) {
      e.preventDefault();
      const pastedValue = value.replace(/\D/g, "").slice(0, 6).split("");
      const newCode = [...code];

      // Fill in the values
      pastedValue.forEach((char, i) => {
        if (i < 6) newCode[i] = char;
      });

      setCode(newCode);
      return;
    }

    // Handle single character input
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Move to next input if value is entered
    if (value && nextInputId) {
      const nextInput = document.getElementById(
        nextInputId,
      ) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = Array(6).fill("");

    pastedData.split("").forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });

    // Update all inputs with the pasted values
    newCode.forEach((value, index) => {
      const input = document.getElementById(
        `code-${index + 1}`,
      ) as HTMLInputElement;
      if (input) input.value = value;
    });

    setCode(newCode);

    // Focus the last filled input or the last input if all are filled
    const lastFilledIndex = Math.min(pastedData.length + 1, 6);
    const lastInput = document.getElementById(
      `code-${lastFilledIndex}`,
    ) as HTMLInputElement;
    if (lastInput) {
      lastInput.focus();
    }
  };

  // Add a new handler for keydown events
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    prevInputId?: string,
  ) => {
    const target = e.target as HTMLInputElement;
    const index = parseInt(target.id.split("-")[1]) - 1;
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab", "v"]; // 'v' for paste shortcuts

    if (!/^\d$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault(); // Block non-numeric input
    }

    // Handle backspace
    if (e.key === "Backspace") {
      const newCode = [...code];

      if (newCode[index] === "") {
        // If current input is empty, move to previous input
        if (prevInputId) {
          const prevInput = document.getElementById(
            prevInputId,
          ) as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
            // Clear the previous input's value
            newCode[index - 1] = "";
            setCode(newCode);
          }
        }
      } else {
        // Clear current input
        newCode[index] = "";
        setCode(newCode);
      }
    }
  };

  const handleVerify = async () => {
    // const codeString = code.join(""); // To combine code into a string
    const codeString = code.map((char) => char.trim()).join(""); // Ensure no spaces
    log.info("Verifying code for email:", email, "with code:", codeString);

    // Log the API URL and the request data being sent
    console.log(
      "API URL:",
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-code`,
    );
    console.log("Request Data:", { email, code: code.join("") });

    try {
      const response = await verifyUserCode({ email, code: codeString });

      if (response?.statusCode === 201) {
        setVerified(true);

        log.info("Current flow:", state?.flow);
        log.info("Full state:", state);
        // Check the flow property passed in the location state
        if (state?.flow === "forgot") {
          log.info(
            "Verification successful, navigating to ChangeForgottenPasswordPage",
          );
          log.info("Flow is 'forgot', should redirect to change password");
          toast({
            variant: "success",
            title: "Verification Successful",
            description: "Redirecting to password reset page",
          });
          setTimeout(() => {
            log.info(
              "Navigating to ChangeForgottenPasswordPage with email:",
              state.email,
            );
            clearCookies();
            navigate("/pages/ChangeForgottenPasswordPage", {
              replace: true,
              state: { email: state.email, fromVerification: true },
            });
          });
        } else {
          log.info(
            "Flow is not 'forgot', redirecting to home. Current flow:",
            state?.flow,
          );
          // Default behavior (e.g., sign-up flow)
          toast({
            variant: "success",
            title: "Verification Successful",
            description: "You will be redirected to the home page shortly",
          });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
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
      const token = localStorage.getItem("authToken"); // Retrieve token from storage
      const headers = {
        Authorization: `Bearer ${token}`, // Add token here
        "Content-Type": "application/json",
      };

      console.log("Token:", token); // Log the token for debugging
      console.log("Headers:", headers); // Log the headers to confirm they're correct

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
    if (verifyError) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: verifyError,
      });
    }
    if (sendCodeError) {
      toast({
        variant: "destructive",
        title: "Resend verification code failed",
        description: sendCodeError,
      });
    }
  }, [verifyError, sendCodeError, toast]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-secondaryColour/20 to-white to-[20%]">
      <div className="w-full pt-32">
        <div className="mx-auto max-w-[90%] md:max-w-[80%] lg:max-w-[60%] p-4">
          <h1 className="text-2xl md:text-4xl text-center">
            Email Verification
            <p className="mt-4 text-sm md:text-lg text-primaryColour-600 text-center">
              Please enter the verification code that was sent to your email
              address.
            </p>
          </h1>
        </div>
        <div className="mx-4 md:mx-8 lg:mx-16 mt-10 md:mt-20 p-5 md:p-10">
          <form className="max-w-full sm:max-w-md mx-auto">
            <fieldset className="flex mb-2 gap-2 w-full">
              <legend className="text-sm md:text-lg mb-4">
                Enter Verification Code
              </legend>

              <div
                onPaste={handlePaste}
                className="flex flex-row gap-3 justify-center"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <VerificationInput
                    key={num}
                    id={num}
                    handleInput={handleInput}
                    handleKeyDown={handleKeyDown}
                  />
                ))}
              </div>
            </fieldset>
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
                disabled={verifyLoading || verified}
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
