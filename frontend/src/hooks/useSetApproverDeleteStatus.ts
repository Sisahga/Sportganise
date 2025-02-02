import { SetDeleteApproverStatusDto } from "@/types/deleteRequest.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";

function useSetApproverDeleteStatus() {
  const setApproverDeleteStatus = async (
    setApproverDeleteStatus: SetDeleteApproverStatusDto,
  ) => {
    return await directMessagingApi.setApproverDeleteStatus(
      setApproverDeleteStatus,
    );
  };
  return {
    setApproverDeleteStatus,
  };
}
export default useSetApproverDeleteStatus;
