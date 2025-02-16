import directMessagingApi from "@/services/api/directMessagingApi.ts";

function useUploadAttachments() {
  const uploadAttachments = async (formData: FormData) => {
    return await directMessagingApi.uploadAttachments(formData);
  };
  return {
    uploadAttachments,
  };
}
export default useUploadAttachments;
