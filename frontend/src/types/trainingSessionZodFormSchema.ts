import * as z from "zod";

export const formSchema = z
  .object({
    title: z.string().max(30, "Only 30 characters accepted."),
    type: z.string(),
    coaches: z.array(z.number()).optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    frequency: z.string(),
    //recurring: z.boolean().default(false),
    visibility: z.string(),
    description: z.string().max(100, "Only 100 characters accepted."),
    attachment: z
      .array(
        //array of files
        z.custom<File>((file) => file instanceof File && file.size > 0, {
          message: "Each file must be a valid file and not empty.",
        }),
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
  .superRefine((data, ctx) => {
    // Validate that coaches are provided if type is not Tournament or Fundraiser
    if ((data.type === "TRAINING" || data.type === "SPECIALTRAINING") && 
        data.coaches?.length === 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "At least one coach is required for training sessions.",
            path: ["coaches"],
          });
        }
      })
  .superRefine((data, ctx) => {
    if (data.frequency !== "ONCE" && !data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date is required for recurring programs.",
        path: ["endDate"],
      });
    }
  })
  .refine((data) => !data.endDate || data.endDate >= data.startDate, {
    message: "End date cannot be earlier than the start date.",
    path: ["endDate"],
  })
  .refine((data) => data.endTime >= data.startTime, {
    message: "End time cannot be earlier than start time.",
    path: ["endTime"],
  })
  /* .refine(
    (data) =>
      !data.endDate ||
      data.startDate.getTime() !== data.endDate.getTime() ||
      !data.recurring,
    {
      message:
        "Program start and end dates are the same and therefore cannot recur.",
      path: ["recurring"],
    }
  ) */
  .refine(
    (data) =>
      !data.endDate ||
      !(
        data.startDate.getDate() === data.endDate.getDate() &&
        data.startDate.getMonth() === data.endDate.getMonth() &&
        data.frequency !== "ONCE"
      ),
    {
      message:
        "Program start and end dates are the same and therefore can only occur once.",
      path: ["frequency"],
    },
  )
  .refine(
    (data) =>
      !data.endDate ||
      !(
        data.frequency === "WEEKLY" &&
        data.endDate.getDay() !== data.startDate.getDay()
      ),
    {
      message:
        "Program start and end dates must be at least a week apart and fall on the same day of the week.",
      path: ["frequency"],
    },
  )
  .refine(
    (data) =>
      data.frequency !== "MONTHLY" ||
      (!data.endDate
        ? true
        : data.endDate.getDate() === data.startDate.getDate() &&
          data.endDate.getMonth() !== data.startDate.getMonth()),
    {
      message:
        "Program start and end dates must be at least a month apart and be on the same date.",
      path: ["frequency"],
    },
  );
/*  .refine(
    (data) =>
      data.startDate.getDay() === data.endDate.getDay() &&
      data.type === "Training",
    {
      message:
        "The day of the week for training session start and end dates must be the same.",
      path: ["endDate"],
    }
  ); */
