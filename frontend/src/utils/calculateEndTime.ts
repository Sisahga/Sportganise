// Calculate endTime of Training Sessions
export function calculateEndTime(occurenceDate: Date, durationMins: number) {
  occurenceDate.setMinutes(occurenceDate.getMinutes() + durationMins);
  return occurenceDate.toLocaleTimeString("en-CA", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
  });
}
