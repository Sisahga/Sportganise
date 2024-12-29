import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

interface Attendees {
  accountId: number;
  participantType: "COACH" | "ADMIN" | "PLAYER";
  email: string;
  address: string;
  phone: string;
  firstName: string;
  lastName: string;
}

export default function ViewRegisteredPlayersContent() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [attendees, setAttendees] = useState<Attendees[]>([]);

  const [facts, setFacts] = useState([]);

  const { trainingSessionId } = useParams();
  const accountId = ""; //TODO : FIGURE OUT HOW TO GET ACCOUNTID FOR USER CLICKING ON THE TRAININ SESSION CARD

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
        ];
        setAttendees(mockAttendees);

        const response = await fetch(
          //`/api/${accountId}/${trainingSessionId}/details`
          "https://catfact.ninja/facts?limit=4" //TEST WITH REAL API
        );
        if (response.ok) {
          const data = await response.json();
          setFacts(data.data);
          console.log(facts);
          //setAttendees(data.attendees);
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
      } catch (error) {
        console.error("Error fetching registered players content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendees();
  }, []);

  return (
    <div>
      <div className="flex">
        <img></img>
        <div>
          <h3></h3>
        </div>
      </div>
    </div>
  );
}
