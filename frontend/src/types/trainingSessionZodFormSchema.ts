import * as z from "zod";

export const formSchema = z
  .object({
    title: z.string(),
    type: z.string(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    recurring: z.boolean().default(false),
    visibility: z.string(),
    description: z.string(),
    attachment: z
      .array(
        //array of files
        z.custom<File>((file) => file instanceof File && file.size > 0, {
          message: "Each file must be a valid file and not empty.",
        })
      )
      .optional(),
    capacity: z.number().min(0),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time format"),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time format"),
    location: z.string(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date cannot be earlier than the start date.",
    path: ["endDate"], //points to the end_date field in the error message
  })
  .refine((data) => data.endTime >= data.startTime, {
    message: "End time cannot be earlier than start time.",
    path: ["endTime"],
  })
  .refine(
    (data) =>
      !(data.startDate.getTime() === data.endDate.getTime() && data.recurring),
    {
      message:
        "Event start and end dates are the same and therefore cannot reccur.",
      path: ["recurring"],
    }
  );
/* .refine(
    (data) =>
      data.startDate.getDay() === data.endDate.getDay() &&
      data.type === "Training",
    {
      message:
        "The day of the week for training session start and end dates must be the same.",
      path: ["endDate"],
    }
  ) */
