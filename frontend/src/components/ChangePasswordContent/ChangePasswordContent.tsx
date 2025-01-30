import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import PasswordChecklist from "react-password-checklist";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCookies, getEmailCookie } from "@/services/cookiesService";
import useModifyPassword from "@/hooks/useModifyPassword";
import { ChangePasswordFormValues } from "@/types/auth";
import log from "loglevel";
import BackButton from "../ui/back-button";
import { KeyRound } from "lucide-react";

const ChangePasswordContent: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const cookies = getCookies();
  const email = cookies ? getEmailCookie(cookies) : null;

  useEffect(() => {
    if (!cookies || !email) {
      log.warn("No valid session. Redirecting to login.");
      navigate("/login");
    }
  }, [cookies, email, navigate]);

  const form = useForm<ChangePasswordFormValues>({
    defaultValues: {
      email: email || "",
      oldPassword: "",
      password: "",
      passwordAgain: "",
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const [progress, setProgress] = useState(0);
  const [isChecklistValid, setIsChecklistValid] = useState(false);
  const password = watch("password");
  const passwordAgain = watch("passwordAgain");
  const { isLoading, success, Message, error, modifyPassword } =
    useModifyPassword();

  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[a-z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 20;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;

    setProgress(strength);
  };

  useEffect(() => {
    if (password) calculatePasswordStrength(password);
  }, [password]);

  const handleChecklistChange = (isValid: boolean) => {
    setIsChecklistValid(isValid);
  };

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    log.debug("Form submitted with data:", data);

    if (!isChecklistValid) {
      log.warn("Form submission blocked due to invalid password checklist");
      toast({
        title: "Password change unsuccessful!",
        description: "Please ensure the checklist is fulfilled.",
        variant: "destructive",
      });
      return;
    }

    modifyPassword({
      email: data.email,
      oldPassword: data.oldPassword,
      newPassword: data.password,
    });
  };

  useEffect(() => {
    if (success) {
      toast({
        title: "Success!",
        description: Message,
        variant: "success",
      });
    } else if (error) {
      toast({
        title: "Error!",
        description: Message,
        variant: "destructive",
      });
    }
  }, [Message, error, toast]);

  return (
    <div className="">
      <BackButton />

      {/* Card for the entire form */}
      <Card className="shadow-md mb-24 mt-4 mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl font-bold items-center justify-center gap-2">
            <KeyRound className="h-6 w-6" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="text-sm space-y-4"
            >
              {/* Old Password Field */}
              <FormField
                name="oldPassword"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Label>Current password</Label>
                    <FormControl>
                      <Input
                        className="text-sm"
                        {...field}
                        type="password"
                        placeholder="Enter your current password"
                        required
                      />
                    </FormControl>
                    <FormMessage>{errors.oldPassword?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* New Password Field */}
              <FormField
                name="password"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Label>New password</Label>
                    <FormControl>
                      <Input
                        className="text-sm"
                        {...field}
                        type="password"
                        placeholder="Enter your new password"
                        required
                      />
                    </FormControl>
                    <FormMessage>{errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Confirm New Password Field */}
              <FormField
                name="passwordAgain"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <Label>Confirm password</Label>
                    <FormControl>
                      <Input
                        className="text-sm"
                        {...field}
                        type="password"
                        placeholder="Confirm your new password"
                        required
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
                  validColor="#82DBD8"
                  invalidColor="#383C42"
                  rules={[
                    "minLength",
                    "capital",
                    "lowercase",
                    "number",
                    "specialChar",
                    "match",
                  ]}
                  minLength={8}
                  value={password}
                  valueAgain={passwordAgain}
                  onChange={handleChecklistChange}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center p-2">
                <Button
                  className="w-40 h-10 bg-secondaryColour text-white rounded-xl"
                  variant="outline"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Changing Password..." : "Change Password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordContent;
