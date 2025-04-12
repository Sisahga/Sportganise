import programParticipantApi from "@/services/api/programParticipantApi.ts";
import { useState } from "react";

const useMarkUnabsent = () => {
  const [markingUnabsent, setMarkingUnabsent] = useState(false);
  const markUnabsent = async (recurrenceId: number, accountId: number) => {
    setMarkingUnabsent(true);
    return await programParticipantApi.markUnabsent(recurrenceId, accountId);
  };

  return {
    markUnabsent,
    markingUnabsent,
  };
};
export default useMarkUnabsent;
