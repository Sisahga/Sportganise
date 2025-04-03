export function formatDate(date: Date): Date {
  const [year, month, day] = date
    .toString()
    .split("T")[0]
    .split("-")
    .map(Number);
  return new Date(year, month - 1, day);
}
