import { Attendees } from "@/types/trainingSessionDetails";
import { Badge, BadgeProps } from "../../ui/badge";

interface BadgeConfig extends BadgeProps {
  text: string;
}

const getBadgeConfig = (attendee: Attendees): BadgeConfig => {
  if (attendee.rank !== null) {
    return { className: "bg-amber-400", text: `in queue: ${attendee.rank}` };
  }
  if (attendee.confirmed === false && attendee.participantType === "Subscribed") {
    return { variant: "destructive", text: "absent" };
  }
  return {
    className: "bg-amber-400",
    text: attendee.participantType ? attendee.participantType.toLowerCase() : "n/a",
  };
};

interface AttendeeBadgeTypeProps {
  attendees: Attendees | null;
}

export default function AttendeeBadgeType({ attendees }: AttendeeBadgeTypeProps) {
  if (!attendees) {
    return <Badge variant="destructive">no type</Badge>;
  }
  
  const { text, ...badgeProps } = getBadgeConfig(attendees);

  return <Badge {...badgeProps}>{text}</Badge>;
}
