import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { FormField } from "@/components/ui/FormField";
import { SecondaryHeader } from "../SecondaryHeader";

export default function SignUp() {
  return (
    <div>
      <SecondaryHeader />
      <div className="bg-white w-screen pt-32">
        <div className="flex-1 max-w-[100vw] bg-white rounded-t-2xl pb-16">
          <div className="min-h-screen">
            <h1 className="p-10 text-4xl space-y-6 text-center flex flex-col items-center justify-center">
              Welcome !
              <p className="mt-4 text-lg text-primaryColour-600">
                Create a new account
              </p>
            </h1>

            <div className="flex items-center justify-center min-h-1 bg-white">
              <Card className="w-[350px]">
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4 mt-5">
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

                      <div className="flex w-full items-center gap-4">
                        <FormField id="City" label="City" placeholder="City" />
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
                  <Button className="text-white w-full bg-primaryColour">
                    Sign Up
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
