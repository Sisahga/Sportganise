import { Badge, BadgeProps } from "../../ui/badge";

const getBadgeProps = (programType: string): BadgeProps => {
  switch (programType.toLowerCase()) {
    case "training":
      return {};
    case "fundraisor":
    case "fundraiser":
      return { variant: "secondary" };
    case "tournament":
      return { className: "bg-teal-400" };
    case "inter-club meeting":
      return { className: "bg-indigo-300" };
    case "special training":
      return { className: "bg-slate-400" };
    case "cancelled":
      return { variant: "destructive" };
    default:
      return { variant: "outline" };
  }
};

interface EventBadgeTypeProps {
  programType: string;
}

// Badge component for all types of events
export default function EventBadgeType({ programType }: EventBadgeTypeProps) {
  const badgeProps = getBadgeProps(programType);

  return <Badge {...badgeProps}>{programType.toLowerCase()}</Badge>;
}

export function AttendingBadge() {
  return <Badge className="bg-green-500 text-white">Attending</Badge>;
}
