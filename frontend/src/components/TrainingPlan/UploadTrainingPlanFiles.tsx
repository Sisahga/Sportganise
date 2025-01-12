import { useState } from "react";
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
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";

import { CloudUpload, Paperclip } from "lucide-react";

const formSchema = z.object({
  trainingPlans: z.array(
    //array of files
    z.custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Each file must be a valid file and not empty.",
    })
  ),
});

export default function UploadTrainingPlanFiles() {
  const [files, setFiles] = useState<File[] | null>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    accept: {
      "application/doc": [".doc"],
    },
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
    } catch (error) {
      setError("An error occured! The files could not be uploaded.");
    } finally {
      setLoading(false);
    }
  };

  return <div></div>;
}
