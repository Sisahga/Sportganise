import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Bell, Calendar, Home, MessageSquare, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FooterNav() {
  const [selected, setSelected] = useState("Home");
  const navigate = useNavigate();
  const navigate = useNavigate();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <nav className="flex justify-around p-2">
        {/* Home Button */}
        <Button
          variant="ghost"
          className="flex-1 flex-col items-center gap-1 h-auto py-2 bg-white"
          onClick={() => {
            setSelected("Home");
            navigate("/HomePage");
          }}
        >
          <Home
            className={`h-5 w-5 ${
              selected === "Home"
                ? "text-secondaryColour"
                : "text-primaryColour"
            }`}
          />
          <span className="text-xs">Home</span>
        </Button>

        {/* Calendar Button */}
        <Button
          variant="ghost"
          className="flex-1 flex-col items-center gap-1 h-auto py-2 bg-white"
          onClick={() => setSelected("Calendar")}
        >
          <Calendar
            className={`h-5 w-5 ${
              selected === "Calendar"
                ? "text-secondaryColour"
                : "text-primaryColour"
            }`}
          />
          <span className="text-xs">Calendar</span>
        </Button>

        {/* Alerts Button */}
        <Button
          variant="ghost"
          className="flex-1 flex-col items-center gap-1 h-auto py-2 bg-white"
          onClick={() => setSelected("Alerts")}
        >
          <Bell
            className={`h-5 w-5 ${
              selected === "Alerts"
                ? "text-secondaryColour"
                : "text-primaryColour"
            }`}
          />
          <span className="text-xs">Alerts</span>
        </Button>

        {/* Inbox Button */}
        {/* Inbox Button */}
        <Button
          variant="ghost"
          className="flex-1 flex-col items-center gap-1 h-auto py-2 bg-white"
          onClick={() => {
            setSelected("Inbox");
            navigate("/messages"); // Navigate to the messages route
          }}
        >
          <MessageSquare
            className={`h-5 w-5 ${
              selected === "Inbox"
                ? "text-secondaryColour"
                : "text-primaryColour"
            }`}
          />
          <span className="text-xs">Inbox</span>
        </Button>

        {/* Profile Button */}
        <Button
          variant="ghost"
          className="flex-1 flex-col items-center gap-1 h-auto py-2 bg-white"
          onClick={() => setSelected("Profile")}
        >
          <User
            className={`h-5 w-5 ${
              selected === "Profile"
                ? "text-secondaryColour"
                : "text-primaryColour"
            }`}
          />
          <span className="text-xs">Profile</span>
        </Button>
      </nav>
    </div>
  );
}
