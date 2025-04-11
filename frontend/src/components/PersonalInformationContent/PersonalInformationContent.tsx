import React, { useEffect } from "react";
import { useNavigate } from "react-router";
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
import { LoaderCircle, SquarePen } from "lucide-react";
import { useForm } from "react-hook-form";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
import log from "loglevel";
import BackButton from "../ui/back-button";
import useGetCookies from "@/hooks/useGetCookies.ts";

const PersonalInformationContent: React.FC = () => {
  const navigate = useNavigate();
  const { userId, cookies, preLoading } = useGetCookies();

  const { data, loading, error, fetchAccountData } = usePersonalInformation();
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (!preLoading) {
      if (!cookies || !userId) {
        log.warn("No cookies or account ID found. Redirecting to login...");
        navigate("/login");
      } else if (cookies && userId !== 0) {
        fetchAccountData(userId).then((_) => _);
      }
    }
  }, [cookies, userId, preLoading, navigate]);

  useEffect(() => {
    if (!preLoading && data) {
      form.reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address?.line ?? "",
        city: data.address?.city ?? "",
        province: data.address?.province ?? "",
        postalCode: data.address?.postalCode ?? "",
        country: data.address?.country ?? "",
      });
    }
  }, [data, preLoading]);

  if (preLoading || loading || !data) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

  if (error) return <div className="text-red">{error}</div>;

  return (
    <div className="pb-8 min-h-screen">
      <BackButton />

      <div className="flex flex-col items-center justify-center mt-2">
        <div className="relative">
          <img
            className="h-48 w-48 rounded-full border-2 border-gray-300 mx-auto my-2"
            src={data?.pictureUrl || "https://via.placeholder.com/150"}
            alt="Profile"
          />
        </div>

        {/* Edit Profile Button */}
        <Button
          className="mt-2 px-4"
          variant="default"
          onClick={() => navigate("/pages/EditProfilePage")}
        >
          <SquarePen />
          Edit
        </Button>

        <h2 className="mt-4 text-2xl font-bold">Personal Information</h2>

        <Form {...form}>
          <form className="p-4 space-y-4 mt-1">
            {/* First Name */}
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="firstName">First Name</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="firstName"
                      placeholder={data?.firstName ?? ""}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="lastName">Last Name</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="lastName"
                      placeholder={data?.lastName ?? ""}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="email">Email</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="email"
                      placeholder={data?.email ?? ""}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              name="phone"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="phone">Phone</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="phone"
                      placeholder={data?.phone ?? ""}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="address">Address</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="address"
                      placeholder={data?.address?.line ?? ""}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Postal Code */}
            <FormField
              name="postalCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <FormControl>
                    <Input
                      {...field}
                      id="postalCode"
                      placeholder={data?.address?.postalCode ?? ""}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City, Province, Country - grouped */}
            <div className="flex pb-20 space-x-2">
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label htmlFor="city">City</Label>
                    <FormControl>
                      <Input
                        {...field}
                        id="city"
                        placeholder={data?.address?.city ?? ""}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="province"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label htmlFor="province">Province</Label>
                    <FormControl>
                      <Input
                        {...field}
                        id="province"
                        placeholder={data?.address?.province ?? ""}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="country"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <Label htmlFor="country">Country</Label>
                    <FormControl>
                      <Input
                        {...field}
                        id="country"
                        placeholder={data?.address?.country ?? ""}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PersonalInformationContent;
