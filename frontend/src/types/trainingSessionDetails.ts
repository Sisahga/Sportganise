// Data structure for data received from API call
export interface Attendees {
  accountId: number;
  programId: number;
  rank: string; // "COACH" | "ADMIN" | "PLAYER"
  confirmedDate: Date;
  confirmed: boolean;
}

export interface ProgramDetails {
  programAttachments: ProgramAttachments[];
  programId: number;
  programType: string;
  title: string;
  description: string;
  capacity: number;
  occurrenceDate: Date;
  durationMins: number;
  expiryDate: Date;
  frequency: string;
  location: string;
  visibility: string;
  recurring: boolean;
}

export interface ProgramAttachments {
  programId: number;
  attachmentUrl: string;
}

export interface Program {
  programDetails: ProgramDetails;
  attendees: Attendees[];
}
