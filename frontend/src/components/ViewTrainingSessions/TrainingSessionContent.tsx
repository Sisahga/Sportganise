import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import log from "loglevel";
import { getCookies } from "@/services/cookiesService";

// Created components imports
import DropDownMenuButton from "./DropDownMenu/DropDownMenuButton";
import EventBadgeType from "./BadgeTypes/EventBadgeType";
import RegisteredPlayer from "./RegisteredPlayer";

// Components imports
import {
  Calendar,
  Clock,
  MapPin,
  CircleUserRound,
  FileText,
  Hourglass,
  Repeat,
  User2Icon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Helper function imports
import { calculateEndTime } from "@/utils/calculateEndTime";
import { getFileName } from "@/utils/getFileName";
import { formatDate } from "@/utils/formatDate";

// Data structure for data received from API call
import { ProgramDetails } from "@/types/trainingSessionDetails";
import { Attendees } from "@/types/trainingSessionDetails";
import BackButton from "../ui/back-button";
import { CookiesDto } from "@/types/auth";
import waitlistParticipantsApi from "@/services/api/programParticipantApi";
import { ONCE, WEEKLY } from "@/constants/programconstants";
import { MONTHLY } from "@/constants/programconstants";

const TrainingSessionContent = () => {
  const [user, setUser] = useState<CookiesDto | null | undefined>(); // Handle account type. Only coach or admin can view list of attendees.
  const [accountAttendee, setAccountAttendee] = useState<Attendees>();
  const location = useLocation(); // Location state data sent from Calendar page card
  const navigate = useNavigate(); // Navigate back to Calendar page

  log.debug("Rendering TrainingSessionContent");
  useEffect(() => {
    const user = getCookies();
    setUser(user);
    log.info("Training Session Card account type : ", user);
  }, [navigate]);

  const [programDetails, setProgramDetails] = useState<ProgramDetails>({
    programId: 0,
    recurrenceId: 0,
    title: "",
    programType: "",
    description: "",
    capacity: 0,
    occurrenceDate: new Date(),
    durationMins: 0,
    expiryDate: new Date(),
    location: "",
    programAttachments: [],
    frequency: "",
    visibility: "",
    author: "",
    cancelled: false,
    reccurenceDate: new Date(),
  });

  useEffect(() => {
    // Update state safely using useEffect
    if (location.state && location.state.programDetails) {
      setProgramDetails(location.state.programDetails);
    }
    log.info("Program details in training session content: ", programDetails);
  }, [location.state]);

  const [attendees, setAttendees] = useState<Attendees[]>([]);
  useEffect(() => {
    if (location.state && location.state.attendees) {
      setAttendees(location.state.attendees);
    }
    log.info("Attendees in training session content: ", attendees);
  }, [location.state]);

  useEffect(() => {
    //TODO: define a useHook instead of all this code, who knows
    const fetchParticipant = async () => {
      const programId = location.state?.programDetails?.programId;
      console.log("ProgramID:", programId, user?.accountId);
      if (programId && user?.accountId) {
        try {
          const accountAttendee: Attendees =
            await waitlistParticipantsApi.getProgramParticipant(
              programId,
              user?.accountId,
            );
          setAccountAttendee(accountAttendee);
          console.log("WHAT IS HAPPENING IM SO CONFUSED", accountAttendee);
          console.log(accountAttendee);
        } catch (error) {
          log.error("Failed to fetch program participant:", error);
        }
      }
    };
    fetchParticipant();
  }, [location.state.programDetails.programId, user?.accountId]);

  return (
    <div className="mb-32 mt-5">
      {/**Return to previous page */}
      <BackButton />

      {/**Event title */}
      <div className="flex items-center gap-3 my-5">
        <Avatar className="w-16 h-16">
          <AvatarFallback className="bg-primaryColour">
            <User2Icon color="#a1a1aa" />
          </AvatarFallback>
          <AvatarImage src="/src/assets/Logo.png" alt="organisation" />
        </Avatar>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-secondaryColour">
            {programDetails?.title ?? "N/A"}
          </h2>
          {programDetails?.programType && (
            <EventBadgeType programType={programDetails.programType} />
          )}
        </div>
      </div>

      {/**Session details */}
      <div>
        {/**Session Info */}
        <div className="grid gap-2 mx-2">
          <div className="flex items-center gap-2">
            <Calendar
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <p className="text-sm text-gray-500">
              {programDetails?.reccurenceDate &&
              programDetails?.frequency !== ONCE
                ? formatDate(programDetails.reccurenceDate).toDateString()
                : programDetails?.occurrenceDate
                  ? formatDate(programDetails.occurrenceDate).toDateString()
                  : "N/A"}
            </p>
            {programDetails?.expiryDate ? (
              <div className="flex items-center gap-2">
                <hr className="w-1 h-px border-0 bg-gray-500 " />
                <p className="text-sm text-gray-500">
                  {new Date(programDetails.expiryDate).toDateString()}
                </p>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <span className="flex items-center">
              <p className="text-sm text-gray-500">
                {programDetails?.occurrenceDate
                  ? new Date(programDetails.occurrenceDate).toLocaleTimeString(
                      "en-CA",
                      { timeZone: "UTC", hour: "2-digit", minute: "2-digit" },
                    )
                  : "N/A"}
              </p>
              <hr className="mx-1 w-1 h-px border-0 bg-gray-500 " />
              <p className="text-sm text-gray-500">
                {programDetails.occurrenceDate && programDetails.durationMins
                  ? calculateEndTime(
                      new Date(programDetails.occurrenceDate),
                      programDetails.durationMins,
                    )
                  : "N/A"}
              </p>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Hourglass
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <p className="text-sm text-gray-500">
              {programDetails?.durationMins ?? "N/A"} min
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Repeat
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <p className="text-sm text-gray-500">
              {programDetails?.frequency
                ? programDetails?.frequency?.toLowerCase() || "one time"
                : "N/A"}{" "}
              {programDetails?.occurrenceDate &&
                (programDetails?.frequency == WEEKLY ||
                  programDetails?.frequency == MONTHLY) && (
                  <>
                    on{" "}
                    {new Intl.DateTimeFormat("en-CA", {
                      weekday: "long",
                    }).format(new Date(programDetails.occurrenceDate))}
                  </>
                )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CircleUserRound
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <p className="text-sm text-gray-500">
              {programDetails?.author ?? "N/A"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <p className="text-sm text-gray-500">
              {programDetails?.location ?? "N/A"}
            </p>
          </div>
        </div>

        {/**Information */}
        <div className="my-10">
          <h2 className="text-lg font-semibold my-2">Information</h2>
          {programDetails?.description || programDetails?.programAttachments ? (
            <div className="mx-2">
              <p className="text-sm my-2 text-gray-500">
                {programDetails?.description}
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
                        {getFileName(attachment.attachmentUrl)}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm font-normal m-5 text-center">
              No information given
            </p>
          )}
        </div>

        {/**Conditionally render subscribed players only to Admin or Coach */}
        {/**Can render attendees list to Players or General when program type us not training session*/}
        {!(
          (user?.type?.toLowerCase() === "general" ||
            user?.type?.toLowerCase() === "player") &&
          programDetails.programType.toLowerCase() === "training"
        ) && (
          <>
            <div className="flex items-center">
              <h2 className="text-lg font-semibold">Attendees</h2>
              <p className="text-sm font-medium text-gray-500 ml-3">
                {Array.isArray(attendees)
                  ? attendees.filter((attendee) => attendee.confirmed).length
                  : 0}
                /{programDetails.capacity}
              </p>
            </div>
            <div className="mx-2">
              {attendees.length > 0 ? (
                attendees.map((attendee, index) => {
                  console.log("Attendee Information:", attendee); // Added console log
                  return attendee.participantType?.toLowerCase() ===
                    "subscribed" || attendee.confirmed ? (
                    <div key={index}>
                      <RegisteredPlayer accountAttendee={attendee} />
                    </div>
                  ) : null;
                })
              ) : (
                <p className="text-cyan-300 text-sm font-normal m-5 text-center">
                  There are no attendees
                </p>
              )}
            </div>
          </>
        )}

        {/**Conditionally render different menu options based on account type */}
        <DropDownMenuButton
          user={user}
          accountAttendee={accountAttendee}
          programDetails={programDetails}
          attendees={attendees}
        />
      </div>
    </div>
  );
};

export default TrainingSessionContent;
