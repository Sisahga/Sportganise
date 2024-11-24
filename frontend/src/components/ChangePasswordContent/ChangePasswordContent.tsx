import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import PasswordChecklist from "react-password-checklist";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { MoveLeft } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils"; // Import the cn utility

const ChangePasswordContent: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordAgainChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordAgain(e.target.value);
  };

  const handlePasswordCheck = () => {
    if (isValid && password === passwordAgain) {
      setMessage("Password changed successfully!");
      setIsSuccess(true);
    } else {
      setMessage("Password change unsuccessful!");
      setIsSuccess(false);
    }
  };

  return (
    <div className="px-4 flex-1 pb-16">
      <div className="py-1 min-h-screen">
        <Button
          className="rounded-full"
          variant="outline"
          onClick={() => navigate("/pages/ProfilePage")}
        >
          <MoveLeft />
        </Button>

        <div className="p-16 flex flex-col mt-8">
          <form>
            <Label>New Password:</Label>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />

            <Label>Confirm New Password:</Label>
            <Input
              type="password"
              value={passwordAgain}
              onChange={handlePasswordAgainChange}
            />

            <PasswordChecklist
              rules={["minLength", "specialChar", "number", "capital", "match"]}
              minLength={8}
              value={password}
              valueAgain={passwordAgain}
              onChange={(isValid) => setIsValid(isValid)}
            />

            <div className="flex justify-center pt-8">
              <Button
                className="w-40 py-6 bg-secondaryColour text-white rounded-full"
                variant="outline"
                type="button"
                onClick={handlePasswordCheck}
              >
                Change Password
              </Button>
            </div>
          </form>
        </div>

        {/* Display message */}
        <div>
          <p className="text-center">
            <span
              className={cn(
                "font-medium",
                isSuccess ? "text-green-500" : "text-red",
              )}
            >
              {message}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordContent;
