// React
import { useEffect } from "react";
import { useNavigate } from "react-router";
// Components
import { columns } from "./TableColumns.tsx";
import TrainingPlanTable from "./TrainingPlanTable";
import { AddTrainingPlanButton } from "@/components/TrainingPlan";
// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Icons
import { Loader2 } from "lucide-react";
// Hooks
import useTrainingPlans from "@/hooks/useTrainingPlans";
// Services
import { getCookies, getAccountIdCookie } from "@/services/cookiesService";
// Logs
import log from "loglevel";

export default function TrainingPlanContent() {
  log.info("Rendered TrainingPlanContent component");
  const navigate = useNavigate();

  // Get AccountId From Cookie
  const cookies = getCookies();
  const accountId = cookies ? getAccountIdCookie(cookies) : null;
  useEffect(() => {
    if (!accountId) {
      log.debug("TrainingPlanContent -> No accountId found");
    }
    log.info(`TrainingPlanContent -> accountId is ${accountId}`);
  }, [accountId]);

  // Reroute User By Account Type
  useEffect(() => {
    if (!cookies || cookies.type === "GENERAL" || cookies.type === "PLAYER") {
      navigate("/");
    }
    log.debug(`TrainingPlanContent -> accountType is ${cookies?.type}`);
  }, [navigate, cookies]);

  // Fetch Training Plans Created By and Shared With Current User
  const { myTrainingPlans, sharedTrainingPlans, loading, error } =
    useTrainingPlans(accountId); // myTrainingPlans, sharedTrainingPlans = [] can be passed to <TrainingPlanTable />
  log.info("TrainingPlanContent -> myTrainingPlans are", myTrainingPlans);
  log.info(
    "TrainingPlanContent -> sharedTrainingPlans are",
    sharedTrainingPlans,
  );

  // Block Page for Null AccountId
  if (!accountId) {
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
