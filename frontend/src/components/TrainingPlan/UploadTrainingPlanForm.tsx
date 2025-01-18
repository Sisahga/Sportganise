import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { useToast } from "@/hooks/use-toast";

import { CloudUpload, Paperclip, Loader2 } from "lucide-react";

const formSchema = z.object({
  trainingPlans: z.array(
    //array of files
    z.custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Each file must be a valid file and not empty.",
    }),
  ),
});

export default function UploadTrainingPlanFiles() {
  const accountId = "";
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
    accept: {
      "application/msword": [".doc", ".dot"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
        [".dotx"],
      "application/vnd.ms-word.document.macroEnabled.12": [".docm"],
      "application/vnd.ms-word.template.macroEnabled.12": [".dotm"],
    },
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      console.log(JSON.stringify(values, null, 2));

      setLoading(true);
      const response = await fetch(`/${accountId}/upload-trainingplans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values, null, 2),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      form.reset();
      setLoading(false); //premature load to false just in case it would look weird with the toast
      toast({
        title: "File(s) uploaded successfully ✔",
        description: "File(s) were added to your Training Plan",
      });
    } catch (err) {
      form.reset();
      console.log("UploadFile form error: ", err);
      setError("An error occured! The file(s) could not be uploaded.");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong ✖",
        description: error,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="trainingPlans"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-base">
                  Add Training Plans
                </FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={(files) => {
                      field.onChange(files); //update the react-hook-form value
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
                          DOC, DOCX, DOT, DOTX, DOCM, DOTM
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
                <FormDescription>Select a file to upload.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {loading ? (
            <Button disabled className="w-full">
              <Loader2 className="animate-spin" />
              Uploading
            </Button>
          ) : (
            <Button type="submit" className="w-full">
              Submit
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
