import { useNavigate } from "react-router";
import useCreateTrainingSession from "@/hooks/useCreateTrainingSession";
import log from "loglevel";
import { useEffect, useState } from "react";
import InviteModal, { Member } from "./InviteModal";
import * as z from "zod";
import useFormHandler from "@/hooks/useFormHandler";
import { formSchema } from "@/types/trainingSessionZodFormSchema";
import usePlayers from "@/hooks/usePlayers";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
//import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import {
  Check,
  ChevronsUpDown,
  CloudUpload,
  Paperclip,
  Loader2,
} from "lucide-react";
// Import constants for select fields
import { TRAINING } from "@/constants/programconstants";
import { SPECIALTRAINING } from "@/constants/programconstants";
import { TOURNAMENT } from "@/constants/programconstants";
import { FUNDRAISER } from "@/constants/programconstants";
import { COLLEGE_DE_MAISONNEUVE } from "@/constants/programconstants";
import { CENTRE_DE_LOISIRS_ST_DENIS } from "@/constants/programconstants";
import { PUBLIC } from "@/constants/programconstants";
import { PRIVATE } from "@/constants/programconstants";
import { DAILY } from "@/constants/programconstants";
import { WEEKLY } from "@/constants/programconstants";
import { MONTHLY } from "@/constants/programconstants";
import { ONCE } from "@/constants/programconstants";
// Import dropZoneConfig for files
import { dropZoneConfig } from "@/constants/drop.zone.config";
import { useWatch } from "react-hook-form";
import useGetCookies from "@/hooks/useGetCookies.ts";
import AssignCoach from "./AssignCoaches";

type ModalKey = "invite" | "waitlist";

export default function CreateTrainingSessionForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { form } = useFormHandler();
  const { createTrainingSession } = useCreateTrainingSession();
  const [loading, setLoading] = useState<boolean>(false);
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = usePlayers();

  const members: Member[] = players.map((player) => ({
    id: player.accountId,
    name: `${player.firstName} ${player.lastName}`,
    email: player.email,
    role: player.type, // e.g., "PLAYER", "COACH", "ADMIN"
  }));
  const [openModal, setOpenModal] = useState<ModalKey>();
  const [invitedMembers, setInvitedMembers] = useState<number[]>([]);
  const [selectedCoaches, setSelectedCoaches] = useState<number[]>([]);
  const [waitlistedMembers, setWaitlistedMembers] = useState<number[]>([]);
  const [showSelectedCoaches, setShowSelectedCoaches] = useState(false);
  const selectedType = useWatch({
    control: form.control,
    name: "type",
  });

  const showField =
    selectedType === TRAINING || selectedType === SPECIALTRAINING;

  const handleCoachesSelection = (selectedCoaches: number[]) => {
    setSelectedCoaches(selectedCoaches);
    setShowSelectedCoaches(true);
  };
  const minAttendees = invitedMembers.length;

  useEffect(() => {
    if (form.getValues("capacity") === undefined) {
      form.setValue("capacity", minAttendees);
    }
  }, [form, minAttendees]);

  const maxAttendees = form.watch("capacity");

  useEffect(() => {
    if (maxAttendees !== undefined && maxAttendees < minAttendees) {
      form.setValue("capacity", minAttendees);
    }
  }, [minAttendees, maxAttendees, form]);

  // AccountId from cookies
  const { userId, cookies, preLoading } = useGetCookies();
  useEffect(() => {
    if (!preLoading) {
      if (!userId) {
        log.debug("No accountId found");
      }
      log.info(`CreateTrainingSessionForm accountId is ${userId}`);
    }
  }, [userId]);

  useEffect(() => {
    if (!preLoading) {
      if (!cookies || cookies.type === "GENERAL" || cookies.type === "PLAYER") {
        navigate("/");
      }
      log.debug(`CreateTrainingSessionForm accountId : ${userId}`);
    }
  }, [userId, navigate, cookies]);

  const types = [
    {
      label: "Training Session",
      value: TRAINING,
    },
    {
      label: "Fundraiser",
      value: FUNDRAISER,
    },
    {
      label: "Tournament",
      value: TOURNAMENT,
    },
    {
      label: "Special Training",
      value: SPECIALTRAINING,
    },
  ] as const;
  const frequencies = [
    {
      label: "Daily",
      value: DAILY,
    },
    {
      label: "Weekly",
      value: WEEKLY,
    },
    {
      label: "Monthly",
      value: MONTHLY,
    },
    {
      label: "One time",
      value: ONCE,
    },
  ] as const;
  const locations = [
    {
      label: "Centre de loisirs St-Denis",
      value: CENTRE_DE_LOISIRS_ST_DENIS,
    },
    {
      label: "Collège de Maisonnneuve",
      value: COLLEGE_DE_MAISONNEUVE,
    },
  ] as const;

  /** Handle form submission and networking logic */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.visibility === "private" && invitedMembers.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select at least one member for a private event.",
      });
      return;
    }
    try {
      const jsonPayload = {
        ...values,
        attachment: values.attachment ?? [],
      };
      log.info(jsonPayload);
      console.log(jsonPayload);
      log.info(JSON.stringify(jsonPayload, null, 2));
      console.log(JSON.stringify(jsonPayload, null, 2));

      // Prepare API body
      const formData = new FormData();
      const programData = {
        title: values.title,
        type: values.type,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate?.toISOString() ?? null,
        frequency: values.frequency,
        visibility: values.visibility,
        description: values.description,
        capacity: values.capacity.toString(),
        startTime: values.startTime,
        endTime: values.endTime,
        location: values.location,
      };

      formData.append(
        "programData",
        new Blob([JSON.stringify(programData)], {
          type: "application/json",
        }),
      );

      // Append attachments if available
      if (values.attachment && values.attachment.length > 0) {
        values.attachment.forEach((file) => {
          formData.append("attachments", file);
        });
      }

      // Append participants (each selected member's id)
      if (invitedMembers && invitedMembers.length > 0) {
        invitedMembers.forEach((memberId) => {
          formData.append("participantsId", memberId.toString());
        });
      }

      // Append waitlisted participants
      waitlistedMembers.forEach((memberId) => {
        formData.append("waitlistsId", memberId.toString());
      });

      // Append coaches
      selectedCoaches.forEach((memberId) => {
        formData.append("coachesId", memberId.toString());
      });

      // API submit form
      setLoading(true);
      const create = await createTrainingSession(userId, formData);
      setLoading(false);
      log.info("create", create);
      if (create === null) {
        throw new Error(
          "Error from useCreateTrainingSession.createTrainingSession!",
        );
      }

      log.info("createTrainingSession submit success ✔");

      // Toast popup for successful submission
      toast({
        variant: "success",
        title: "Form submitted successfully ✔",
        description: "Program was added to your calendar.",
      });

      form.reset();
      setInvitedMembers([]);
      // Navigate to home page
      navigate(-1);
    } catch (err) {
      console.error("Create training session form submission error", err);
      log.error("Create training session form submission error", err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong ✖",
        description:
          "There was a problem with your request. Program was not created.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Watch for changes to frequency
  // ... conditionally display endDate when frequency != "DAILY"
  const selectedFreq = useWatch({
    control: form.control,
    name: "frequency",
  });

  return (
    <>
      {playersLoading || preLoading ? (
        <div>Loading players...</div>
      ) : playersError ? (
        <div>Error loading players</div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-3xl mx-auto pb-20 "
          >
            {/*Form Title*/}
            <div className="text-center">
              <h2 className="font-semibold text-3xl text-secondaryColour text-center">
                Create New Program
              </h2>
              <h2 className="text-fadedPrimaryColour text-center">
                Complete the form and submit
              </h2>
            </div>

            {/** Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-base">
                    Title*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name the program"
                      type="text"
                      className="bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Only 30 characters accepted.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-semibold text-base">
                    Type of Program*
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? types.find((type) => type.value === field.value)
                                ?.label
                            : "Select type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search type..." />
                        <CommandList>
                          <CommandEmpty>No type found.</CommandEmpty>
                          <CommandGroup>
                            {types.map((type) => (
                              <CommandItem
                                value={type.label}
                                key={type.value}
                                onSelect={() => {
                                  form.setValue("type", type.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    type.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {type.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>Select the program type.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Only show coach field if program type is Training Session or Special Training */}
            {showField && (
              <FormField
                control={form.control}
                name="coaches"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-semibold text-base">
                      Coach*
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal text-muted-foreground",
                            )}
                          >
                            <span>Select coaches</span>
                            <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[250px] p-0" align="start">
                        <AssignCoach
                          members={members}
                          field={field}
                          onSelectCoaches={handleCoachesSelection}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the coaches in charge of the program
                    </FormDescription>
                    {/* Only show the list of selected coaches when showSelectedCoaches is true */}
                    {showSelectedCoaches && (
                      <div className="mt-2 bg-white border p-2 rounded">
                        <div className="mb-2 font-medium">
                          {" "}
                          Selected Coaches:
                        </div>
                        {selectedCoaches.length > 0 ? (
                          <ul className="list-disc pl-5">
                            {selectedCoaches.map((memberId) => {
                              const member = members.find(
                                (m) => m.id === memberId,
                              );
                              return (
                                <li key={memberId}>
                                  {member ? member.name : "Unknown member"}
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No coaches selected.
                          </p>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/** Start Date */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-semibold text-base">
                    Start Date*
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Enter the first date of the program. Applies for recurring
                    and non recurring programs.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Frequency */}
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-semibold text-base">
                    Frequency*
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? frequencies.find(
                                (frequency) => frequency.value === field.value,
                              )?.label
                            : "Select frequency"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search type..." />
                        <CommandList>
                          <CommandEmpty>No frequency found.</CommandEmpty>
                          <CommandGroup>
                            {frequencies.map((frequency) => (
                              <CommandItem
                                value={frequency.label}
                                key={frequency.value}
                                onSelect={() => {
                                  form.setValue("frequency", frequency.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    frequency.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {frequency.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {!selectedFreq &&
                      "Select the frequency at which you would like the program to recur."}
                    {selectedFreq === ONCE &&
                      " The program is a one day event and will not recur. No end date required."}
                    {selectedFreq === DAILY &&
                      " The program will occur on each day between the start and end dates."}
                    {selectedFreq === WEEKLY &&
                      " The program will recur on the day of the week of the start and end dates."}
                    {selectedFreq === MONTHLY &&
                      " The program will recur on the date given for the start date of the program until the end date."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** End Date */}
            {(selectedFreq === DAILY ||
              selectedFreq === WEEKLY ||
              selectedFreq === MONTHLY) && (
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="font-semibold text-base">
                      End Date*
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Enter the last day of the recurring program.
                      {selectedFreq === "WEEKLY" &&
                        " Program end date must fall on the same day of the week as the selected start date and be at least one week apart."}
                      {selectedFreq === "MONTHLY" &&
                        " Program end date must have the same date of the month as the selected start date and be at least one month apart."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/** Time */}
            <div className="flex gap-2">
              {/**Start Time */}
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold text-base">
                      Start Time*
                    </FormLabel>
                    <FormControl>
                      <Input type="time" className="w-full" {...field} />
                    </FormControl>
                    <FormDescription>
                      Select the time the program starts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/**End Time */}
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="font-semibold text-base">
                      End Time*
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>
                      Select the time the program ends.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/** Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-semibold text-base">
                    Location*
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? locations.find(
                                (location) => location.value === field.value,
                              )?.label
                            : "Select location"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search location..." />
                        <CommandList>
                          <CommandEmpty>No location found.</CommandEmpty>
                          <CommandGroup>
                            {locations.map((location) => (
                              <CommandItem
                                value={location.label}
                                key={location.value}
                                onSelect={() => {
                                  form.setValue("location", location.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    location.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {location.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select the location from the list of locations under your
                    organization.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Recurring */}
            {/* <FormField
              control={form.control}
              name="recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-semibold">
                      Recurring program
                    </FormLabel>
                    <FormDescription>
                      The program recurs on the day and at the times entered.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            /> */}

            {/** Waitlist */}
            {showField && (
              <FormItem className="flex flex-col">
                <FormLabel className="font-semibold text-base">
                  Waitlist
                </FormLabel>
                <FormDescription>
                  Select who will be added to the waitlist for this program.
                </FormDescription>
                <FormMessage />
                <div className="mt-2 border p-2 rounded">
                  <div className="mb-2 font-medium">Selected Attendees:</div>
                  {waitlistedMembers.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {waitlistedMembers.map((memberId) => {
                        const member = members.find((m) => m.id === memberId);
                        return (
                          <li key={memberId}>
                            {member ? member.name : "Unknown member"}
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No member selected.
                    </p>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    className="mt-2"
                    onClick={() => setOpenModal("waitlist")}
                  >
                    Add Members
                  </Button>
                </div>
              </FormItem>
            )}

            {/** Visibility */}
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-semibold text-base">
                    Visibility*
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            !field.value ? "text-muted-foreground" : "",
                            "justify-between",
                          )}
                        >
                          {field.value ? field.value : "Select visibility"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search visibility..." />
                        <CommandList>
                          <CommandEmpty>No visibility found.</CommandEmpty>
                          <CommandGroup>
                            {[
                              { label: "Public", value: PUBLIC },
                              { label: "Private", value: PRIVATE },
                            ].map((v) => (
                              <CommandItem
                                key={v.value}
                                value={v.label}
                                onSelect={() => {
                                  form.setValue("visibility", v.value);
                                  // Open the invite modal when selecting "private"
                                  if (v.value === "private") {
                                    setOpenModal("invite");
                                  }
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    v.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {v.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select who can view the program in their dashboard.
                  </FormDescription>
                  <FormMessage />
                  {field.value === "private" && (
                    <div className="mt-2 border p-2 rounded">
                      <div className="mb-2 font-medium">
                        Selected Attendees:
                      </div>
                      {invitedMembers.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {invitedMembers.map((memberId) => {
                            const member = members.find(
                              (m) => m.id === memberId,
                            );
                            return (
                              <li key={memberId}>
                                {member ? member.name : "Unknown member"}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No attendees selected.
                        </p>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        className="mt-2"
                        onClick={() => setOpenModal("invite")}
                      >
                        Add Attendees
                      </Button>
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/** Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-base">
                    Description*
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add description of the program here ..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Only 100 characters accepted.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Add Attachment */}
            <FormField
              control={form.control}
              name="attachment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-base">
                    Add Attachment
                  </FormLabel>
                  <FormControl>
                    <FileUploader
                      value={field.value || []}
                      onValueChange={(newFiles) => {
                        //setFiles(newFiles); // Update local state
                        field.onChange(newFiles); // Sync with React Hook Form
                      }}
                      dropzoneOptions={dropZoneConfig}
                      className="relative bg-background rounded-lg p-2"
                    >
                      <FileInput
                        id="fileInput"
                        className="outline-dashed outline-1 outline-slate-500"
                      >
                        <div className="flex items-center justify-center flex-col p-8 w-full ">
                          <CloudUpload className="text-gray-500 w-10 h-10" />
                          <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>
                            &nbsp; or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG, PDF and more
                          </p>
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {field.value &&
                          field.value.length > 0 &&
                          field.value.map((file: File, i: number) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                  <FormDescription>
                    Select a file to upload. Max file size is 10 MB. Limit of 5
                    files.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Attendance Capacity */}
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-base">
                    Attendance Capacity*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Write the max number of attendees"
                      type="number"
                      min={minAttendees}
                      {...field}
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value);
                        field.onChange(value);
                      }}
                      value={maxAttendees === undefined ? "" : maxAttendees}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/** Notify All Players */}
            {/* <div> MAY BE NEEDED BY US305+
            <FormField
              control={form.control}
              name="notify"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-semibold">
                      Notify all players
                    </FormLabel>
                    <FormDescription>
                      Notifies all subscribed members.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="mt-2">
              <a href="../" className=" underline text-neutral-400">
                Customize attendance list
              </a>
            </div>
          </div> */}

            {/** Submit Button */}
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="animate-spin" />
                Creating Program
              </Button>
            ) : (
              <Button type="submit" className="w-full font-semibold">
                Create new Program
              </Button>
            )}
            <div className="justify-self-center pb-5">
              <button className=" bg-transparent" onClick={() => navigate(-1)}>
                <p className="text-center underline text-neutral-400">Cancel</p>
              </button>
            </div>
          </form>
        </Form>
      )}
      {/* Invite Modal */}
      <InviteModal
        description="Invite members to training session."
        open={openModal === "invite"}
        onClose={() => setOpenModal(undefined)}
        members={members}
        selectedMembers={invitedMembers}
        setSelectedMembers={setInvitedMembers}
      />
      <InviteModal
        description="Waitlist members for program."
        open={openModal === "waitlist"}
        onClose={() => setOpenModal(undefined)}
        members={members}
        selectedMembers={waitlistedMembers}
        setSelectedMembers={setWaitlistedMembers}
      />
    </>
  );
}
