/**
 * Should be reusable hook for ModifyTrainingSession
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { formSchema } from "@/types/trainingSessionZodFormSchema";

/** Initializes a form in a React component using react-hook-form with a Zod schema for validation*/
function useFormhandler() {
  // will be used as form in Shadcn form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return { form };
}

export default useFormhandler;
