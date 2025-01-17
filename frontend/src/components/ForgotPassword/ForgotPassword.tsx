import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/formfield";
// import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="mt-36 px-4 md:mt-36 md:px-8 lg:px-16">
      <h1 className="text-4xl">Forgot Password</h1>
      <div className="mt-4 md:pr-4">
        <p> Enter the email associated to your account.</p>
        <p>
          We will send you an email with instructions for the password reset.
        </p>
        <div className="px-8 pt-16">
          <form className="grid gap-4 mt-5">
            <FormField
              id="Email"
              label="Email"
              placeholder="Example@gmail.com"
              name="email"
              // value={formData.email}
              // onChange={handleInputChange}
            />
          </form>
          <Button
            className="w-full mt-8 text-white text-base bg-primaryColour"
            // onClick={handleSignUp}
          >
            Recover Password
          </Button>
        </div>
      </div>
    </div>
  );
}
