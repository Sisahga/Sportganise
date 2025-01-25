export interface MemberStatus {
  name: string;
  status: "approved" | "pending";
}

export interface DeleteRequestProps {
  requestedBy?: string;
  members?: MemberStatus[];
}
