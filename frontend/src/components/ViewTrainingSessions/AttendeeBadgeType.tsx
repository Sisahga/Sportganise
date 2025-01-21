import { Badge } from "../ui/badge";

// Handle badge variants based on attendee account type
export default function AttendeeBadgeType(attendeeType: string) {
  // attendee can have null rank
  if (attendeeType === null || attendeeType === "") {
    return <Badge variant="destructive">no type</Badge>;
  } else {
    if (attendeeType.toLowerCase() == "coach") {
      return <Badge variant="secondary">{attendeeType.toLowerCase()}</Badge>;
    } else if (attendeeType.toLowerCase() == "admin") {
      return <Badge variant="outline">{attendeeType.toLowerCase()}</Badge>;
    } else if (attendeeType.toLowerCase() == "player") {
      return <Badge variant="default">{attendeeType.toLowerCase()}</Badge>;
    } else {
      return (
        <Badge className="bg-amber-400">{attendeeType.toLowerCase()}</Badge>
      );
    }
  }
}
