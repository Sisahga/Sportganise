import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormField } from "@/components/ui/formfield";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { Link } from "react-router-dom";

export default function LogIn() {
  const navigate = useNavigate();

  const handleLogIn = () => {
    // Redirect to the VerificationCode page
    navigate("/verificationcode");
  };

  return (
    <div className="flex flex-col items-center justify center min-h-screen bg-white pt-10">
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
            <FormField id="Email" label="Email" placeholder="Email" />
            <FormField
              id="Password"
              label="Password"
              placeholder="Password"
              inputProps={{ type: "password" }}
            />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="w-full text-white bg-primaryColour"
            onClick={handleLogIn}
          >
            Log In
          </Button>
        </CardFooter>
        <p
          id="helper-text-explanation"
          className="my-2 ml-6 text-xs md:text-sm text-black"
        >
          Don't have an account?
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
