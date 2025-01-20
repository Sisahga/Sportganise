import { Badge } from "../ui/badge";

// Handle badge variants based on attendee account type
export default function AttendeeBadgeType(attendeeType: string) {
  // attendee can have null rank
  if (attendeeType === null || attendeeType === "") {
    return <Badge variant="destructive">no type</Badge>;
  } else {
    if (attendeeType.toLowerCase() == "coach") {
      return <Badge variant="secondary">{attendeeType}</Badge>;
    } else if (attendeeType.toLowerCase() == "admin") {
      return <Badge variant="outline">{attendeeType}</Badge>;
    } else if (attendeeType.toLowerCase() == "player") {
      return <Badge variant="default">{attendeeType}</Badge>;
    } else {
      return <Badge className="bg-amber-300">{attendeeType}</Badge>;
    }
  }
}
