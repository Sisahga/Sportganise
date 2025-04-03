/**
 * RSVP to a Program
 */
// API Request
export interface RSVPRequestDto {
    programId: number;
    accountId: number;
    visibility?: string;
  }
  
  export type RSVPStatus = "not_rsvpd" | "rsvpd";