//This is the view of the training session page

// Data structure for data received from API call
interface Attendees {
  accountId: number;
  participantType: "COACH" | "ADMIN" | "PLAYER";
  email: string;
  address: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface ProgramDetails {
  programId: number;
  title: string;
  type: string;
  description: string;
  capacity: number;
  occurenceDate: Date;
  duration: number;
  recurring: boolean;
  expiryDate: Date;
  coach: string;
  location: string;
  attachment: File[] | null;
}

interface Event {
  programId: number;
  programDetails: ProgramDetails;
  attendees: Attendees[];
}

export default function TrainingSessionsContent() {
  return (
    <div>
      <p>this is the FULL CARD CONTENT</p>
    </div>
  );
}
