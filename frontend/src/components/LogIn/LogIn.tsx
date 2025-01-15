import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormField } from "@/components/ui/formfield";
import logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast"; // Toast hook
import { useLogin } from "@/hooks/useLogin"; // Custom hook

export default function LogIn() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Toast function
  const { isLoading, error, data, loginUser } = useLogin(); // Hook state and function

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Helper function to validate password constraints
  const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8; // Check if password has at least 8 characters
    const hasUpperCase = /[A-Z]/.test(password); // Check if password has an uppercase letter
    const hasLowerCase = /[a-z]/.test(password); // Check if password has a lowercase letter
    const hasSpecialChar = /[!@#$%^&*]/.test(password); // Check if password has a special character

    // Count how many conditions are met
    const conditionsMet = [
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasSpecialChar,
    ].filter(Boolean).length;

    console.log("Password Validation Conditions:", {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasSpecialChar,
    }); // Debug: Log results

    return conditionsMet >= 3; // Return true if at least 3 conditions are met
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login submission
  const handleLogIn = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password constraints
    if (!validatePassword(formData.password)) {
      toast({
        variant: "destructive",
        title: "Invalid Password",
        description:
          "Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, and 1 special character (!@#$%^&*).",
      });
      return;
    }

    console.log("Calling loginUser with:", formData); // Debug
    loginUser(formData).catch((err) => {
      console.error("Login error:", err); // Debug: Log error
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid Credentials",
      });
    });
  };

  // Handle login success or error by listening to changes in data
  useEffect(() => {
    if (data?.statusCode === 200) {
      console.log("Login successful, redirecting..."); // Debug
      navigate("/");
    }

    if (error) {
      console.log("Error:", error); // Debug
      // Show toast for invalid credentials or errors
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid Credentials",
      });
    }
  }, [data, error, navigate, toast]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white pt-10">
      <img
        src={logo}
        alt="Logo"
        className="w-4/5 max-w-[400px] rounded-lg object-contain"
      />
      <p className="mt-8 text-lg text-primaryColour-600"> Welcome </p>
      <p className="mt-6 text-lg text-primaryColour-600"> Please Log in </p>

      <Card className="mt-6 w-4/5 max-w-[400px] p-1">
        <CardContent>
          <form className="grid gap-4 mt-5" onSubmit={handleLogIn}>
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
            <button
              type="submit"
              className="w-full text-white bg-primaryColour py-2 md:py-3 rounded-lg flex items-center justify-center text-sm md:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center">
          <p
            id="helper-text-explanation"
            className="my-2 text-xs md:text-sm text-black"
          >
            Don&#39;t have an account?
            <Link
              className="ml-2 text-secondaryColour font-bold underline p-0 bg-white border-none hover:bg-transparent"
              to="/signup"
            >
              Sign Up
            </Link>
          </p>
          <p className="mt-2 mb-6 text-primaryColour text-xs font-semibold underline p-0 bg-white border-none hover:bg-transparent">
            <Link to="/">Forgot password?</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
