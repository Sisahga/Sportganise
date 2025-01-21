import { Badge } from "../../ui/badge";

// Badge component for all types of events
export default function EventBadgeType(programType: string) {
  if (programType.toLowerCase() === "training") {
    return <Badge>{programType.toLowerCase()}</Badge>;
  } else if (
    programType.toLowerCase() === "fundraisor" ||
    programType.toLowerCase() === "fundraiser"
  ) {
    return <Badge variant="secondary">{programType.toLowerCase()}</Badge>;
  } else if (programType.toLowerCase() === "tournament") {
    return <Badge className="bg-teal-300">{programType.toLowerCase()}</Badge>;
  } else if (programType.toLowerCase() === "inter-club meeting") {
    return <Badge className="bg-indigo-300">{programType.toLowerCase()}</Badge>;
  } else if (programType.toLowerCase() === "special") {
    return <Badge className="bg-lime-300">{programType.toLowerCase()}</Badge>;
  } else if (programType.toLowerCase() === "cancelled") {
    return <Badge variant="destructive">{programType.toLowerCase()}</Badge>;
  } else {
    //other types of events
    return <Badge variant="outline">{programType.toLowerCase()}</Badge>;
  }
}
