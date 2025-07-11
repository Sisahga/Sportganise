import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormField } from "@/components/ui/formfield";
import logo from "../../assets/Logo.png";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLogin } from "@/hooks/useLogin";
import { useSendCode } from "@/hooks/useSendCode";
import { Eye, EyeOff } from "lucide-react";

export default function LogIn() {
  const navigate = useNavigate();
  const { toast } = useToast(); // Toast function
  const { isLoading, error, data, loginUser } = useLogin();
  const { sendVerificationCode } = useSendCode();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(true);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login submission
  const handleLogIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Email validation regex and TLD set
    const validEmailRegex =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?<tld>[a-zA-Z]{2,})$/;
    const validTLDs = new Set([
      "com",
      "org",
      "net",
      "edu",
      "gov",
      "mil",
      "io",
      "co",
      "ai",
      "ca",
      "uk",
      "us",
      "au",
      "de",
      "fr",
      "jp",
      "cn",
      "in",
      "ru",
      "br",
      "it",
      "es",
      "nl",
      "se",
      "no",
      "fi",
      "dk",
      "pl",
      "ch",
      "be",
      "ar",
      "mx",
      "za",
      "nz",
      "sg",
      "hk",
      "id",
      "my",
    ]);

    // Validate email format
    const match = formData.email.match(validEmailRegex);
    if (
      !match ||
      !match.groups ||
      !validTLDs.has(match.groups.tld.toLowerCase())
    ) {
      toast({
        variant: "destructive",
        title: "Invalid Email Format",
        description: "Please use a valid email format with a real domain.",
      });
      return;
    }

    // Additional check to reject emails with consecutive dots (..)
    if (formData.email.includes("..")) {
      toast({
        variant: "destructive",
        title: "Invalid Email Format",
        description: "Email cannot contain consecutive dots.",
      });
      return;
    }

    console.log("Login Request Sent");
    loginUser(formData).catch((err) => {
      console.error("Login error:", err);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: err.message,
      });
    });
  };

  // Handle login success or error
  useEffect(() => {
    if (data?.statusCode === 200) {
      localStorage.removeItem("pushNotifications");
      console.log("Login successful, redirecting...");
      navigate("/");
    }

    if (error) {
      console.log("Error:", error);
      if (error == "Account not verified") {
        navigate("/verificationcode", {
          state: { email: formData.email },
        });

        // Send verification code when account is not verified
        sendVerificationCode(formData.email.trim()).then((codeResponse) => {
          if (codeResponse?.statusCode === 201) {
            toast({
              variant: "success",
              title: "Verification Code Sent",
              description: "A verification code has been sent to your email.",
            });
          }
        });
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error,
      });
    }
  }, [data, error, navigate, toast]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white bg-gradient-to-b from-secondaryColour/20 to-white to-[20%]">
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
            <div className="relative">
              <FormField
                id="Password"
                label="Password"
                placeholder="Password"
                name="password"
                inputProps={{ type: showPassword ? "password" : "text" }}
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute right-4 text-sm text-secondaryColour"
                style={{ top: "34px" }}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
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
              className="ml-2 text-secondaryColour font-bold underline p-0 bg-white border-none hover:bg-transparent hover:text-primaryColour"
              to="/signup"
            >
              Sign Up
            </Link>
          </p>
          <p>
            <Link
              className="mt-2 mb-6 text-primaryColour hover:text-secondaryColour text-xs font-semibold underline p-0 bg-white border-none hover:bg-transparent"
              to="/forgotpassword"
            >
              Forgot password?
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
