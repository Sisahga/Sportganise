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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Country, State } from "country-state-city";

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
                <div className="space-y-2">
                  <label htmlFor="country" className="text-sm font-medium">
                    Country
                  </label>
                  <Select
                    value={formData.address.country}
                    onValueChange={(value) => {
                      setFormData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          country: value,
                          // Reset province when country changes
                          province: value === "Canada" ? prev.address.province : "",
                        },
                      }))
                    }}
                  >
                    <SelectTrigger id="country">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {Country.getAllCountries().map((country) => (
                        <SelectItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {State.getStatesOfCountry(formData.address.country).length > 0 ? (
                  <div className="space-y-2">
                    <label htmlFor="province" className="text-sm font-medium">
                      Province/State
                    </label>
                    <Select
                      value={formData.address.province}
                      onValueChange={(value) => {
                        setFormData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            province: value,
                          },
                        }))
                      }}
                    >
                      <SelectTrigger id="province">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {State.getStatesOfCountry(formData.address.country).map((state) => (
                          <SelectItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <FormField
                    id="Province"
                    label="Province/State"
                    placeholder="Province/State"
                    name="address.province"
                    value={formData.address.province}
                    onChange={handleInputChange}
                  />
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-white bg-primaryColour mt-4"
                disabled={signUpLoading || sendCodeLoading}
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
