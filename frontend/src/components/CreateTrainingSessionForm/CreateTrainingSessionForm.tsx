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

  const [date, setDate] = React.useState<Date>();
  const [error, setError] = useState(false); //error in fetching data from server with api url

  /*Handle input changes in form fields and update the state of the form*/
  const [formData, setFormData] = useState({ title: "", type: "" }); //useState is a state management approach to track the input values.

  /*Handle form submission and networking logic (sending formValue to server using API url)*/
  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Perform form submission logic, e.g., send data to API
    //Networking code
  };

  const handleChange = (event: any) => {
    //console.log(event);

    //onValueChange for 'select inputs' registers event as the value passed in the form (ex. frundraisor)
    formData.type = event;
    console.log("formData.type" + formData.type);
  };

  /*
  const handleSelect = (date: Date | undefined) => {
    console.log("Selected date:", date);
    
  };
  */
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/*when form is submitted, calls handleSubmit function to handle form logic */}
        <div className="grid grid-rows-* gap-y-6">
          {/*Form Title*/}
          <div>
            <h2 className="text-2xl font-semibold">Create New Event</h2>
            <h2>Complete the form and submit</h2>
          </div>

          {/*Event Title*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="title">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Name the event"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/*Type of Event*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="type">
              Type of Event
            </Label>
            <Select
              name="type"
              value={formData.type}
              onValueChange={handleChange}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select type</SelectLabel>
                  <SelectItem value="training-session">
                    Training Session
                  </SelectItem>
                  <SelectItem value="fundraiser">Fundraiser</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/*Date Picker*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="date">
              Pick a Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  required
                />
              </PopoverContent>
            </Popover>
          </div>

          {/*Start and End Time*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="time">
              Time
            </Label>
            <div className="flex gap-2">
              <Input id="start-time" type="time" required />
              <Input id="end-time" type="time" required />
            </div>
          </div>

          {/*Location*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="location">
              Location
            </Label>
            <Select required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select location</SelectLabel>
                  <SelectItem value="st-denis">
                    Centre de loisirs St-Denis
                  </SelectItem>
                  <SelectItem value="maisonnneuve">
                    Collège de Maisonneuve
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/*Recurring*/}
          <div className="flex items-center space-x-2">
            <Checkbox id="recurring" required />
            <Label
              htmlFor="recurring"
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Recurring event
            </Label>
          </div>

          {/*Public or Private*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="visibility">
              Visibility
            </Label>
            <Select required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select who can see</SelectLabel>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Members only</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/*Description*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="description">
              Description
            </Label>
            <Textarea placeholder="Add description of the event..." />
          </div>

          {/*Add File*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="attachment">
              Add Attachment
            </Label>
            <div className="flex gap-2">
              {/* eslint-disable-next-line jsx-a11y/alt-text -- TODO Sofia replace by lucide icon */}
              <img src={icon} className="content-center"></img>
              <Input id="attachment" type="file" />
            </div>
          </div>

          {/*Capacity*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="capacity">
              Attendance Capacity
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="Write the max number of attendees"
              required
            ></Input>
          </div>

          {/*Invitation and Player List*/}
          <div className="flex gap-1 items-center space-x-2">
            <Checkbox className="self-start" required />
            <div className="flex flex-col">
              <Label
                htmlFor="attendance"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Notify all players
              </Label>
              <a href="../" className="underline text-neutral-400">
                Customize attendance list
              </a>
            </div>
          </div>

          {/*Submit Button or Cancel */}
          <div>
            <Button className="w-full font-semibold" type="submit">
              Create New Event
            </Button>
          </div>
          <div className="text-center self-center">
            <a href="../" className="underline text-neutral-400">
              Cancel
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
