import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormField } from "@/components/ui/formfield";
import logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"; // Import the toast hook
import { ToastAction } from "@radix-ui/react-toast";

export default function LogIn() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Access the toast function

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login submission
  const handleLogIn = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.status === 200) {
        // Redirect on successful login
        navigate("/");
      } else {
        // Show error message on invalid credentials
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.message || "Email or password is incorrect.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      // Show toast notification for unexpected errors
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "An unexpected error occurred. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white pt-10">
      <img
        src={logo}
        alt="Logo"
        className="w-4/5 max-w-[400px] rounded-lg object contain"
      />
      <p className="mt-8 text-lg text-primaryColour-600"> Welcome </p>
      <p className="mt-6 text-lg text-primaryColour-600"> Please Log in </p>

      <Card className="mt-6 w-4/5 max-w-[400px] p-1">
        <CardContent>
          <form className="grid gap-4 mt-5">
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
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <button
            className="w-full text-white bg-primaryColour py-2 md:py-3 rounded-lg flex items-center justify-center text-sm md:text-base"
            onClick={handleLogIn}
          >
            Log In
          </button>
        </CardFooter>
        <p
          id="helper-text-explanation"
          className="my-2 ml-6 text-xs md:text-sm text-black"
        >
          Don&#39;t have an account?
          <Link
            className="ml-2 text-secondaryColour font-bold underline p-0 bg-white border-none hover:bg-transparent"
            to="/signup"
          >
            Sign Up
          </Link>
        </p>
        <Link
          className="ml-6 mb-6 text-primaryColour text-xs font-semibold underline p-0 bg-white border-none hover:bg-transparent"
          to="/"
        >
          Forgot password?
        </Link>
      </Card>
    </div>
  );
}
