import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MoveLeft, Upload, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

const EditProfileContent: React.FC = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState<string | null>(
    "https://via.placeholder.com/150"
  );

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    image: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
  };

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      const updatedFormData = { ...formData, image };
      alert("Profile updated successfully!");
      console.log(updatedFormData);
      navigate("/pages/ProfilePage");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setFormData((prevState) => ({
          ...prevState,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  type FormErrors = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
    };

    const namePattern = /^[a-zA-Z]+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^\d{10}$/;
    const postalCodePattern = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    } else if (!formData.firstName.match(namePattern)) {
      newErrors.firstName = "First name should contain only letters.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    } else if (!formData.lastName.match(namePattern)) {
      newErrors.lastName = "Last name should contain only letters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!formData.email.match(emailPattern)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!formData.phone.match(phonePattern)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.province.trim()) {
      newErrors.province = "Province is required.";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required.";
    } else if (!formData.postalCode.match(postalCodePattern)) {
      newErrors.postalCode =
        "Please enter a valid postal code (e.g., A1B 2C3).";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  return (
    <div>
      <div className="px-4 flex-1 pb-16">
        <div className="py-1 min-h-screen">
          <Button
            className="rounded-full"
            variant="outline"
            onClick={() => navigate("/pages/ProfilePage")}
          >
            <MoveLeft />
          </Button>

          <div className="flex flex-col items-center justify-center my-4">
            <h1 className="text-4xl text-textColour">Edit Profile</h1>

            <div className="relative">
              <img
                className="h-48 w-48 rounded-full border-2 border-fadedPrimaryColour dark:border-gray-800 mx-auto my-2"
                src={
                  image || "https://randomuser.me/api/portraits/women/21.jpg"
                }
                alt="Profile"
              />
              <Label
                htmlFor="file-input"
                className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 cursor-pointer bg-secondaryColour rounded-full p-2"
              >
                <Upload className="text-white" />
              </Label>
              <Input
                type="file"
                id="file-input"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              ></Input>
            </div>

            <form
              className="p-4 space-y-4 mt-4"
              onSubmit={handleSave}
              noValidate
            >
              {/* First Name */}
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
                {errors.firstName && (
                  <p className="text-red text-xs">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
                {errors.lastName && (
                  <p className="text-red text-xs">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="text-red text-xs">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <p className="text-red text-xs">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {errors.address && (
                  <p className="text-red text-xs">{errors.address}</p>
                )}
              </div>

              {/* City, Province, Postal Code */}
              <div className="flex space-x-4">
                {/* City */}
                <div className="flex-1">
                  <Label htmlFor="city">City</Label>
                  <Input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  {errors.city && (
                    <p className="text-red text-xs">{errors.city}</p>
                  )}
                </div>
                {/* Province */}
                <div className="flex-1">
                  <Label htmlFor="province">Province</Label>
                  <Input
                    type="text"
                    name="province"
                    id="province"
                    placeholder="Province"
                    value={formData.province}
                    onChange={handleInputChange}
                  />
                  {errors.province && (
                    <p className="text-red text-xs">{errors.province}</p>
                  )}
                </div>
                {/* Postal Code */}
                <div className="flex-1">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    type="text"
                    name="postalCode"
                    id="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                  {errors.postalCode && (
                    <p className="text-red text-xs">{errors.postalCode}</p>
                  )}
                </div>
              </div>

              {/** Save Button */}
              <div className="flex justify-center py-8">
                <Button
                  className="w-40 py-6 bg-secondaryColour text-white rounded-full"
                  variant="outline"
                  type="submit"
                >
                  <Save />
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfileContent;
