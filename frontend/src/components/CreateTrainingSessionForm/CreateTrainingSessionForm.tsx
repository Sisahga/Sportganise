// IMPORTS ------------------------------------------
import { useState } from "react";
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
});

//PAGE CONTENT --------------------------------------------
export default function CreateTrainingSessionForm() {
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
      //default values that will considered for each state when page is loaded and also what is rendered when the page loads
      start_day: new Date(),
      end_date: new Date(),
      title: "",
      attachment: [],
      notify: true,
      recurring: true, //match with specified in formSchema
      capacity: 0,
      type: "",
      visibility: "",
      description: "",
    },
  });

  /** Handle form submission and networking logic */
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(JSON.stringify(values, null, 2));
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    //RETURN ----------------------------------------------
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        {/*Form Title*/}
        <div>
          <h2 className="text-2xl font-semibold">Create New Event</h2>
          <h2>Complete the form and submit</h2>
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
                Enter the first date of the event. Applies for recurring and non
                recurring events. If recurring, this day will be the assumed
                repeat day in the future.
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
                <FormLabel className="font-semibold">Recurring event</FormLabel>
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
      </form>
    </Form>
  );
}
