import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
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
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
//import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "react-router";
import { ProgramDetails } from "@/types/trainingSessionDetails";
import { formSchema } from "@/types/trainingSessionZodFormSchema";
import { Attendees } from "@/types/trainingSessionDetails";
import useModifyTrainingSession from "@/hooks/useModifyProgram";
import { getCookies } from "@/services/cookiesService";
import log from "loglevel";
import BackButton from "../ui/back-button";
import { getFileName } from "@/utils/getFileName";
// Import constants for select fields
import { TRAINING } from "@/constants/programconstants";
import { SPECIALTRAINING } from "@/constants/programconstants";
import { TOURNAMENT } from "@/constants/programconstants";
import { FUNDRAISER } from "@/constants/programconstants";
import { COLLEGE_DE_MAISONNEUVE } from "@/constants/programconstants";
import { CENTRE_DE_LOISIRS_ST_DENIS } from "@/constants/programconstants";
import { MAIN_STREET } from "@/constants/programconstants";
import { TEST_WATER_ROAD } from "@/constants/programconstants";
import { PUBLIC } from "@/constants/programconstants";
import { PRIVATE } from "@/constants/programconstants";
import { DAILY } from "@/constants/programconstants";
import { WEEKLY } from "@/constants/programconstants";
import { MONTHLY } from "@/constants/programconstants";
import { ONCE } from "@/constants/programconstants";
// Import dropZoneConfig for files
import { dropZoneConfig } from "@/constants/drop.zone.config";
import { useWatch } from "react-hook-form";
import { NotificationRequest } from "@/types/notifications";
import useSendNotification from "@/hooks/useSendNotification";

import AssignCoach from "../CreateTrainingSessionForm/AssignCoaches";
import InviteModal, { Member } from "../CreateTrainingSessionForm/InviteModal";
import usePlayers from "@/hooks/usePlayers";
/**All select element options */
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
const visibilities = [
  {
    label: "Public",
    value: PUBLIC,
  },
  {
    label: "Private",
    value: PRIVATE,
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
  {
    label: "123 test water rd.",
    value: TEST_WATER_ROAD,
  },
  {
    label: "123 Main st",
    value: MAIN_STREET,
  },
] as const;

type ModalKey = "invite" | "waitlist";

export default function ModifyTrainingSessionForm() {
  const [accountId, setAccountId] = useState<number | null | undefined>();
  const { toast } = useToast();
  const location = useLocation(); // Location state data sent from training session details page
  const navigate = useNavigate();
  let [attachmentsToRemove /* setAttachmentsToRemove */] = useState<string[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<ModalKey>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- For US305+
  const [attendees, setAttendees] = useState<Attendees[]>([]); // For US305+

  const [waitlistedMembers, setWaitlistedMembers] = useState<number[]>([]);
  const [selectedCoaches, setSelectedCoaches] = useState<number[]>([]);
  const [showSelectedCoaches, setShowSelectedCoaches] = useState(false);

  const handleCoachesSelection = (selectedCoaches: number[]) => {
    setSelectedCoaches(selectedCoaches);
    setShowSelectedCoaches(true);
  };
  const [programDetails, setProgramDetails] = useState<ProgramDetails>({
    programId: 0,
    recurrenceId: 0,
    title: "",
    programType: "",
    description: "",
    capacity: 0,
    occurrenceDate: new Date(),
    durationMins: 0,
    expiryDate: new Date(),
    location: "",
    programAttachments: [],
    frequency: "",
    visibility: "",
    author: "",
    cancelled: false,
    reccurenceDate: new Date(),
  });
  const { modifyTrainingSession } = useModifyTrainingSession();
  const { sendNotification } = useSendNotification();

  useEffect(() => {
    const user = getCookies();
    if (!user || user.type === "GENERAL" || user.type === "PLAYER") {
      navigate("/");
    }
    setAccountId(user?.accountId);
    log.debug(`Modify Training Session Form accountId : ${accountId}`);
  }, [accountId, navigate]);

  /** Initializes a form in a React component using react-hook-form with a Zod schema for validation*/
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  // State for selected participant IDs (existing attendees)
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  // State to control the InviteModal's visibility
  const { players } = usePlayers();
  const members: Member[] = players.map((player) => ({
    id: player.accountId, // <-- now a number
    name: `${player.firstName} ${player.lastName}`,
    email: player.email,
    role: player.type,
  }));
  useEffect(() => {
    if (location.state && location.state.attendees) {
      const attendeeIds = (location.state.attendees as Attendees[]).map(
        (att) => att.accountId, // now a number
      );
      setSelectedMembers(attendeeIds);

      const waitlistedIds = (location.state.attendees as Attendees[])
        .filter((attendee) => attendee.participantType === "Waitlisted")
        .map((attendee) => attendee.accountId);
      setWaitlistedMembers(waitlistedIds);
    }
    if (location.state && location.state.programDetails) {
      setProgramDetails(location.state.programDetails);
    }
  }, [location.state]);
  /** Update state */
  useEffect(() => {
    if (location.state && location.state.programDetails) {
      setProgramDetails(location.state.programDetails);
    }
  }, [location.state]);
  useEffect(() => {
    if (location.state && location.state.attendees) {
      setAttendees(location.state.attendees);
    }
  }, [location.state]);

  useEffect(() => {
    // Set form defaults and update field values
    form.setValue("title", programDetails.title);
    form.setValue("capacity", programDetails.capacity);
    form.setValue("type", programDetails.programType.toUpperCase());
    form.setValue("startDate", new Date(programDetails.occurrenceDate));
    if (
      !(
        programDetails.frequency === null ||
        programDetails.frequency.toUpperCase() === ONCE // TODO
      )
    ) {
      form.setValue("endDate", new Date(programDetails.expiryDate));
    }
    if (programDetails.frequency) {
      form.setValue("frequency", programDetails.frequency.toUpperCase());
    } else {
      form.setValue("frequency", ONCE);
    }
    //form.setValue("recurring", programDetails.recurring);
    form.setValue("visibility", programDetails.visibility.toLowerCase());
    form.setValue("description", programDetails.description);
    if (programDetails.programAttachments) {
      const files = programDetails.programAttachments.map((attachment) => {
        const fileName = attachment.attachmentUrl || "file";
        return new File([attachment.attachmentUrl], fileName, {
          type: "application/octet-stream",
        });
      });
      form.setValue("attachment", files);
    }
    form.setValue(
      "startTime",
      new Date(programDetails.occurrenceDate).toISOString().slice(11, 16),
    );
    const endTime = new Date(programDetails.occurrenceDate);
    endTime.setMinutes(endTime.getMinutes() + programDetails.durationMins); //REFACTOR
    form.setValue("endTime", new Date(endTime).toISOString().slice(11, 16)); //REFACTOR
    form.setValue("location", programDetails.location);

    // Append all programDetials.attachmentUrls to new string[]
    programDetails.programAttachments.map((attachment) => {
      const fileName = attachment.attachmentUrl;
      attachmentsToRemove.push(fileName);
    });
  }, [programDetails, attachmentsToRemove, form]);

  /** Handle form submission and networking logic */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.visibility === "private" && selectedMembers.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description:
          "Please select at least one participant for a private event.",
      });
      return;
    }
    try {
      const json_payload = {
        ...values,
        programId: programDetails.programId ?? null,
        attachment: values.attachment ?? [],
        attendees: values.visibility === "private" ? selectedMembers : [],
      };
      console.log(json_payload);
      log.info("Form to modify Training Session : ", json_payload);

      // Prepare API body : FormData
      const formData = new FormData();
      //atachmentsToRemove contains list of all old files
      //if file.name of values.attachment exists in attachmentToRemove that means that we want to keep that old file
      if (values.attachment && values.attachment.length > 0) {
        values.attachment.forEach((file) => {
          if (!attachmentsToRemove.includes(file.name)) {
            formData.append("attachments", file); //attachment to add
            log.debug("File in form field appended to formData : ", file);
          }
        });
        values.attachment.forEach((file) => {
          log.debug("All files in form field, not the ones to append :", file);
        });
      }

      if (values.attachment && values.attachment.length > 0) {
        values.attachment.forEach((file) => {
          attachmentsToRemove = attachmentsToRemove.filter(
            (urlName) => urlName !== file.name,
          );
        });
      }
      console.warn("attachmentsToRemove : ", attachmentsToRemove);

      const programData = {
        title: values.title,
        type: values.type,
        startDate: values.startDate.toISOString(),
        // If you're changing an event from recurring to non recurring, endDate will already be initialized.
        // therefore, must ensure endDate: null is sent in API body.
        endDate:
          values.frequency === ONCE
            ? null
            : (values.endDate?.toISOString() ?? null),
        frequency: values.frequency,
        visibility: values.visibility,
        description: values.description,
        capacity: values.capacity.toString(),
        startTime: values.startTime,
        endTime: values.endTime,
        location: values.location,
        attachmentsToRemove: attachmentsToRemove ?? [],
      };
      console.warn("programData:", programData);
      formData.append(
        "programData",
        new Blob([JSON.stringify(programData)], {
          type: "application/json",
        }),
      );

      // Append waitlisted participants
      waitlistedMembers.forEach((memberId) => {
        formData.append("waitlistsId", memberId.toString());
      });

      // API call submit form
      setLoading(true);
      const modify = await modifyTrainingSession(
        accountId,
        programDetails.programId,
        formData,
      );
      log.info("modify : ", modify);
      setLoading(false);
      if (modify === null) {
        throw new Error(
          "Error from usemodifyTrainingSession.modifyTrainingSession!",
        );
      }
      log.info("modifyTrainingSession submit success ✔");

      // Toast popup for user to say form submitted successfully
      toast({
        variant: "success",
        title: "Form updated successfully ✔",
        description: "Program was updated in your calendar.",
      });

      // If successful, notify attendees of changes
      const attendeeIds: Array<number> = attendees.map((a) => a.accountId);
      console.warn("attendeeIds", attendeeIds);
      const modifyNotif: NotificationRequest = {
        title: `Changes made to ${programDetails.title ?? "your"} program`,
        body: "Open the app to view changes",
        topic: null,
        recipients: attendeeIds,
      };
      await sendNotification(modifyNotif);

      // If successful, navigate back to calendar page
      navigate("/pages/CalendarPage");
    } catch (error) {
      console.error("Form submission error (error)", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong ✖",
        description:
          "There was a problem with your request. Program was not updated.",
      });
    } finally {
      form.reset();
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
    <div className="mb-32">
      {/** Navigate to previous page */}
      <BackButton />

      {/** Create Training Session Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto pt-10"
        >
          {/*Form Title*/}
          <div>
            <h2 className="text-2xl font-semibold">
              Edit{" "}
              <span className="text-secondaryColour">
                {programDetails.title}
              </span>{" "}
              Program
            </h2>
            <h2>Edit fields and update the form</h2>
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
                <FormDescription>Only 30 characters accepted.</FormDescription>
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
                        <span>Select Coaches</span>
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
                    <div className="mb-2 font-medium"> Selected Coaches:</div>
                    {selectedCoaches.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {selectedCoaches.map((memberId) => {
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
                        No coaches selected.
                      </p>
                    )}
                  </div>
                )}

                <FormMessage />
              </FormItem>
            )}
          />

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
                  Enter the first date of the program. Applies for recurring and
                  non recurring programs.
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
                      " Program end date must fall on the same day of the week as the selected start date and be at least one month apart."}
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
                    Recurring program*
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
          <FormItem className="flex flex-col">
            <FormLabel className="font-semibold text-base">Waitlist</FormLabel>
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
                size="sm"
                className="mt-2"
                onClick={() => setOpenModal("waitlist")}
              >
                Add Members
              </Button>
            </div>
          </FormItem>
          <InviteModal
            description="Waitlist members for program."
            open={openModal === "waitlist"}
            onClose={() => setOpenModal(undefined)}
            members={members}
            selectedMembers={waitlistedMembers}
            setSelectedMembers={setWaitlistedMembers}
          />

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
                          "justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? visibilities.find(
                              (visibility) => visibility.value === field.value,
                            )?.label
                          : "Select visibility"}
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
                          {visibilities.map((visibility) => (
                            <CommandItem
                              value={visibility.label}
                              key={visibility.value}
                              onSelect={() => {
                                form.setValue("visibility", visibility.value);
                                if (visibility.value === "private") {
                                  setOpenModal("invite");
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  visibility.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {visibility.label}
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
                      Selected Participants:
                    </div>
                    {selectedMembers.length > 0 ? (
                      <ul className="list-disc pl-5">
                        {selectedMembers.map((memberId) => {
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
                        No participants selected.
                      </p>
                    )}
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => setOpenModal("invite")}
                    >
                      Edit Participants
                    </Button>
                  </div>
                )}
              </FormItem>
            )}
          />
          <InviteModal
            description="Invite members to training session."
            open={openModal === "invite"}
            onClose={() => setOpenModal(undefined)}
            members={members}
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
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
                <FormDescription>Only 100 characters accepted.</FormDescription>
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
                          <span className="font-semibold">Click to upload</span>
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
                            <span>{getFileName(file.name)}</span>
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
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/** Submit Button */}
          {loading ? (
            <Button disabled className="w-full">
              <Loader2 className="animate-spin" />
              Updating Program
            </Button>
          ) : (
            <Button type="submit" className="w-full font-semibold">
              Update Program
            </Button>
          )}
        </form>
      </Form>
      <div className="justify-self-center mt-8">
        <button className=" bg-transparent" onClick={() => navigate(-1)}>
          <p className="text-center underline text-neutral-400">Cancel</p>
        </button>
      </div>
    </div>
  );
}
