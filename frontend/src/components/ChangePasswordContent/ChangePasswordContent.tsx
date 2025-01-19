/**TODO: Connect to backend with API endpoints. Using mock data as of right now. */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { MoveLeft } from "lucide-react";
import PasswordChecklist from "react-password-checklist";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface ChangePasswordFormValues {
  oldPassword: string;
  password: string;
  passwordAgain: string;
}

const ChangePasswordContent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ChangePasswordFormValues>({
    defaultValues: {
      oldPassword: "",
      password: "",
      passwordAgain: "",
    },
  });

  const { handleSubmit, control, watch, formState: { errors } } = form;
  const [progress, setProgress] = useState(0);
  const [isChecklistValid, setIsChecklistValid] = useState(false);
  const password = watch("password");
  const passwordAgain = watch("passwordAgain");

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;

    setProgress(strength);
  };

  useEffect(() => {
    if (password) calculatePasswordStrength(password);
  }, [password]);

  // Track password checklist validity
  const handleChecklistChange = (isValid: boolean) => {
    setIsChecklistValid(isValid);
  };

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = (data) => {
    if (!isChecklistValid) {
      toast({
        title: "Password change unsuccessful!",
        description: "Please ensure the checklist is fulfilled.",
        variant: "destructive",
      });
      return;
    }

    if (data.oldPassword === "0987aaaAA." && data.password === data.passwordAgain) {
      console.log("Old Password:", data.oldPassword);
      console.log("New Password:", data.password);
      console.log("Confirm New Password:", data.passwordAgain);

      toast({
        title: "Password changed successfully!",
        description: "Your password has been updated.",
        variant: "default",
      });
    } else if (data.oldPassword !== "0987aaaAA.") {
      toast({
        title: "Password change unsuccessful!",
        description: "Please check your old password is correct.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div>
        <Button
          className="rounded-full w-2"
          variant="outline"
          onClick={() => navigate("/pages/ProfilePage")}
        >
          <MoveLeft />
        </Button>
      </div>

      <div>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="m-4 space-y-4">
            {/* Old Password */}
            <FormField
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <Label>Old Password:</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your old password"
                    />
                  </FormControl>
                  <FormMessage>{errors.oldPassword?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              name="password"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <Label>New Password:</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your new password"
                    />
                  </FormControl>
                  <FormMessage>{errors.password?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Confirm New Password */}
            <FormField
              name="passwordAgain"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <Label>Confirm New Password:</Label>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm your new password"
                    />
                  </FormControl>
                  <FormMessage>{errors.passwordAgain?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Progress Bar */}
            {password && (
              <div className="m-4 mb-2">
                <Progress value={progress} max={100} />
              </div>
            )}

            {/* Password Checklist */}
            <div className="m-4 mb-2">
              <PasswordChecklist
                rules={["minLength", "specialChar", "number", "capital", "match"]}
                minLength={8}
                value={password}
                valueAgain={passwordAgain}
                onChange={handleChecklistChange}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pb-24">
              <Button
                className="w-40 h-10 bg-secondaryColour text-white rounded-full"
                variant="outline"
                type="submit"
              >
                Change Password
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordContent;
