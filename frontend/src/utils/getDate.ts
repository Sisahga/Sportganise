/**
 * Formats fetched UTC 'date' strings
 * (Ex: "2025-02-08T14:34:15.342495Z" => "Sat Feb 08 2025")
 *
 * @param date
 * @returns formattedDateString
 */
export function getDate(utcDate: string): string {
  const formattedDateString = new Date(utcDate).toDateString();
  return formattedDateString;
}
