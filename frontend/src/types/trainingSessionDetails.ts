// Data structure for data received from API call
export interface Attendees {
  accountId: number;
  programId: number;
  confirmedDate: Date | null;
  confirmed: boolean;
  // participantType: string | null;
  /**
   * - "Subscribed": confirmed participant
   * - "Invited": allowed to RSVP for private
   * - "Waitlisted": waiting for spot
   */
  participantType: "Subscribed" | "Invited" | "Waitlisted" | null;
  rank: number | null;
  isInvited?: boolean;
}

export interface ProgramDetails {
  programId: number;
  recurrenceId: number;
  programType: string;
  title: string;
  description: string;
  author: string;
  capacity: number;
  occurrenceDate: Date;
  reccurenceDate: Date;
  durationMins: number;
  expiryDate: Date;
  frequency: string;
  location: string;
  visibility: "public" | "private";
  isCancelled: boolean;
  programAttachments: ProgramAttachments[];
}

export interface ProgramAttachments {
  programId: number;
  attachmentUrl: string;
}

export interface Program {
  programDetails: ProgramDetails;
  attendees: Attendees[];
}
