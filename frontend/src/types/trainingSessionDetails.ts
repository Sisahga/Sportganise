import { AccountType, Address } from "@/types/account.ts";

export interface Attendees {
  accountId: number;
  programId: number;
  confirmedDate: Date | null;
  confirmed: boolean;
  /**
   * - "Subscribed": confirmed participant
   * - "Invited": allowed to RSVP for private
   * - "Coach": coach of the program
   * - "Waitlisted": waiting for spot
   */
  participantType: "Subscribed" | "Invited" | "Waitlisted" | "Coach" | null;
  rank: number | null;
  isInvited?: boolean;
}

export interface DetailedProgramParticipantDto {
  accountId: number;
  programId: number;
  confirmedDate: Date | null;
  confirmed: boolean;
  participantType: "Subscribed" | "Invited" | "Waitlisted" | "Coach";
  rank: number | null;
  firstName: string;
  lastName: string;
  address: Address;
  email: string;
  phone: string;
  profilePicture: string;
  accountType: AccountType;
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
