import React from "react";
import { Button } from "@/components/ui/Button";
import { MoveLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils"; // Import the cn utility

const PersonalInformationContent: React.FC = () => {
  const navigate = useNavigate();

  const formData = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "123-456-7890",
    address: "123 Main St",
    city: "Montreal",
    province: "Quebec",
    postalCode: "H3Z 1A1",
  };

  const fields = [
    { label: "Full Name", value: `${formData.firstName} ${formData.lastName}` },
    { label: "Email address", value: formData.email },
    { label: "Phone", value: formData.phone },
    { label: "Address", value: formData.address },
    { label: "City", value: formData.city },
    { label: "Province", value: formData.province },
    { label: "Postal Code", value: formData.postalCode },
  ];

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
        <div className="flex flex-col items-center justify-center my-4">
          <h1 className="text-4xl">Personal Information</h1>
          <div className="w-full overflow-hidden mt-4">
            <dl>
              {fields.map(({ label, value }, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-4 py-5",
                    index % 2 === 0 ? "bg-gray-50" : "bg-white",
                  )}
                >
                  <Label>{label}</Label>
                  <p className="mt-1 text-lg text-textColour">{value}</p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationContent;
