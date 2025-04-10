// React
import { useEffect } from "react";
import { useNavigate } from "react-router";
// Components
import { columns } from "./Table/TableColumns.tsx";
import TrainingPlanTable from "./Table/TrainingPlanTable.tsx";
import { AddTrainingPlanButton } from "@/components/TrainingPlan";
// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Icons
import { Loader2, LoaderCircle } from "lucide-react";
// Hooks
import useTrainingPlans from "@/hooks/useTrainingPlans";
// Logs
import log from "loglevel";
import useGetCookies from "@/hooks/useGetCookies.ts";

export default function TrainingPlanContent() {
  log.info("Rendered TrainingPlanContent component");
  const navigate = useNavigate();

  // Get AccountId From Cookie
  const { userId, cookies, preLoading } = useGetCookies();

  // Fetch Training Plans Created By and Shared With Current User
  const {
    fetchTrainingPlans,
    myTrainingPlans,
    sharedTrainingPlans,
    loading,
    error,
  } = useTrainingPlans(); // myTrainingPlans, sharedTrainingPlans = [] can be passed to <TrainingPlanTable />

  // Reroute User By Account Type
  useEffect(() => {
    if (!preLoading) {
      if (!cookies || cookies.type === "GENERAL" || cookies.type === "PLAYER") {
        navigate("/");
      } else {
        fetchTrainingPlans(userId).then((_) => _);
        log.debug(`TrainingPlanContent -> accountType is ${cookies?.type}`);
      }
    }
  }, [navigate, preLoading, cookies, fetchTrainingPlans, userId]);

  useEffect(() => {
    log.debug("TrainingPlanContent -> myTrainingPlans are", myTrainingPlans);
    log.debug(
      "TrainingPlanContent -> sharedTrainingPlans are",
      sharedTrainingPlans,
    );
  }, [myTrainingPlans, sharedTrainingPlans]);

  if (preLoading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

  // Block Page for Null AccountId
  if (!userId || userId === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="font-semibold text-center text-red text-xl md:text-2xl lg:text-3xl mb-3">
          An error occurred!
        </div>
        <div className="text-center">Could not find your Account!</div>
        <div className="text-center">Please log out and log back in ✔</div>
      </div>
    );
  }

  return (
    <div className="mt-5 mb-32 ">
      <p className="text-3xl font-semibold text-center text-secondaryColour">
        Training Plan
      </p>
      <div>
        <Tabs defaultValue="mine">
          <div className="flex justify-center">
            <TabsList className="my-5">
              <TabsTrigger value="mine">My Plans</TabsTrigger>
              <TabsTrigger value="shared">Shared With Me</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="mine">
            {loading ? (
              <Loader2
                className="animate-spin m-5 justify-self-center"
                color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
                size={30}
              />
            ) : error ? (
              <p className="m-5 text-red text-center">
                Error! Could not get training plans.
              </p>
            ) : (
              <TrainingPlanTable columns={columns} data={myTrainingPlans} />
            )}
          </TabsContent>
          <TabsContent value="shared">
            {loading ? (
              <Loader2
                className="animate-spin m-5 justify-self-center"
                color="rgb(107 114 128 / var(--tw-text-opacity, 1))"
              />
            ) : error ? (
              <p className="m-5 text-red text-center">
                Error! Could not get training plans.
              </p>
            ) : (
              <TrainingPlanTable columns={columns} data={sharedTrainingPlans} />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <AddTrainingPlanButton />
    </div>
  );
}
