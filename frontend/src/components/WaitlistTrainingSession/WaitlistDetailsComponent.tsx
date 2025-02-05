import { useWaitlist } from "@/hooks/useWaitlist";
import useJoinWaitlist from "@/hooks/useJoinWaitlist";
import { ProgramDetails } from "@/types/trainingSessionDetails";
import { useState, useEffect } from "react";
import { getCookies } from "@/services/cookiesService";
import log from "loglevel";
import {
  Calendar,
  Clock,
  MapPin,
  CircleUserRound,
  FileText,
  User2Icon,
  Hourglass,
  Repeat,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import BackButton from "@/components/ui/back-button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateEndTime } from "@/utils/calculateEndTime";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface WaitlistDetailsProps {
  programDetails: ProgramDetails;
}

const WaitlistDetailsComponent: React.FC<WaitlistDetailsProps> = ({
  programDetails,
}) => {
  const [accountId, setAccountId] = useState<number | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    log.debug("Fetching account details from cookies...");
    const user = getCookies();
    setAccountId(user.accountId || null);
    setAccountType(user.type || null);
    log.info("Fetched account details: ", user);
  }, []);

  const programId = programDetails?.programId || 0;
  const { waitlist } = useWaitlist(programId);
  const isCoachOrAdmin = accountType === "ADMIN" || accountType === "COACH";

  const { joinQueue, joining, userRank, error: joinError } = useJoinWaitlist();

  const handleJoinQueue = async () => {
    if (accountId) {
      await joinQueue(programId, accountId);
    } else {
      log.error("Account ID is missing!");
    }
  };

  const handlePlayerSelect = (playerId: number) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const confirmPlayers = () => {
    if (selectedPlayers.length === 0) {
      toast({
        title: "No Players Selected",
        description: "Please select at least one player before confirming.",
        variant: "destructive",
        action: <ToastAction altText="Ok">Ok</ToastAction>,
      });
      return;
    }

    log.info("Confirmed Players:", selectedPlayers);
    alert(`Confirmed Players: ${selectedPlayers.join(", ")}`);
    setSelectedPlayers([]);
  };

  return (
    <div className="mb-32 mt-32 my-8 mx-8">
      {/** Back button */}
      <BackButton />

      {/** Program details */}
      {programDetails && (
        <div>
          {/** Title and avatar */}
          <div className="flex items-center gap-3 my-5">
            <Avatar className="w-16 h-16">
              <AvatarFallback>
                <User2Icon color="#a1a1aa" />
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-secondaryColour">
                {programDetails.title}
              </h2>
              <p className="text-gray-500 text-sm">
                Program Type: {programDetails.programType}
              </p>
            </div>
          </div>

          {/** Session details */}
          <div className="grid gap-2 mx-2">
            <div className="flex items-center gap-2">
              <Calendar size={15} color="rgb(107 114 128)" />
              <p className="text-sm text-gray-500">
                {new Date(programDetails.occurrenceDate).toDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={15} color="rgb(107 114 128)" />
              <span className="flex items-center">
                <p className="text-sm text-gray-500">
                  {new Date(programDetails.occurrenceDate).toLocaleTimeString(
                    "en-CA",
                    { timeZone: "UTC", hour: "2-digit", minute: "2-digit" },
                  )}
                </p>
                <hr className="mx-1 w-1 h-px border-0 bg-gray-500 " />
                <p className="text-sm text-gray-500">
                  {calculateEndTime(
                    new Date(programDetails.occurrenceDate),
                    programDetails.durationMins,
                  )}
                </p>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Hourglass size={15} color="rgb(107 114 128)" />
              <p className="text-sm text-gray-500">
                {programDetails.durationMins} min
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Repeat size={15} color="rgb(107 114 128)" />
              <p className="text-sm text-gray-500">
                {programDetails.frequency || "One-time"} on{" "}
                {new Intl.DateTimeFormat("en-CA", {
                  weekday: "long",
                }).format(new Date(programDetails.occurrenceDate))}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CircleUserRound size={15} color="rgb(107 114 128)" />
              <p className="text-sm text-gray-500">Coach Benjamin Luijin</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={15} color="rgb(107 114 128)" />
              <p className="text-sm text-gray-500">{programDetails.location}</p>
            </div>
          </div>

          {/** Information with attachments */}
          <div className="my-10">
            <h2 className="text-lg font-semibold my-2">Information</h2>
            <div className="mx-2">
              <p className="text-sm my-2 text-gray-500">
                {programDetails.description}
              </p>
              <div className="grid gap-2">
                {programDetails.programAttachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center border-[1px] rounded-md p-2"
                  >
                    <FileText
                      size={15}
                      color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
                      className="w-8 pr-2"
                    />
                    <div className="overflow-x-scroll">
                      <a
                        className="text-sm text-gray-500 hover:text-cyan-300"
                        href={attachment.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        {attachment.attachmentUrl
                          .split("/")
                          .pop()
                          ?.split("_")
                          .pop()}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/** Waitlist */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Waitlisted Players
      </h2>
      <ul className="divide-y divide-gray-300">
        {waitlist.map((participant) => (
          <li
            key={participant.accountId}
            className="flex items-center gap-4 p-3"
          >
            {isCoachOrAdmin && (
              <Checkbox
                checked={selectedPlayers.includes(participant.accountId)}
                onCheckedChange={() =>
                  handlePlayerSelect(participant.accountId)
                }
              />
            )}

            {/* Avatar */}
            <Avatar>
              <AvatarImage
                src={participant.pictureUrl}
                alt={participant.firstName}
              />
              <AvatarFallback>{participant.firstName.charAt(0)}</AvatarFallback>
            </Avatar>

            {/* Player Info */}
            <div className="flex flex-col">
              <p className="text-sm font-medium">
                {participant.firstName} {participant.lastName}
              </p>
              <Badge className="bg-fadedPrimaryColour text-white px-3 py-1 w-[75px] text-center">
                rank: {participant.rank}
              </Badge>
            </div>
          </li>
        ))}
      </ul>

      {isCoachOrAdmin && waitlist.length > 0 && (
        <Button
          onClick={confirmPlayers}
          className="bg-secondaryColour text-white font-medium rounded-full px-6 py-2 shadow-md flex justify-center items-center mx-auto mt-2 gap-2 hover:bg-primaryHoverColour"
        >
          Confirm Selected Players <ChevronRight size={16} />
        </Button>
      )}

      {!isCoachOrAdmin && (
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
      )}

      {joinError && <p className="text-red-500 text-sm mt-3">{joinError}</p>}
    </div>
  );
};

export default WaitlistDetailsComponent;
