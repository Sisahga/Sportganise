import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
import log from "loglevel";
import { TrainingSessionsList } from "../ViewTrainingSessions";

log.info("HomeContent component is being rendered.");
export default function HomeContent() {
  const events = [1, 2, 3, 4, 5];
  const cards = [1, 2, 3, 4];

  log.debug("Upcoming events data:", events);
  log.debug("General cards data:", cards);

  return (
    <div className="bg-primaryColour w-screen mt-32 z-40">
      <Toaster />
      <div className="flex-1 max-w-[100vw] bg-white shadow-lg rounded-t-2xl pb-16">
        <div className="min-h-screen">
          <div className="p-4 space-y-6">
            <Card className="border-0 shadow-sm lg:mx-12">
              <CardHeader>
                <CardTitle className="font-font font-semibold text-xl">
                  Welcome to ONIBAD!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-fadedPrimarycolour text-base font-font">
                  A non-profit badminton club for you, where passion meets play!
                </p>
              </CardContent>
            </Card>

            <div className="lg:mx-24">
              <h2 className="text-lg font-font mb-4 text-sec font-semibold">
                Upcoming Events
              </h2>
              <ScrollArea className="w-full overflow-x whitespace-nowrap">
                <div className="flex gap-4 pb-4">
                  {events.map((item) => {
                    log.debug(
                      `Rendering upcoming event card for event ID: ${item}`,
                    );
                    return (
                      <Card
                        key={item}
                        className="w-[250px] shrink-0 border-0 shadow-sm"
                      >
                        <CardContent className="p-4">
                          <div className="aspect-[4/3] rounded-lg bg-textPlaceholderColour" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <div>
                <Button
                  variant="outline"
                  className="flex justify-self-center font-medium font-font px-7 py-3 rounded-md h-auto mt-2"
                  onClick={() => log.info("See all Events button clicked")}
                >
                  See all Events
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <TrainingSessionsList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
