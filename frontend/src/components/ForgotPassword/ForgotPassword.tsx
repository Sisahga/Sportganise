import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/formfield";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { useSendCode } from "@/hooks/useSendCode";
import { SecondaryHeader } from "../SecondaryHeader";

export default function ForgotPassword() {
  const { toast } = useToast(); // Toast notifications
  const navigate = useNavigate(); // Navigation hook
  const [email, setEmail] = useState<string>(""); // State to store email input
  const [isCodeSent, setIsCodeSent] = useState(false); // New flag for sending state

  const {
    isLoading: sendCodeLoading,
    error: sendCodeError,
    sendVerificationCode,
  } = useSendCode();

  // Handle the form submission
  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    try {
      console.log("Verifying if email exists");
      const response = await sendVerificationCode(email.trim()); // Calling backend API

      if (response?.statusCode === 201 && !isCodeSent) {
        toast({
          variant: "success",
          title: "Email verified",
          description: "A verification code has been sent to your email.",
        });

        setIsCodeSent(true);

        setTimeout(() => {
          navigate("/verificationcode", {
            state: { email: email, flow: "forgot" },
          });
        }, 2000);
      } else {
        throw new Error("Failed to send verification code.");
      }
    } catch (err: unknown) {
      console.error(
        "An error occured during the password recovery attempt:",
        err,
      );
      if (err instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message || "Failed to send verification code.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unknown error occured.",
        });
      }
    }
  };

  useEffect(() => {
    if (sendCodeError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: sendCodeError,
      });
    }
  }, [sendCodeError, toast]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <SecondaryHeader />
      <h1 className="text-4xl md:text-4xl">Forgot Password</h1>
      <div className="mt-4 md:pr-4">
        <p className="text-center md:text-xl">
          {" "}
          Enter the email associated to your account.
        </p>
        <p className="text-center md:text-xl">
          We will send you an email with instructions for the password reset.
        </p>
        <div className="px-8 pt-10">
          <form
            className="grid gap-4 mt-5 max-w-xl"
            onSubmit={handlePasswordRecovery}
          >
            <FormField
              id="Email"
              label="Email"
              placeholder="Example@gmail.com"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="w-full mt-8 text-white text-base bg-primaryColour"
              type="submit"
              disabled={sendCodeLoading}
            >
              {sendCodeLoading ? "Sending..." : "Recover Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
