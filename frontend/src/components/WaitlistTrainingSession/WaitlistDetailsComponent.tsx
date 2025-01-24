import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Created components imports
import DropDownMenuButton from "@/components/ViewTrainingSessions/DropDownMenu/DropDownMenuButton";
import EventBadgeType from "@/components/ViewTrainingSessions/BadgeTypes/EventBadgeType";

// Components imports
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

// Helper function imports
import { calculateEndTime } from "@/utils/calculateEndTime";

// Data structure for data received from API call
import { ProgramDetails } from "@/types/trainingSessionDetails";
// import { Attendees } from "@/types/trainingSessionDetails"; //TODO: this should end up being the waitlist types i guess?
// import Waitlisted from "./WaitlistedPlayer"; //TODO:copy paste and change a bit what sofia did to accomodate for a waitlisted player not a registered one

const WaitlistDetailsComponent = () => {
  const [accountType /*, setAccountType*/] = useState<string>("coach"); // Handle account type. Only coach or admin can view list of attendees.
  const location = useLocation(); // Location state data sent from Calendar page card
  const navigate = useNavigate(); // Navigate back to Calendar page

  const [programDetails, setProgramDetails] = useState<ProgramDetails>({
    programId: 0,
    title: "",
    programType: "",
    description: "",
    capacity: 0,
    occurrenceDate: new Date(),
    durationMins: 0,
    recurring: false,
    expiryDate: new Date(),
    location: "",
    programAttachments: [],
    frequency: "",
    visibility: "",
  });
  useEffect(() => {
    // Update state safely using useEffect
    if (location.state && location.state.programDetails) {
      setProgramDetails(location.state.programDetails);
    }
  }, [location.state]);

  //TODO: CHANGE ATTENdees to be the waitlisted players and their ranks

  // const [attendees, setAttendees] = useState<Attendees[]>([]);
  // useEffect(() => {
  //     if (location.state && location.state.attendees) {
  //         setAttendees(location.state.attendees);
  //     }
  // }, [location.state]);

  return (
    <div className="mb-32 mt-5">
      {/**Return to previous page */}
      <Button
        className="rounded-full mb-3"
        variant="outline"
        onClick={() => navigate(-1)}
      >
        <MoveLeft />
      </Button>

      {/**Event title */}
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
          <EventBadgeType programType={programDetails.programType} />
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
              {new Date(programDetails.occurrenceDate).toDateString()}
            </p>
            {programDetails.expiryDate ? (
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
            <Hourglass
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <p className="text-sm text-gray-500">
              {programDetails.durationMins} min
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Repeat
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <p className="text-sm text-gray-500">
              {programDetails.frequency || "one time"} on{" "}
              {new Intl.DateTimeFormat("en-CA", { weekday: "long" }).format(
                new Date(programDetails.occurrenceDate),
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CircleUserRound
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <p className="text-sm text-gray-500">Coach Benjamin Luijin</p>
          </div>
          <div className="flex items-center gap-2">
            <MapPin
              size={15}
              color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
            />
            <p className="text-sm text-gray-500">{programDetails.location}</p>
          </div>
        </div>

        {/**Information */}
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
                  className="flex items-center border-[1px] rounded-md p-2 w-[370px]"
                >
                  <FileText
                    size={15}
                    color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
                    className="w-8"
                  />
                  <a
                    className="text-sm text-gray-500 hover:text-cyan-300 overflow-x-scroll px-3"
                    href={attachment.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    {attachment.attachmentUrl.split("/").pop()}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*/!**Conditionally render subscribed players only to Admin or Coach *!/*/}
        {/*{(accountType.toLowerCase() === "coach" ||*/}
        {/*    accountType.toLowerCase() === "admin") && (*/}
        {/*    <>*/}
        {/*        <div className="flex items-center">*/}
        {/*            <h2 className="text-lg font-semibold">Waitlist</h2>*/}
        {/*            <p className="text-sm font-medium text-gray-500 ml-3">*/}
        {/*                {attendees.length}/{programDetails.capacity}*/}
        {/*            </p>*/}
        {/*        </div>*/}
        {/*        <div className="mx-2">*/}
        {/*            {attendees.length > 0 ? (*/}
        {/*                attendees.map((attendee, index) => (*/}
        {/*                    <div key={index}>*/}
        {/*                        <WaitlistedPlayer accountId={attendee.accountId} />*/}
        {/*                    </div>*/}
        {/*                ))*/}
        {/*            ) : (*/}
        {/*                <p className="text-cyan-300 text-sm font-normal m-5 text-center">*/}
        {/*                    There are no waitlisted players*/}
        {/*                </p>*/}
        {/*            )}*/}
        {/*        </div>*/}
        {/*    </>*/}
        {/*)}*/}

        {/**Conditionally render different menu options based on account type */}
        <DropDownMenuButton accountType={accountType} />
      </div>
    </div>
  );
};

export default WaitlistDetailsComponent;
