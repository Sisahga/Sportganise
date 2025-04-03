export interface Member {
  id: number;
  name: string;
  role: string; // e.g., "Coach", "Player", etc.
}

export type ModalKey = "invite" | "waitlist";
