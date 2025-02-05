import { Account } from "@/types/account";
import { Attendees } from "@/types/trainingSessionDetails";

export interface WaitlistParticipant extends Attendees {
  accountId: Account["accountId"];
  firstName: Account["firstName"];
  lastName: Account["lastName"];
  pictureUrl: Account["pictureUrl"];
  rank: number | null; // Position in the waitlist
}
