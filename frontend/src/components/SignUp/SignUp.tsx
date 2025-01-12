import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormField } from "@/components/ui/formfield";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Redirect to the VerificationCode page
    navigate("/verificationcode");
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center justify-center">
      <div className="w-[350px]">
        <h1 className="text-4xl text-left">
          Welcome!
          <p className="mt-4 text-lg text-primaryColour-600">
            Create a new account
          </p>
        </h1>

        <Card className="mt-6">
          <CardContent>
            <form className="grid gap-4 mt-5">
              <FormField id="Email" label="Email" placeholder="Email" />
              <FormField
                id="Password"
                label="Password"
                placeholder="Password"
                inputProps={{ type: "password" }}
              />
              <FormField
                id="FirstName"
                label="First Name"
                placeholder="First Name"
              />
              <FormField
                id="LastName"
                label="Last Name"
                placeholder="Last Name"
              />
              <FormField
                id="Address"
                label="Address"
                placeholder="Street #, Name"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField id="City" label="City" placeholder="City" />
                <FormField id="Province" label="Province" placeholder="Prov" />
                <FormField id="Country" label="Country" placeholder="Country" />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              className="w-full text-white bg-primaryColour"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
