// IMPORTS ------------------------------------------
import { useEffect, useState } from "react";
import { MoveLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";

//GLOBAL --------------------------------------------
/** Form schema, data from the fields in the form will conform to these types. JSON string will follow this format.*/
const formSchema = z.object({
  title: z.string(),
  type: z.string(),
  start_day: z.coerce.date(),
  end_date: z.coerce.date(),
  recurring: z.boolean().default(true),
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
  notify: z.boolean().default(true),
  start_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time format"),
  end_time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time format"),
  location: z.string(),
});

//PAGE CONTENT --------------------------------------------
export default function ModifyTrainingSessionForm() {
  const { trainingSessionId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fact: "", //TO DELETE
    length: 0, //TO DELETE
    title: "",
    type: "",
    start_day: new Date(),
    end_date: new Date(),
    recurring: false,
    visibility: "",
    description: "",
    attachment: [],
    capacity: 0,
    notify: false,
    start_time: "",
    end_time: "",
    location: "",
  }); //Assuming response is an object. Values will be overriden in fetch.
  const [notFound, setNotFound] = useState(false);

  /** Fetch form data from database using API call*/

  useEffect(() => {
    const url = "/api/training-sessions/" + trainingSessionId;
    fetch("https://catfact.ninja/fact") //"https://catfact.ninja/fact" for now to test if can obtain json data and render on page
      //replace fetch("...") with 'url' for actual api call
      .then((response) => {
        if (response.status === 404) {
          //render 404 component on the page
          setNotFound(true);
          console.log("notFound: " + notFound);
        }
        return response.json(); //turns response into a javascript object
      })
      .then((data) => {
        console.log(data);
        setFormData(data); //grab the value/data in the response.json()
        //const fields = Object.keys(data); // Array of field names
        //console.log(fields);
        //const parseData = formSchema.safeParse(formData);
        //console.log("PARSE DATA:" + parseData.data);
        //console.log("FACT2:" + formData.length);
        //console.log("formData: " + Object.values(formData));

        //Set form defaults and update field values
        form.setValue("title", data.fact);
        form.setValue("capacity", data.capacity);
        form.setValue("type", data.type);
        form.setValue("start_day", data.start_day);
        form.setValue("end_date", data.end_date);
        form.setValue("recurring", data.recurring);
        form.setValue("visibility", data.visibility);
        form.setValue("description", data.description);
        form.setValue("attachment", data.attachment); //undefined
        form.setValue("notify", data.notify);
        form.setValue("start_time", data.start_time);
        form.setValue("end_time", data.end_time);
        form.setValue("location", data.location);
      });
  }, []);

  /**All select element options */
  //Options for type select
  const types = [
    {
      label: "Training Session",
      value: "training-session",
    },
    {
      label: "Fundraisor",
      value: "fundraisor",
    },
  ] as const;
  //Options for visibility select
  const visibilities = [
    {
      label: "Public",
      value: "public",
    },
    {
      label: "Members only",
      value: "members",
    },
  ] as const;
  //Options for location select
  const locations = [
    {
      label: "Centre de loisirs St-Denis",
      value: "Centre-de-loisirs-St-Denis",
    },
    {
      label: "Collège de Maisonnneuve",
      value: "Collège-de-Maisonnneuve",
    },
  ] as const;

  /** Handle files for file upload in form*/
  const [files, setFiles] = useState<File[] | null>([]); //Maintain state of files that can be uploaded in the form
  const dropZoneConfig = {
    //File configurations
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
      "application/pdf": [".pdf"],
    },
  };

  /** Initializes a form in a React component using react-hook-form with a Zod schema for validation*/
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      start_day: new Date(),
      end_date: new Date(),
    },
  });

  /** Handle form submission and networking logic */
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    //async request which may result error
    try {
      console.log(values);

      // Merge the trainingSessionId into the values object
      let json_payload = {
        ...values,
        trainingSessionId: trainingSessionId ?? null,
        attachment: files ?? [], //ensure attachment: appears in json payload body
      };

      console.log(json_payload);
      console.log(
        "STRINGIFIED JSON PAYLOAD" + JSON.stringify(json_payload, null, 2)
      );

      //await fetch()
      //---------UPDATE WITH PROPER API URL
      /*
      const response = await fetch("/api/module/createTrainingSessionForm", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", //If sending JSON
        },
        body: JSON.stringify(json_payload, null, 2),
      });

      // Check for HTTP errors
      if (!response.ok) {
      */
      /*
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown server error" })); // try to get error details from server
        const errorMessage =
          errorData.message || response.statusText || "An error occurred."; // prioritize specific error messages
        throw new Error(errorMessage);
        */
      /*
        throw new Error(`HTTP error! status: ${response.status}`); // re-throw for the catch block below
      }
      

      //...rest of success handling
      const data = await response.json(); //data sent back from backend response to url call
      console.log("Form submitted successfully:", data);
      */

      //toast popup for user to say form submitted successfully
      toast("Event updated successfully!");
      //Reset form fields
      //form.reset();
      // If successful, navigate to the success page with a message

      /*
      form.setValue("title", "");
      form.setValue("type", "");
      form.setValue("start_day", new Date());
      form.setValue("end_date", new Date());
      form.setValue("recurring", false);
      form.setValue("visibility", "");
      form.setValue("description", "");
      form.setValue("attachment", undefined);
      form.setValue("capacity", 0);
      form.setValue("notify", false);
      form.setValue("start_time", "");
      form.setValue("end_time", "");
      form.setValue("location", "");
      form.reset();
      */
    } catch (error: any) {
      console.error("Form submission error (error)", error);
      console.error("Error submitting form (message):", error.message);
      toast("There was a problem with your request. Event was not updated.");
    }
  };

  return (
    //RETURN ----------------------------------------------
    <>
      {/** Navigate to previous page */}

      <Button
        className="rounded-full"
        variant="outline"
        onClick={() => navigate("/")}
      >
        <MoveLeft />
      </Button>
      {/** Create Training Session Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          {/*Form Title*/}
          <div>
            <h2 className="text-2xl font-semibold">
              Edit <span style={{ color: "#82DBD8" }}>{formData.fact}</span>{" "}
              Event
            </h2>
            <h2>Edit fields and update the form</h2>
          </div>

          {/** Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">Title</FormLabel>
                <FormControl>
                  <Input placeholder="Name the event" type="text" {...field} />
                </FormControl>
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
                  Type of Event
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
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
                                    : "opacity-0"
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

                <FormMessage />
              </FormItem>
            )}
          />

          {/** Start Date */}
          <FormField
            control={form.control}
            name="start_day"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-semibold text-base">
                  Start Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
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
                  Enter the first date of the event. Applies for recurring and
                  non recurring events. If recurring, this day will be the
                  assumed repeat day in the future.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** End Date */}
          <FormField
            control={form.control}
            name="end_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-semibold text-base">
                  End Date
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
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
                  Enter the last day of a recurring event.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Time */}
          <div className="flex gap-2">
            {/**Start Time */}
            <FormField
              control={form.control}
              name="start_time"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold text-base">
                    Start Time
                  </FormLabel>
                  <FormControl>
                    <Input type="time" className="w-full" {...field} />
                  </FormControl>
                  <FormDescription>
                    Select the time the event starts.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/**End Time */}
            <FormField
              control={form.control}
              name="end_time"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="font-semibold text-base">
                    End Time
                  </FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormDescription>
                    Select the time the event ends.
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
                  Location
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? locations.find(
                              (location) => location.value === field.value
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
                                    : "opacity-0"
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
          <FormField
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
                    Recurring event
                  </FormLabel>
                  <FormDescription>
                    The event recurs on the day and at the times entered.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/** Visibility */}
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="font-semibold text-base">
                  Visibility
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? visibilities.find(
                              (visibility) => visibility.value === field.value
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
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  visibility.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
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
                  Select who can view the event in their dashboard.
                </FormDescription>
                <FormMessage />
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
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add description of the event here ..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>

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
                    value={files}
                    onValueChange={(newFiles) => {
                      setFiles(newFiles); // Update local state
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
                      {files &&
                        files.length > 0 &&
                        files.map((file, i) => (
                          <FileUploaderItem key={i} index={i}>
                            <Paperclip className="h-4 w-4 stroke-current" />
                            <span>{file.name}</span>
                          </FileUploaderItem>
                        ))}
                    </FileUploaderContent>
                  </FileUploader>
                </FormControl>
                <FormDescription>Select a file to upload.</FormDescription>
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
                  Attendance Capacity
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Write the max number of attendees"
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          {/** Notify All Players */}
          <div>
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
          </div>

          {/** Submit Button */}
          <Button type="submit" className="w-full font-semibold">
            Update Event
          </Button>
          <div className="text-center self-center">
            <a href="../" className="underline text-neutral-400">
              Cancel
            </a>
          </div>
        </form>
      </Form>
    </>
  );
}
