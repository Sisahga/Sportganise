import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Attendees {
  accountId: number;
  participantType: "COACH" | "ADMIN" | "PLAYER";
  email: string;
  address: string;
  phone: string;
  firstName: string;
  lastName: string;
}

function badgeType(participantType: string) {
  if (participantType.toLowerCase() == "coach") {
    return "secondary";
  } else if (participantType.toLowerCase() == "admin") {
    return "outline";
  } else if (participantType.toLowerCase() == "player") {
    return "default";
  } else {
    return "destructive";
  }
}

export default function ViewRegisteredPlayersContent() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Attendees[]>([]);
  const { trainingSessionId } = useParams();
  const accountId = ""; //TODO : FIGURE OUT HOW TO GET ACCOUNTID FOR USER CLICKING ON THE TRAINING SESSION CARD

  // fetch data on component mount
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const mockAttendees: Attendees[] = [
          {
            accountId: 1000,
            participantType: "PLAYER",
            email: "email1@gmail.com",
            address: "8889 Rue Street",
            phone: "514-555-555",
            firstName: "John1",
            lastName: "Doe1",
          },
          {
            accountId: 2000,
            participantType: "COACH",
            email: "email2@gmail.com",
            address: "8889 Rue Street",
            phone: "514-555-555",
            firstName: "John2",
            lastName: "Doe2",
          },
          {
            accountId: 3000,
            participantType: "ADMIN",
            email: "email3@gmail.com",
            address: "8889 Rue Street",
            phone: "514-555-555",
            firstName: "John3",
            lastName: "Doe3",
          },
          {
            accountId: 4000,
            participantType: "ADMIN",
            email: "email3@gmail.com",
            address: "8889 Rue Street",
            phone: "514-555-555",
            firstName: "John3",
            lastName: "Doe3",
          },
          {
            accountId: 5000,
            participantType: "ADMIN",
            email: "email3@gmail.com",
            address: "8889 Rue Street",
            phone: "514-555-555",
            firstName: "John3",
            lastName: "Doe3",
          },
          {
            accountId: 6000,
            participantType: "ADMIN",
            email: "email3@gmail.com",
            address: "8889 Rue Street",
            phone: "514-555-555",
            firstName: "John3",
            lastName: "Doe3",
          },
          {
            accountId: 7000,
            participantType: "ADMIN",
            email: "email3@gmail.com",
            address: "8889 Rue Street",
            phone: "514-555-555",
            firstName: "John3",
            lastName: "Doe3",
          },
        ];
        setAttendees(mockAttendees);

        /*
        const response = await fetch(
          `/api/${accountId}/${trainingSessionId}/details`
          //"https://catfact.ninja/facts?limit=4" //a testing api
        );

        if (response.ok) {
          const data = await response.json();
          setAttendees(data.attendees);
        } else {
          console.log(
            "Error fetching registered players content: ",
            response.status
          );
          setError(
            "Error fetching registered players content: " + response.status
          );
          throw new Error(
            `Fetching registered players content: HTTP error! status: ${response.status}`
          ); // re-throw for the catch block below
        }
        */
      } catch (error) {
        console.error(
          "Error fetching registered players content HTTP error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, []);

  return (
    <div>
      <h2 className="text-l font-semibold my-4">Attendees</h2>
      {attendees.length > 0 ? (
        attendees.map((attendee) => (
          <div key={attendee.accountId}>
            <div className="flex my-2">
              <div className="mr-4 self-center">
                <Avatar>
                  {" "}
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h4 className="text-sm font-normal mb-1">
                  {attendee.firstName} {attendee.lastName}
                </h4>
                <Badge variant={badgeType(attendee.participantType)}>
                  {attendee.participantType}
                </Badge>
              </div>
            </div>
            <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700" />
          </div>
        ))
      ) : loading ? (
        <p>Loading attendees...</p>
      ) : (
        <p>Error loading attendees: {error}</p>
      )}
    </div>
  );
}
