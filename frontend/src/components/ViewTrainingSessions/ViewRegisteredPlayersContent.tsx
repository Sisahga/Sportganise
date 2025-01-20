import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Attendees } from "@/types/trainingSessionDetails";
import { User2Icon } from "lucide-react";

// Handle badge variants
function BadgeTypeAttendee(attendeeType: string) {
  // attendee can have null rank
  if (attendeeType === null) {
    return <Badge variant="destructive">no type</Badge>;
  } else {
    if (attendeeType.toLowerCase() == "coach") {
      return <Badge variant="secondary">{attendeeType}</Badge>;
    } else if (attendeeType.toLowerCase() == "admin") {
      return <Badge variant="outline">{attendeeType}</Badge>;
    } else if (attendeeType.toLowerCase() == "player") {
      return <Badge variant="default">{attendeeType}</Badge>;
    } else {
      return <Badge className="bg-amber-300">{attendeeType}</Badge>;
    }
  }
}

interface ViewRegisteredPlayersContentProps {
  capacity: number;
  attendees: Attendees[] | [];
}

export default function ViewRegisteredPlayersContent({
  capacity,
  attendees,
}: ViewRegisteredPlayersContentProps) {
  const accountId = 2;

  // fetch data on component mount
  useEffect(() => {}, [capacity, attendees]);

  return (
    <div>
      <div className="flex items-center">
        <h2 className="text-lg font-semibold">Attendees</h2>
        <p className="text-sm font-medium text-gray-500 ml-3">
          {attendees.length}/{capacity}
        </p>
      </div>
      <div className="mx-2">
        {attendees.length > 0 ? (
          attendees.map((attendee) => (
            <div key={attendee.accountId}>
              <div className="flex my-2">
                <div className="mr-4 self-center">
                  <Avatar>
                    <AvatarFallback>
                      <User2Icon color="#a1a1aa" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h4 className="text-sm font-normal mb-1">
                    {attendee.accountId}{" "}
                    {/*{attendee.firstName} {attendee.lastName} */}
                  </h4>
                  {BadgeTypeAttendee(attendee.rank)}
                </div>
              </div>
              <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
            </div>
          ))
        ) : (
          <p className="text-cyan-500 text-center m-5">
            No attendees present in this event
          </p>
        )}
      </div>
    </div>
  );
}
