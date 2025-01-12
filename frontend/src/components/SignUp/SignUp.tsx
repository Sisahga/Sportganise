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
    <div>
      <div className="bg-white w-screen pt-32">
        <div className="flex-1 max-w-[100vw] bg-white rounded-t-2xl pb-16">
          <div className="min-h-screen">
            <div className="flex items-center justify-center min-h-1 bg-white">
              <div className="w-[350px]">
                <h1 className="text-4xl space-y-6 text-left">
                  Welcome !
                  <p className="mt-4 text-lg text-primaryColour-600">
                    Create a new account
                  </p>
                </h1>

                <Card className="w-[350px] mt-6">
                  <CardContent>
                    <form>
                      <div className="grid w-full items-center gap-4 mt-5">
                        <FormField
                          id="Email"
                          label="Email"
                          placeholder="Email"
                        />
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

                        <div className="flex w-full items-center gap-4">
                          <FormField
                            id="City"
                            label="City"
                            placeholder="City"
                          />
                          <FormField
                            id="Province"
                            label="Province"
                            placeholder="Prov"
                          />
                          <FormField
                            id="Country"
                            label="Country"
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button
                      className="text-white w-full bg-primaryColour"
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
