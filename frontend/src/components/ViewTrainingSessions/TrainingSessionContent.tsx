import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import log from "loglevel";

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
  LoaderCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Helper function imports
import { calculateEndTime } from "@/utils/calculateEndTime";
import { getFileName } from "@/utils/getFileName";

// Data structure for data received from API call
import {
  DetailedProgramParticipantDto,
  Program,
  ProgramDetails,
} from "@/types/trainingSessionDetails";
import { Attendees } from "@/types/trainingSessionDetails";
import BackButton from "../ui/back-button";
import { CookiesDto } from "@/types/auth";
import waitlistParticipantsApi from "@/services/api/programParticipantApi";
import { ONCE, WEEKLY } from "@/constants/programconstants";
import { MONTHLY } from "@/constants/programconstants";
import trainingSessionApi from "@/services/api/trainingSessionApi";
import useGetCookies from "@/hooks/useGetCookies.ts";
import useGetDetailedProgramParticipants from "@/hooks/useGetDetailedProgramParticipants.ts";

const TrainingSessionContent = () => {
  const { cookies, preLoading } = useGetCookies();

  const location = useLocation(); // Location state data sent from Calendar page card
  const navigate = useNavigate(); // Navigate back to Calendar page
  const stateProgramId = location.state?.programDetails?.recurrenceId;

  const [user, setUser] = useState<CookiesDto | null | undefined>(); // Handle account type. Only coach or admin can view list of attendees.
  const [accountAttendee, setAccountAttendee] = useState<Attendees>();
  const [attendees, setAttendees] = useState<Attendees[]>([]);
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
    visibility: "public",
    author: "",
    isCancelled: false,
    reccurenceDate: new Date(),
  });
  const [waitlistedAttendees, setWaitlistedAttendees] = useState<
    DetailedProgramParticipantDto[]
  >([]);
  const [coaches, setCoaches] = useState<DetailedProgramParticipantDto[]>([]);
  const [players, setPlayers] = useState<DetailedProgramParticipantDto[]>([]);

  const fetchProgramData = async () => {
    const recurrenceId = location.state?.programDetails?.recurrenceId;
    if (recurrenceId && user?.accountId) {
      try {
        const response = await trainingSessionApi.getPrograms(user?.accountId);
        const program = response.data?.find(
          (p: Program) => p.programDetails.recurrenceId === recurrenceId,
        );
        if (program) {
          setProgramDetails(program.programDetails);
          setAttendees(program.attendees);
        } else {
          console.log("No program found");
        }
      } catch (error) {
        log.error("Failed to fetch program data:", error);
      }
    }
  };

  const { loadingParticipants, participants, fetchRefreshedData } =
    useGetDetailedProgramParticipants(stateProgramId);

  useEffect(() => {
    if (!loadingParticipants && participants) {
      console.log("Participants: ", participants);
      setCoaches(participants.filter((p) => p.participantType === "Coach"));
      setWaitlistedAttendees(
        participants.filter((p) => p.participantType === "Waitlisted"),
      );
      setPlayers(
        participants.filter((p) => p.participantType === "Subscribed"),
      );
    }
  }, [participants, loadingParticipants]);

  useEffect(() => {
    if (!preLoading && cookies) {
      setUser(cookies);
      log.info("Training Session Card account type : ", cookies.type);
    }
  }, [navigate, cookies, preLoading]);

  useEffect(() => {
    if (!preLoading && cookies) {
      // Fetch fresh data when cookies are available.
      fetchProgramData().then((_) => _);
    }
  }, [user, location.state?.programDetails?.programId, preLoading, cookies]);

  useEffect(() => {
    if (!preLoading && cookies) {
      //TODO: define a useHook instead of all this code, who knows
      const fetchParticipant = async () => {
        const recurrenceId = location.state?.programDetails?.recurrenceId;
        console.log("ProgramID:", recurrenceId, user?.accountId);
        if (recurrenceId && user?.accountId) {
          try {
            const accountAttendee: Attendees =
              await waitlistParticipantsApi.getProgramParticipant(
                recurrenceId,
                user?.accountId,
              );
            setAccountAttendee(accountAttendee);
            console.log("Account Attendee check: ", accountAttendee);
            console.log(accountAttendee);
          } catch (error) {
            log.error("Failed to fetch program participant:", error);
          }
        }
      };
      fetchParticipant().then((_) => _);
    }
  }, [
    location.state.programDetails.recurrenceId,
    user?.accountId,
    preLoading,
    cookies,
  ]);

  useEffect(() => {
    log.debug("Attendees: ", attendees);
  }, [attendees]);

  useEffect(() => {
    log.debug("Players: ", players);
  }, [players]);

  const handleRefresh = async () => {
    const recurrenceId = location.state?.programDetails?.recurrenceId;
    if (!recurrenceId) return;

    try {
      const response = await trainingSessionApi.getPrograms(user?.accountId);
      const updatedProgram = response?.data?.find(
        (p: Program) => p.programDetails.recurrenceId === recurrenceId,
      );

      if (updatedProgram) {
        setProgramDetails(updatedProgram.programDetails);
        setAttendees(updatedProgram.attendees);
      }

      const details_res = await fetchRefreshedData();
      if (details_res) {
        setCoaches(
          details_res.filter(
            (p: DetailedProgramParticipantDto) => p.participantType === "Coach",
          ),
        );
        setWaitlistedAttendees(
          details_res.filter(
            (p: DetailedProgramParticipantDto) =>
              p.participantType === "Waitlisted",
          ),
        );
        setPlayers(
          details_res.filter(
            (p: DetailedProgramParticipantDto) =>
              p.participantType === "Subscribed",
          ),
        );
      }
    } catch (error) {
      log.error("Failed to refresh program data:", error);
    }
  };

  const updateAttendeesList = (newAttendee: Attendees) => {
    setAttendees((prev) => {
      const exists = prev.some((a) => a.accountId === newAttendee.accountId);
      return exists
        ? prev.map((a) =>
            a.accountId === newAttendee.accountId ? newAttendee : a,
          )
        : [...prev, newAttendee];
    });
  };

  const attendeeStatus = !accountAttendee ? (
    <p className="text-gray-600">You&apos;re not part of this program.</p>
  ) : accountAttendee.participantType?.toLowerCase() === "subscribed" &&
    !accountAttendee.confirmed ? (
    <p className="text-red-600 font-medium">
      You&apos;re absent for this session.
    </p>
  ) : accountAttendee.rank !== null ? (
    <div>
      <p className="text-amber-600 font-medium">
        You&apos;re on the waitlist for this session.
      </p>
      <p className="text-gray-600 mt-1">
        Your current position:{" "}
        <span className="font-bold">{accountAttendee.rank}</span>
        {accountAttendee.rank === 1
          ? " (You'll be the next person to get a spot)"
          : ""}
      </p>
    </div>
  ) : accountAttendee.confirmed ? (
    <p className="text-green-600 font-medium">
      You&apos;re confirmed for this session.
    </p>
  ) : null;

  if (preLoading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="mb-32">
      {/**Return to previous page */}
      <BackButton />

      {/**Session details */}
      <div className="flex flex-col gap-8 lg:gap-12">
        {/**Session Info */}
        <div className="flex flex-col justify-center w-fit mx-auto shadow-lg bg-white rounded-xl md:min-w-[640px] md:mt-4">
          {/**Event Title */}
          <div className="flex items-center gap-3 py-6 px-8">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primaryColour">
                <User2Icon color="#a1a1aa" />
              </AvatarFallback>
              <AvatarImage
                src="/src/assets/Logo.png"
                alt="organisation"
                className="object-cover"
              />
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
          <hr className="mx-8" />
          {/**Event Details, Information and Attachments */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-12 py-6 px-8">
            {/**Event description */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Calendar
                  size={15}
                  color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
                />
                <p className="text-sm text-gray-500">
                  {programDetails?.reccurenceDate &&
                  programDetails?.frequency !== ONCE
                    ? new Date(programDetails.reccurenceDate).toDateString()
                    : programDetails?.occurrenceDate
                      ? new Date(programDetails.occurrenceDate).toDateString()
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
                      ? new Date(
                          programDetails.occurrenceDate,
                        ).toLocaleTimeString("en-CA", {
                          timeZone: "UTC",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </p>
                  <hr className="mx-1 w-1 h-px border-0 bg-gray-500 " />
                  <p className="text-sm text-gray-500">
                    {programDetails.occurrenceDate &&
                    programDetails.durationMins
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
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold">Information</p>
              {programDetails?.description ||
              programDetails?.programAttachments ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-gray-500">
                    {programDetails?.description}
                  </p>
                  {/** Program Attachments */}
                  <div className="grid gap-2">
                    {programDetails.programAttachments.map(
                      (attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center border-[1px] rounded-md p-2 max-w-sm"
                        >
                          <FileText
                            size={15}
                            color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
                            className="w-8 pr-2"
                          />
                          <div className="truncate overflow-hidden">
                            <a
                              className="text-sm text-gray-500 hover:text-cyan-300 block truncate"
                              href={attachment.attachmentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                            >
                              {getFileName(attachment.attachmentUrl)}
                            </a>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm font-normal m-5 text-center">
                  No information given
                </p>
              )}
            </div>
          </div>
        </div>

        {/** Participants */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] px-8 lg:px-4 xl:px-16 gap-8">
          {/** Coaches **/}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">Coaches</p>
            <div className="flex flex-col gap-2 xl:gap-4">
              {coaches.map((coach, index) => {
                return (
                  <div key={index}>
                    <RegisteredPlayer
                      participant={coach}
                      onRefresh={handleRefresh}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/** Conditionally render subscribed players only to Admin or Coach */}
          {/** Can render attendees list to Players or General when program type is not training session*/}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Attendees</h2>
              <p className="text-base font-medium text-gray-500">
                (
                {Array.isArray(attendees)
                  ? attendees.filter((attendee) => attendee.confirmed).length
                  : 0}
                /{programDetails.capacity})
              </p>
            </div>
            {/** Attendees list visible to coach/admin only */}
            {(user?.type?.toLowerCase() === "coach" ||
              user?.type?.toLowerCase() === "admin") && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2 xl:gap-4">
                {players.length > 0 ? (
                  players.map((player, index) => {
                    return player.participantType.toLowerCase() ===
                      "subscribed" || player.confirmed ? (
                      <div key={index}>
                        <RegisteredPlayer
                          participant={player}
                          onRefresh={handleRefresh}
                        />
                      </div>
                    ) : null;
                  })
                ) : (
                  <p className="text-cyan-300 text-sm font-normal m-5 text-center">
                    There are no attendees
                  </p>
                )}
              </div>
            )}
          </div>

          {/** Waitlisted Members **/}
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">Waitlisted Players</p>
            <div className="flex flex-col gap-2 xl:gap-4">
              {waitlistedAttendees.map((wa, index) => {
                return (
                  <div key={index}>
                    <RegisteredPlayer
                      participant={wa}
                      onRefresh={handleRefresh}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/** Waitlist Queue */}
        {!(
          (user?.type?.toLowerCase() === "general" ||
            user?.type?.toLowerCase() === "player") &&
          programDetails.programType.toLowerCase() === "training"
        ) &&
          attendees.some((attendee) => attendee.rank !== null) && (
            <>
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">Waitlist Queue</h2>
              </div>
              <div className="mx-2">
                {(() => {
                  // Filter and type cast to ensure rank exists
                  const waitlistedQueue = waitlistedAttendees
                    .filter(
                      (
                        attendee,
                      ): attendee is { rank: number } & typeof attendee =>
                        attendee.rank !== null,
                    )
                    .sort((a, b) => a.rank - b.rank);

                  return waitlistedQueue.length > 0 ? (
                    waitlistedQueue.map((waitlistedQueuer, index) => (
                      <div key={index}>
                        <RegisteredPlayer
                          participant={waitlistedQueuer}
                          onRefresh={handleRefresh}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-cyan-300 text-sm font-normal m-5 text-center">
                      There are no waitlisted attendees.
                    </p>
                  );
                })()}
              </div>
            </>
          )}

        {user?.accountId && attendeeStatus && (
          <div
            className={`my-6 mx-2 p-4 border rounded-md bg-gray-50 text-center`}
          >
            {attendeeStatus}
          </div>
        )}

        {/**Conditionally render different menu options based on account type */}
        <DropDownMenuButton
          user={user}
          accountAttendee={accountAttendee}
          programDetails={programDetails}
          attendees={attendees}
          onRefresh={handleRefresh}
          updateAttendeesList={updateAttendeesList}
        />
      </div>
    </div>
  );
};

export default TrainingSessionContent;
