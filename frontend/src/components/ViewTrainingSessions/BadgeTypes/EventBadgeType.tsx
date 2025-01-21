import { Badge, BadgeProps } from "../../ui/badge";

const getBadgeProps = (programType: string): BadgeProps => {
  switch (programType.toLowerCase()) {
    case "training":
      return {};
    case "funraisor":
    case "fundraiser":
      return { variant: "secondary" };
    case "tournament":
      return { className: "gb-teal-300" };
    case "inter-club meeting":
      return { className: "bg-indigo-300" };
    case "special":
      return { className: "bg-lime-300" };
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
