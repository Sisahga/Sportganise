import { AccountType } from "@/types/account";
import { Badge, BadgeProps } from "../../ui/badge";

const getBadgeProps = (accountType: AccountType): BadgeProps => {
  switch (accountType) {
    case "ADMIN":
      return { variant: "outline" };
    case "COACH":
      return { variant: "secondary" };
    case "PLAYER":
    case "GENERAL":
      return { variant: "default" };
    default:
      return { className: "bg-amber-400" };
  }
};

interface AttendeeBadgeTypeProps {
  accountType?: AccountType;
}
// Handle badge variants based on attendee account type
export default function AttendeeBadgeType({
  accountType,
}: AttendeeBadgeTypeProps) {
  // attendee can have null rank
  if (accountType === undefined) {
    return <Badge variant="destructive">no type</Badge>;
  }
  const badgeProps = getBadgeProps(accountType);

  return <Badge {...badgeProps}>{accountType.toLowerCase()}</Badge>;
}
