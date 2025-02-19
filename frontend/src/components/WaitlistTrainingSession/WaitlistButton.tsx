import { Button } from "@/components/ui/Button";
import { ChevronRight, XCircle } from "lucide-react";

interface WaitlistButtonProps {
  isCoachOrAdmin: boolean;
  waitlistLength: number;
  joining: boolean;
  userRank: number | null;
  handleJoinQueue: () => void;
  confirmPlayers: () => void;
  rejectPlayers: () => void; // Added reject button function
  joinError: string | null;
}

const WaitlistButton: React.FC<WaitlistButtonProps> = ({
  isCoachOrAdmin,
  waitlistLength,
  joining,
  userRank,
  handleJoinQueue,
  confirmPlayers,
  rejectPlayers,
  joinError,
}) => {
  if (isCoachOrAdmin && waitlistLength > 0) {
    return (
      <div className="flex gap-4">
        {/* Confirm Button */}
        <Button
          onClick={confirmPlayers}
          className="bg-secondaryColour text-white font-medium rounded-full px-6 py-2 shadow-md flex justify-center items-center mx-auto mt-2 gap-2 hover:bg-primaryHoverColour"
        >
          Confirm Selected Players <ChevronRight size={16} />
        </Button>

        {/* Reject Button */}
        <Button
          onClick={rejectPlayers}
          className="bg-red text-white font-medium rounded-full px-6 py-2 shadow-md flex justify-center items-center mx-auto mt-2 gap-2 hover:bg-red-800"
        >
          Reject Selected Players <XCircle size={16} />
        </Button>
      </div>
    );
  }

  if (!isCoachOrAdmin) {
    return (
      <Button
        onClick={handleJoinQueue}
        disabled={joining || userRank !== null}
        className={`text-white font-medium rounded-full px-6 py-2 shadow-md flex justify-center items-center mx-auto pt-4px mt-2 gap-2 ${
          joining || userRank !== null
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-secondaryColour hover:bg-primaryHoverColour"
        }`}
      >
        {joining
          ? "Joining..."
          : userRank !== null
            ? `Your Rank: ${userRank}`
            : "Join Queue"}
        <ChevronRight size={16} />
      </Button>
    );
  }

  return joinError ? (
    <p className="text-red-500 text-sm mt-3">{joinError}</p>
  ) : null;
};

export default WaitlistButton;
