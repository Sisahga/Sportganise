import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/formfield";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast"; // Toast hook
import { useSignUp } from "@/hooks/useSignUp";
import { useSendCode } from "@/hooks/useSendCode";
import { SignUpRequest } from "@/types/auth";
import { SecondaryHeader } from "../SecondaryHeader";
import { Progress } from "@/components/ui/progress";
import PasswordChecklist from "react-password-checklist";
import { Separator } from "../ui/separator";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Toast function
  const [isCodeSent, setIsCodeSent] = useState(false); // New flag for sending state

  // Hooks
  const {
    isLoading: signUpLoading,
    error: signUpError,
    signUpUser,
  } = useSignUp();
  const {
    isLoading: sendCodeLoading,
    error: sendCodeError,
    sendVerificationCode,
  } = useSendCode();

  const [emailForVerification, setEmailForVerification] = useState<
    string | null
  >(null);

  const [formData, setFormData] = useState<SignUpRequest>({
    type: "PLAYER",
    email: "",
    password: "",
    phone: "",
    address: {
      line: "",
      city: "",
      province: "",
      country: "",
      postalCode: "",
    },
    firstName: "",
    lastName: "",
  });

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : cleaned;
  };

  const [progress, setProgress] = useState(0);
  const [isChecklistValid, setIsChecklistValid] = useState(false);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;

    setProgress(strength);
  };

  useEffect(() => {
    if (formData.password) calculatePasswordStrength(formData.password);
  }, [formData.password]);

  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasNumber = /\d/.test(password);

    return (
      hasMinLength &&
      [hasUpperCase, hasLowerCase, hasSpecialChar, hasNumber].filter(Boolean)
        .length >= 3
    );
  };

  const [showPassword, setShowPassword] = useState(true);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setFormData((prev) => ({
        ...prev,
        phone: formatPhoneNumber(value),
      }));
      return;
    }

    if (name.includes(".")) {
      // Handle nested fields like 'address.line'
      const [parent, child] = name.split(".");

      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof typeof prev] || {}) as Record<
            string,
            string
          >), // Ensure parent is an object
          [child]: value, // Update the child field
        },
      }));
    } else {
      // Handle flat fields like 'email' and 'password'
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description:
          "Password must meet at least 3 of the following: 8 characters, uppercase letter, lowercase letter, special character.",
      });
      return;
    }

    const validAccountTypes = ["PLAYER", "COACH", "ADMIN"];
    if (!validAccountTypes.includes(formData.type)) {
      toast({
        variant: "destructive",
        title: "Invalid Account Type",
        description: "Please select a valid account type.",
      });
      return;
    }

    try {
      const response = await signUpUser(formData); // Perform sign-up

      if (response?.statusCode === 201) {
        setEmailForVerification(formData.email); // Set email for verification only on success
      }
    } catch (err) {
      console.error("Sign-up failed:", err);
    }
  };

  useEffect(() => {
    if (emailForVerification && !isCodeSent) {
      const sendCode = async () => {
        try {
          setIsCodeSent(true); // Mark as sent
          await sendVerificationCode(emailForVerification);
          toast({
            variant: "success",
            title: "Account Created",
            description: "A verification code has been sent to your email.",
          });

          navigate("/verificationcode", { state: { email: formData.email } });
        } catch (err) {
          setIsCodeSent(false);
          console.error("Failed to send verification code", err);
        }
      };

      sendCode();
    }
  }, [
    emailForVerification,
    isCodeSent,
    sendVerificationCode,
    navigate,
    toast,
    formData.email,
  ]);

  // To handle errors
  useEffect(() => {
    if (signUpError) {
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: signUpError.includes("Account already exists")
          ? "Account already exists."
          : "An unexpected error occurred.",
      });
    }

    if (sendCodeError) {
      toast({
        variant: "destructive",
        title: "Verification Code Failed",
        description: "Failed to send verification code. Please try again.",
      });
    }
  }, [signUpError, sendCodeError, toast]);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-secondaryColour/20 to-white to-[20%]">
      <SecondaryHeader />
      <div className="w-[350px] max-w-lg pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-semibold text-left whitespace-normal text-center">
          Welcome!
        </h1>
        <p className="mt-4 text-lg text-primaryColour-600 whitespace-normal text-center font-medium">
          Create a new account
        </p>

        <Card className="mt-6">
          <CardContent>
            <form className="grid gap-4 mt-5" onSubmit={handleSignUp}>
              <FormField
                id="Email"
                label="Email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <FormField
                id="phone"
                label="Phone"
                placeholder="(123) 456-7890"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                inputProps={{
                  type: "tel",
                  maxLength: 14,
                  pattern: "\\(\\d{3}\\) \\d{3}-\\d{4}",
                }}
              />
              <div className="relative">
                <FormField
                  id="Password"
                  label="Create a Password"
                  placeholder="Password"
                  name="password"
                  inputProps={{ type: showPassword ? "password" : "text" }}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/10 text-sm text-secondaryColour"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Progress Bar */}
              {formData.password && (
                <div className="m-4 mb-2">
                  <Progress value={progress} max={100} />
                </div>
              )}

              <div className="m-4 mb-2">
                {/* Mandatory checks for length and password match*/}
                <div className="mandatory-rules mb-4">
                  <PasswordChecklist
                    className="text-xs"
                    validColor="#82DBD8"
                    invalidColor="#383C42"
                    rules={["minLength"]}
                    minLength={8}
                    value={formData.password}
                    onChange={() => {
                      setIsChecklistValid(validatePassword(formData.password));
                    }}
                  />
                </div>

                <Separator></Separator>

                {/* 3/4 types of characters checks */}
                <div className="optional-rules flex flex-col gap-1 mt-2">
                  <p className="font-normal text-xs">
                    Check at least 3 from the following:
                  </p>

                  <PasswordChecklist
                    className="text-xs"
                    validColor="#82DBD8"
                    invalidColor="#383C42"
                    rules={["capital", "lowercase", "number", "specialChar"]} // Only optional rules
                    minLength={8}
                    value={formData.password}
                    onChange={() => {
                      setIsChecklistValid(validatePassword(formData.password));
                    }}
                  />
                </div>
              </div>
              <FormField
                id="FirstName"
                label="First Name"
                placeholder="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <FormField
                id="LastName"
                label="Last Name"
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <FormField
                id="Address"
                label="Address"
                placeholder="Street #, Name"
                name="address.line"
                value={formData.address.line}
                onChange={handleInputChange}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="Postal Code"
                  label="Postal Code"
                  placeholder="Postal Code"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleInputChange}
                />
                <FormField
                  id="City"
                  label="City"
                  placeholder="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                />
                <FormField
                  id="Province"
                  label="Province"
                  placeholder="Prov"
                  name="address.province"
                  value={formData.address.province}
                  onChange={handleInputChange}
                />
                <FormField
                  id="Country"
                  label="Country"
                  placeholder="Country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                />
              </div>

              <Button
                type="submit"
                className="w-full text-white bg-primaryColour mt-4"
                disabled={signUpLoading || 
                  sendCodeLoading || 
                  !isChecklistValid || 
                  !formData.password ||
                  !formData.email}
              >
                {signUpLoading || sendCodeLoading
                  ? "Creating Account..."
                  : "Sign Up"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
