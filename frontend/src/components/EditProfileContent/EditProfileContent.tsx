import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { CirclePlus, Save } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import usePersonalInformation from "@/hooks/usePersonalInfromation";
import useUpdateAccount from "@/hooks/useUpdateAccount";
import useUpdateProfilePicture from "@/hooks/useUpdateProfilePicture";
import {
  profileSchema,
  ProfileFormValues,
  allowedImageTypes,
  maxFileSizeInBytes,
} from "./ProfileValidation";
import { useToast } from "@/hooks/use-toast";
import { getCookies, getAccountIdCookie } from "@/services/cookiesService";
import { UpdateAccountPayload } from "@/types/account";
import log from "loglevel";
import BackButton from "../ui/back-button";

const EditProfileContent: React.FC = () => {
  const navigate = useNavigate();
  const cookies = getCookies();
  const accountId = cookies ? getAccountIdCookie(cookies) : null;

  useEffect(() => {
    if (!accountId) {
      log.info("No accountId found, redirecting to login.");
      navigate("/login");
    }
  }, [accountId, navigate]);

  const { data, loading, error } = usePersonalInformation(accountId || 0);
  const [image, setImage] = useState<string>("https://via.placeholder.com/150");
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isImageChangeDialogOpen, setIsImageChangeDialogOpen] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);
  const { updateAccount, success, message } = useUpdateAccount();
  const { updateProfilePicture } = useUpdateProfilePicture();
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
      phone: data?.phone || "",
      address: data?.address?.line || "",
      city: data?.address?.city || "",
      province: data?.address?.province || "",
      postalCode: data?.address?.postalCode || "",
      country: data?.address?.country || "",
    },
  });

  useEffect(() => {
    if (data) {
      setImage(data.pictureUrl || "https://via.placeholder.com/150");
    }
  }, [data]);

  useEffect(() => {
    if (success) {
      toast({
        title: "Profile Updated",
        description: message || "Your profile has been updated successfully.",
        variant: "default",
      });
    }
    if (!success && message) {
      toast({
        title: "Update Failed",
        description: message || "There was an issue updating your profile.",
        variant: "destructive",
      });
    }
  }, [success, message, toast]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red">{error}</div>;
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && !allowedImageTypes.includes(file.type)) {
      log.warn("Invalid file type uploaded:", file.type);
      toast({
        title: "Invalid File Type",
        description: "Please upload a JPEG or PNG image.",
        variant: "destructive",
      });
      return;
    }

    if (file && file.size > maxFileSizeInBytes) {
      log.warn("Uploaded file exceeds size limit:", file.size);
      toast({
        title: "File Too Large",
        description: "File size exceeds 2 MB. Please upload a smaller image.",
        variant: "destructive",
      });
      return;
    }

    if (file) {
      log.info("New image selected for upload:", file.name);
      setNewImage(file);
      setIsImageChangeDialogOpen(true);
    }
  };

  // Function to confirm the image change
  const confirmImageChange = async () => {
    if (newImage) {
      //Hook for update profile picture API
      const { success, message } = await updateProfilePicture(
        accountId || 0,
        newImage,
      );

      if (success) {
        // Set the image preview
        setImage(URL.createObjectURL(newImage));
        toast({
          title: "Profile Picture Updated",
          description: message,
          variant: "default",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: message,
          variant: "destructive",
        });
      }

      setIsImageChangeDialogOpen(false);
    }
  };

  const cancelImageChange = () => {
    log.info("Image change cancelled.");
    setIsImageChangeDialogOpen(false);
    setNewImage(null);
  };

  const handleSavePersonalInfo = () => {
    log.info("Opening save confirmation dialog.");
    setIsInfoDialogOpen(true);
  };

  const confirmSavePersonalInfo = async (data: ProfileFormValues) => {
    const payload: UpdateAccountPayload = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      address: {
        line: data.address,
        city: data.city,
        province: data.province,
        country: data.country,
        postalCode: data.postalCode,
      },
    };

    await updateAccount(accountId || 0, payload);
  };

  const cancelSavePersonalInfo = () => {
    log.info("Cancelled saving personal information.");
    setIsInfoDialogOpen(false);
  };

  return (
    <div className="pb-8 min-h-screen">
      <BackButton />

      <div className="flex flex-col items-center justify-center mx-auto max-w-2xl">
        <div className="relative">
          <img
            className="h-48 w-48 rounded-full border-2 border-gray-300 mx-auto my-2"
            src={image}
            alt="Profile"
          />
          <Label
            htmlFor="file-input"
            className="absolute bottom-3 right-3 translate-x-1/2 translate-y-1/2 cursor-pointer rounded-full shadow-lg hover:bg-gray-100 hover:shadow-xl transition"
          >
            <CirclePlus className="rounded-full text-secondaryColour w-10 h-10 hover:scale-110 hover:text-black transition-transform " />
          </Label>

          <Input
            type="file"
            id="file-input"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>

        <h2 className="mt-8 text-2xl font-light">Edit Personal Information</h2>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSavePersonalInfo)}
            className="p-4 space-y-4 mt-1"
          >
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
                      placeholder={data?.firstName || "First Name"}
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
                      placeholder={data?.lastName || "Last Name"}
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
                      placeholder={data?.email || "Email"}
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
                      placeholder={data?.phone || "Phone"}
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
                      placeholder={data?.address?.line || "Address"}
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
                      placeholder={data?.address?.postalCode || "Postal Code"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City, Province, Postal Code */}
            <div className="flex space-x-4">
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
                        placeholder={data?.address?.city || "City"}
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
                        placeholder={data?.address?.province || "Province"}
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
                        placeholder={data?.address?.country || "Country"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Save Personal Info Button */}
            <div className="flex justify-center pt-1 pb-12">
              <Button
                className="w-30 h-10 bg-secondaryColour text-black rounded-full"
                variant="outline"
                type="submit"
              >
                <Save />
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <AlertDialog
        open={isImageChangeDialogOpen}
        onOpenChange={setIsImageChangeDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Profile Picture</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to change your profile picture?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={confirmImageChange}>
            Yes
          </AlertDialogAction>
          <AlertDialogCancel onClick={cancelImageChange}>No</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Personal Information</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to save these changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction
            onClick={() => confirmSavePersonalInfo(form.getValues())}
          >
            Save
          </AlertDialogAction>
          <AlertDialogCancel onClick={cancelSavePersonalInfo}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditProfileContent;
