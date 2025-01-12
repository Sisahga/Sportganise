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
import { toast, useToast } from "@/hooks/use-toast";

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
  const accountId = "";
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>("");
  const [files, setFiles] = useState<File[] | null>([]);

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
      const response = await fetch(`/${accountId}/upload-trainingplans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", //If sending JSON
        },
        body: JSON.stringify(values, null, 2), //stringify form values in JSON format and send through url
      });
    } catch (err) {
      console.log("UploadFile form error: ", err);
      setError("An error occured! The files could not be uploaded.");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong ✖",
        description: error,
      });
    } finally {
      setLoading(false);
    }
  };

  return <div></div>;
}
