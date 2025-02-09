// React
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// Zod
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// Hooks
import useUploadTrainingPlan from "@/hooks/useUploadTrainingPlan";
// Services
import { getCookies, getAccountIdCookie } from "@/services/cookiesService";
// Logs
import log from "loglevel";
// Types
import { dropZoneConfig } from "./DropZoneConfig";
// UI Components
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
// Icons
import { CloudUpload, Paperclip, Loader2 } from "lucide-react";

// Form Schema Definition with Zod
const formSchema = z.object({
  trainingPlans: z.array(
    //array of files
    z.custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Each file must be a valid file and not empty.",
    }),
  ),
});

export default function UploadTrainingPlanFiles() {
  log.info("Rendered UploadTrainingPlanForm");
  // Local States
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  // Cookies
  const cookies = getCookies();
  const accountId = cookies ? getAccountIdCookie(cookies) : null;
  useEffect(() => {
    if (!accountId) {
      log.debug("UploadTrainingPlanForm -> No accountId found");
    }
    log.info(`UploadTrainingPlanForm -> accountId is ${accountId}`);
  }, [accountId]);

  // API Hook for Form Submission
  const { uploadTrainingPlans } = useUploadTrainingPlan();

  // Initialize and Wrap React-Hook-Form with Zod Validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      log.info("UploadTrainingPlanForm -> form submission values are", values);

      // Prepare API Body
      const formData = new FormData();
      if (values.trainingPlans && values.trainingPlans.length > 0) {
        values.trainingPlans.forEach((file: File) => {
          formData.append("trainingPlan", file);
        });
      } // BE handles null List<MultiPartFile>

      // Call API Submit Form
      setLoading(true);
      const uploadingTrainingPlanResponse = await uploadTrainingPlans(
        accountId,
        formData, // FormData[]: File
      );

      // Successfully Uploaded Files
      if (uploadingTrainingPlanResponse?.statusCode === 201) {
        setLoading(false); // Premature load to false just in case it would look weird with the toast
        toast({
          title: "File(s) uploaded successfully ✔",
          description: "File(s) were added to your Training Plan",
        });
      } else {
        throw new Error(
          `UploadTrainingPlanForm -> Error thrown! ${uploadingTrainingPlanResponse?.message}`,
        );
      }
    } catch (err) {
      // Handle Error
      log.error(err);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong ✖",
        description: "An error occured! The file(s) could not be uploaded.",
      });
    } finally {
      // Reset Form
      form.reset(); // Do not allow accidental form re-submission
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
                <FormDescription>
                  Select a file to upload at a time. Max file size is 4 MB.
                  Limit of 5 files.
                </FormDescription>
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
