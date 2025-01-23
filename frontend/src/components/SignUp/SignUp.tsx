import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField } from "@/components/ui/formfield";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast"; // Toast hook
import { useSignUp } from "@/hooks/useSignUp";
import { useSendCode } from "@/hooks/useSendCode";
import { SignUpRequest } from "@/types/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SignUp() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Toast function

  // Hooks
  const {
    isLoading: signUpLoading,
    error: signUpError,
    emailForVerification,
    signUpUser,
  } = useSignUp();
  const { isLoading: sendCodeLoading, error: sendCodeError } =
    useSendCode(emailForVerification);

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

  // Password validation logic
  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);

    return (
      [hasMinLength, hasUpperCase, hasLowerCase, hasSpecialChar].filter(Boolean)
        .length >= 3
    );
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

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

  const handleAccountTypeChange = (type: "PLAYER" | "COACH" | "ADMIN") => {
    setFormData((prev) => ({
      ...prev,
      type,
    }));
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

    signUpUser(formData);
  };

  useEffect(() => {
    if (emailForVerification && !sendCodeError) {
      toast({
        variant: "success",
        title: "Account Created",
        description:
          "A verification code has been sent to your email. Redirecting...",
      });

      // Redirect to verification code page
      navigate("/verificationcode");
    }

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
  }, [emailForVerification, signUpError, sendCodeError, navigate, toast]);

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center mt-20 px-4 sm:px-6 lg:px-8">
      <div className="w-[350px] max-w-lg">
        <h1 className="text-3xl md:text-4xl text-left whitespace-normal">
          Welcome!
          <p className="mt-4 text-lg text-primaryColour-600 whitespace-normal">
            Create a new account
          </p>
        </h1>

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
                id="Password"
                label="Password"
                placeholder="Password"
                name="password"
                inputProps={{ type: "password" }}
                value={formData.password}
                onChange={handleInputChange}
              />
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

              <div>
                <label htmlFor="accountType" className="text-sm font-medium">
                  Account Type
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      id="accountType"
                      variant="outline"
                      className="w-full mt-2"
                    >
                      {formData.type}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleAccountTypeChange("PLAYER")}
                    >
                      Player
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAccountTypeChange("COACH")}
                    >
                      Coach
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAccountTypeChange("ADMIN")}
                    >
                      Admin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Button
                type="submit"
                className="w-full text-white bg-primaryColour mt-4"
                disabled={signUpLoading || sendCodeLoading}
                // disabled={isLoading} // To disable the button while the API call is being made
              >
                {signUpLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
