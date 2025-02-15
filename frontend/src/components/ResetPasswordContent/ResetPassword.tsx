import React, { useState, useEffect } from "react";
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
import { ResetPasswordFormValues } from "@/types/auth";
import log from "loglevel";
import { KeyRound } from "lucide-react";
import { SecondaryHeader } from "../SecondaryHeader";
import { Separator } from "../ui/separator";
import useResetPassword from "@/hooks/useResetPassword";
import { useLocation, useNavigate } from "react-router";

interface ChangeForgottenPasswordState {
  email?: string;
  flow?: string;
}

const ChangeForgottenPasswordContent: React.FC = () => {
  const { toast } = useToast();

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ChangeForgottenPasswordState | undefined;

  // Retrieve email from location state and trimming it
  const email = state?.email?.trim() || "";

  const form = useForm<ResetPasswordFormValues>({
    defaultValues: {
      email: email || "",
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
  const { resetPassword, isLoading, message, success, error } =
    useResetPassword();

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

  const validatePassword = (
    password: string,
    passwordAgain: string,
  ): boolean => {
    const hasMinLength = password.length >= 8;
    const passwordsMatch = password === passwordAgain;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    const hasNumber = /\d/.test(password);

    return (
      hasMinLength &&
      passwordsMatch &&
      [hasUpperCase, hasLowerCase, hasSpecialChar, hasNumber].filter(Boolean)
        .length >= 3
    );
  };

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    log.debug("Form submitted with data:", data);

    if (!isChecklistValid) {
      log.warn("Form submission blocked due to invalid password checklist");
      toast({
        title: "Password reset unsuccessful!",
        description: "Please ensure the checklist is fulfilled.",
        variant: "destructive",
      });
      return;
    }
    resetPassword({ email: data.email, newPassword: data.password });
  };

  useEffect(() => {
    if (success) {
      navigate("/login");
      toast({
        title: "Success!",
        description: message,
        variant: "success",
      });
    } else if (error) {
      toast({
        title: "Error!",
        description: message,
        variant: "destructive",
      });
    }
  }, [message, error, toast]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <SecondaryHeader />
      <Card className="shadow-md mb-8 mt-4 mx-auto w-full max-w-sm sm:max-w-xs md:max-w-lg lg:max-w-xl xl:max-w-3xl max-w-3xl">
        <CardHeader>
          <CardTitle className="flex justify-center text-2xl font-bold items-center justify-center gap-2">
            <KeyRound className="h-6 w-6" />
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="text-sm space-y-4"
            >
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

              {password && (
                <div className="m-4 mb-2">
                  <Progress value={progress} max={100} />
                </div>
              )}

              <div className="m-4 mb-2">
                <div className="mandatory-rules mb-4">
                  <PasswordChecklist
                    className="text-xs"
                    validColor="#82DBD8"
                    invalidColor="#383C42"
                    rules={["minLength", "match"]}
                    minLength={8}
                    value={password}
                    valueAgain={passwordAgain}
                    onChange={() => {
                      setIsChecklistValid(
                        validatePassword(password, passwordAgain),
                      );
                    }}
                  />
                </div>

                <Separator></Separator>

                <div className="optional-rules flex flex-col gap-1 mt-2">
                  <p className="font-semibold ">
                    Check at least 3 from the following:
                  </p>

                  <PasswordChecklist
                    className="text-xs"
                    validColor="#82DBD8"
                    invalidColor="#383C42"
                    rules={["capital", "lowercase", "number", "specialChar"]}
                    minLength={8}
                    value={password}
                    valueAgain={passwordAgain}
                    onChange={() => {
                      setIsChecklistValid(
                        validatePassword(password, passwordAgain),
                      );
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-center p-2">
                <Button
                  className="w-40 h-10"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangeForgottenPasswordContent;
