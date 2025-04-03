import { useState, useCallback } from "react";
import ResponseDto from "@/types/response";
import { TrainingPlan, TrainingPlansDto } from "@/types/trainingplans";
import trainingPlanApi from "@/services/api/trainingPlanApi";
import log from "loglevel";

/**
 * Fetches all training plans created by and shared with the current user.
 *
 * @returns myTrainingPlans[], sharedTrainingPlans[], loading, error
 */
function useTrainingPlans() {
  const [myTrainingPlans, setMyTrainingPlans] = useState<TrainingPlan[]>([]); // Training plans created by current user
  const [sharedTrainingPlans, setSharedTrainingPlans] = useState<
    TrainingPlan[]
  >([]); // Training plans shared with current user
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrainingPlans = useCallback(async (accountId: number) => {
    try {
      // Call API
      const response: ResponseDto<TrainingPlansDto> =
        await trainingPlanApi.fetchTrainingPlans(accountId); // statusCode, message, data
      // Check Status Code
      if (response.statusCode !== 200) {
        throw new Error(
          `Could not fetch training plan(s). Status code ${response.statusCode}`,
        );
      }
      // If Response.ok, Initialize States
      setMyTrainingPlans(response.data?.myPlans ?? []); // Return [] if response.data is null | undefined
      setSharedTrainingPlans(response.data?.sharedWithMe ?? []);
      // Log Info
      log.info(
        "useTrainingPlans.fetchTrainingPlans -> Fetched my training plans:",
        myTrainingPlans,
      );
      log.info(
        "useTrainingPlans.fetchTrainingPlans -> Fetched training plans shared with me:",
        sharedTrainingPlans,
      );
    } catch (err) {
      // Handle Error
      setError("Error fetching training plan(s)!");
      console.error(err);
      log.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    fetchTrainingPlans,
    myTrainingPlans,
    sharedTrainingPlans,
    loading,
    error,
  };
}

export default useTrainingPlans;
