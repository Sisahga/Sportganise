import { useWaitlist } from "@/hooks/useWaitlist";
import useJoinWaitlist from "@/hooks/useJoinWaitlist";
import { ProgramDetails } from "@/types/trainingSessionDetails";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  CircleUserRound,
  FileText,
  MoveLeft,
  User2Icon,
  Hourglass,
  Repeat,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/Button";
import useAccountRole from "@/hooks/useAccountRole";
import { calculateEndTime } from "@/utils/calculateEndTime";

const WaitlistDetailsComponent = () => {
  const location = useLocation(); // Get location state data
  const navigate = useNavigate(); // For navigation

  // Extract program details from location state
  const [programDetails, setProgramDetails] = useState<ProgramDetails | null>(
    null,
  );

  useEffect(() => {
    if (location.state?.programDetails) {
      setProgramDetails(location.state.programDetails);
    }
  }, [location.state]);

  const programId = programDetails?.programId || 0; // Get programId
  const { waitlist, loading, error } = useWaitlist(programId); // Fetch waitlist data

  const accountId = 123; // TODO: Replace with dynamic accountId logic add cookies to it
  const { role } = useAccountRole(accountId);
  const isCoachOrAdmin = role === "ADMIN" || role === "COACH";

  // Use joinQueue hook
  const { joinQueue, joining, userRank, error: joinError } = useJoinWaitlist();

  const handleJoinQueue = async () => {
    await joinQueue(programId, accountId);
  };

  return (
    <div className="mb-32 mt-5">
      {/** Back button */}
      <Button
        className="rounded-full mb-3"
        variant="outline"
        onClick={() => navigate(-1)}
      >
        <MoveLeft />
      </Button>

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
      <div>
        <h2 className="text-lg font-semibold my-5">Waitlist</h2>
        {loading ? (
          <p>Loading waitlist...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : waitlist.length > 0 ? (
          <ul>
            {waitlist.map((participant, index) => (
              <li key={participant.accountId}>
                {participant.accountId} - Position: {index + 1}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-cyan-300 text-sm font-normal m-5 text-center">
            No players on the waitlist
          </p>
        )}
        {!isCoachOrAdmin && (
          <Button
            className="mt-4 w-full bg-secondaryColour text-white py-2 rounded-md"
            onClick={handleJoinQueue}
            disabled={joining || userRank !== null}
          >
            {joining
              ? "Joining..."
              : userRank !== null
                ? `Your Rank: ${userRank}`
                : "Join the Queue"}
          </Button>
        )}
        {joinError && <p className="text-red-500 text-sm mt-3">{joinError}</p>}
      </div>
    </div>
  );
};

export default WaitlistDetailsComponent;
