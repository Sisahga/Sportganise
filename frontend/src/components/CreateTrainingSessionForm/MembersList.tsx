import { PropsWithChildren } from "react";
import { Member } from "./types";

type MemberListProps = PropsWithChildren<{
  members: Member[];
  selectedMemberIds: number[];
  title?: string;
  noneSelectedMsg?: string;
}>;

export function MemberList({
  members,
  selectedMemberIds,
  title = "Selected Members:",
  noneSelectedMsg = "No member selected.",
  children,
}: MemberListProps) {
  return (
    <div className="mt-2 bg-white border p-2 rounded">
      <div className="mb-2 font-medium">{title}</div>
      {selectedMemberIds.length > 0 ? (
        <ul className="list-disc pl-5">
          {selectedMemberIds.map((memberId) => {
            const member = members.find((m) => m.id === memberId);
            return (
              <li key={memberId}>{member ? member.name : "Unknown member"}</li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">{noneSelectedMsg}</p>
      )}
      {children}
    </div>
  );
}
