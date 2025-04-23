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
    <div className="pb-20 sm:pb-0 min-h-screen sm:min-h-auto">
      <BackButton />
      <div className="flex flex-col gap-4 items-center -mt-5">
        <h2 className="font-semibold text-3xl text-secondaryColour text-center">
          Personal Information
        </h2>
        <div
          className="flex flex-col items-center justify-center mt-2 md:bg-white md:border md:border-navbar
                    md:shadow-xl md:w-fit md:pt-12 md:px-12 md:pb-8 md:rounded-xl md:gap-4 md:items-start"
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-16">
            <div className="relative flex flex-col items-center">
              <img
                className="h-48 w-48 object-cover rounded-full border-2 border-gray-300 mx-auto"
                src={data?.pictureUrl || "https://via.placeholder.com/150"}
                alt="Profile"
              />
            </div>

            <Form {...form}>
              <form className="p-4 space-y-4 mt-1 md:mt-0 md:p-0">
                <div className="flex gap-4">
                  {/* First Name */}
                  <div className="w-1/2">
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
                  </div>

                  <div className="w-1/2">
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
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2/3">
                    {/* Email */}
                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
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
                  </div>
                  <div className="w-1/3">
                    {/* Phone */}
                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
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
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2/3">
                    {/* Address */}
                    <FormField
                      name="address"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
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
                  </div>
                  <div className="w-1/3">
                    {/* Postal Code */}
                    <FormField
                      name="postalCode"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="space-y-1">
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
                  </div>
                </div>

                {/* City, Province, Country - grouped */}
                <div className="flex space-x-2">
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
                <div className="w-full flex justify-center">
                  {/* Edit Profile Button */}
                  <Button
                    className="mt-2 px-4 w-fit"
                    variant="default"
                    onClick={() => navigate("/pages/EditProfilePage")}
                  >
                    <SquarePen />
                    Edit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationContent;
