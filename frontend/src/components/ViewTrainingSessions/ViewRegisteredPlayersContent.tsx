/**
 * DON'T NEED THIS FILE ANYMORE
 */

//import { useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Attendees } from "@/types/trainingSessionDetails";
import AttendeeBadgeType from "./AttendeeBadgeType";
import { User2Icon } from "lucide-react";
import usePersonalInformation from "@/hooks/usePersonalInfromation";
//import { Account } from "@/types/account";

interface ViewRegisteredPlayersContentProps {
  capacity: number;
  attendees: Attendees[] | [];
}

export default function ViewRegisteredPlayersContent({
  capacity,
  attendees,
}: ViewRegisteredPlayersContentProps) {
  // fetch data on component mount
  //useEffect(() => {}, [capacity, attendees]);

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
          attendees.map((attendee) => {
            const { data, loading, error } = usePersonalInformation(
              attendee.accountId,
            );

            return (
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
                    {loading ? (
                      <p className="text-cyan-300 text-sm font-normal m-5">
                        Loading...
                      </p>
                    ) : error ? (
                      <p className="text-red text-sm font-normal mb-1">
                        Failed to load account details
                      </p>
                    ) : (
                      <h4 className="text-sm font-normal m-5">
                        {data?.firstName} {data?.lastName}
                      </h4>
                    )}
                    {AttendeeBadgeType(data?.type ?? "")}
                  </div>
                </div>
                <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
              </div>
            );
          })
        ) : (
          <p className="text-cyan-500 text-center m-5">
            No attendees present in this event
          </p>
        )}
      </div>
    </div>
  );
}
