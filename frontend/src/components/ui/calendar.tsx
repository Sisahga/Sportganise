import * as React from "react";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DayContentProps } from "react-day-picker";
import { isSaturday, isSunday, format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";
import usePrograms from "@/hooks/usePrograms";
import { getAccountIdCookie, getCookies } from "@/services/cookiesService";

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  selectedMonth?: Date;
  onMonthChange?: (month: Date) => void;
  programsProp?: ReturnType<typeof usePrograms>;
};

// Creating a small reusable dots for weekends
function WeekendDot() {
  return (
    <span
      style={{
        height: "5px",
        width: "5px",
        borderRadius: "9999px",
        backgroundColor: "orange",
        position: "absolute",
        top: "2px",
        right: "2px",
      }}
    />
  );
}

function EventHighlight() {
  return (
    <span
      style={{
        position: "absolute",
        bottom: "2px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        height: "4px",
        backgroundColor: "blue",
        borderRadius: "2px",
      }}
    />
  );
}

// An orange dot is added on each saturday and sunday
function CustomDayContent({
  date,
  eventDates,
}: DayContentProps & { eventDates: Date[] }) {
  const weekend = isSaturday(date) || isSunday(date);
  const isEventDay = eventDates.some((eventDate: Date) =>
    isSameDay(eventDate, date),
  );

  return (
    <span className="relative flex items-center justify-center w-full h-full">
      {weekend && <WeekendDot />}
      {isEventDay && <EventHighlight />}
      {format(date, "d")}
    </span>
  );
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selectedMonth,
  onMonthChange,
  programsProp,
  ...props
}: CalendarProps) {
  const cookies = getCookies();
  const accountId = cookies ? getAccountIdCookie(cookies) : null;
  const eventDates = programsProp?.eventDates ?? [];
  const fetchProgramDates = programsProp?.fetchProgramDates;

  const currentMonth =
    selectedMonth instanceof Date ? selectedMonth : new Date();

  // Fetch event dates when the Calendar component mounts
  useEffect(() => {
    if (!accountId || !fetchProgramDates) return;

    let cancelled = false;

    const load = async () => {
      if (!cancelled) {
        console.log(" CALENDAR FETCH triggered for accountId:", accountId);
        await fetchProgramDates(accountId);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [accountId, fetchProgramDates]);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      // month={currentMonth}
      // onMonthChange={onMonthChange}
      month={selectedMonth} // Ensure this is the month that gets updated
      onMonthChange={(newMonth) => {
        onMonthChange?.(newMonth); // Call the parent function or handle the state change here
      }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-md font-semibold",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        ),
        nav_button_previous: "border-primaryColour/70 absolute left-1",
        nav_button_next: "border-primaryColour/70 absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          // Range classes:
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          "h-8 w-8 p-0 font-normal aria-selected:opacity-100 bg-transparent",
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        // CustomDayContent will add the dots
        DayContent: (props) => (
          <CustomDayContent {...props} eventDates={eventDates} />
        ), // Pass eventDates
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
