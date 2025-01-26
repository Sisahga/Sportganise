// MessagingDashboardHeader.tsx
import { Button } from "@/components/ui/Button.tsx";
import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MessagingDashboardHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="pt-8 flex items-center justify-between px-4 py-3 bg-white shadow gap-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
        onClick={() => navigate("/")}
        aria-label="Back"
      >
        <ArrowLeft
          className="text-gray-800"
          size={24}
          style={{ width: "1.25rem", height: "1.25rem" }}
          strokeWidth={3}
        />
      </Button>

      {/* Title */}
      <h1 className="text-xl font-bold flex-grow text-gray-800">Messages</h1>

      {/* Add New Message Button */}
      <button
        className="p-2 rounded-full bg-secondaryColour shadow-md"
        aria-label="Add New Message"
        onClick={() => {
          navigate("/pages/CreateDmChannelPage");
        }}
      >
        <Plus className="text-white" strokeWidth={4} size={20} />
      </button>
    </header>
  );
};

export default MessagingDashboardHeader;
