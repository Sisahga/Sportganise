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
    <Form {...form}></Form>
  );
}
