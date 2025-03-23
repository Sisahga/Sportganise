// Data structure for data received from API call
export interface Attendees {
  accountId: number;
  programId: number;
  confirmedDate: Date | null;
  confirmed: boolean;
  rank: string | null;
  participantType: string | null;
}

export interface ProgramDetails {
  programAttachments: ProgramAttachments[];
  programId: number;
  recurrenceId: number;
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
  author: string;
  cancelled: boolean;
  reccurenceDate: Date;
}

export interface ProgramAttachments {
  programId: number;
  attachmentUrl: string;
}

export interface Program {
  programDetails: ProgramDetails;
  attendees: Attendees[];
}
