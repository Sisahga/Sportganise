import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Toaster } from "@/components/ui/toaster";
<<<<<<< HEAD
import log from "loglevel";

log.info("HomeContent component is being rendered.");
=======
import { TrainingSessionsList } from "../ViewTrainingSessions";
>>>>>>> cf47cd526da197cb9f29af5199012d59d6871929

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
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="font-font font-medium text-xl">
                  Welcome to ONIBAD!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-fadedPrimarycolour text-sm font-font">
                  A non-profit badminton club for you to join.
                </p>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-lg font-medium font-font mb-4">
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
                  variant="link"
                  className="flex justify-self-center text-secondaryColour font-bold font-font px-7 py-3 rounded-xl h-auto bg-textPlaceHolder"
                  onClick={() => log.info("See all Events button clicked")}
                >
                  See all Events
                </Button>
              </div>
            </div>

            <div className="space-y-4">
<<<<<<< HEAD
              {cards.map((item) => {
                log.debug(`Rendering general card for ID: ${item}`);
                return (
                  <Card key={item} className="border-0 shadow-sm">
                    <CardContent className="p-4">
                      <div className="aspect-[3/2] rounded-lg bg-textPlaceholderColour" />
                    </CardContent>
                  </Card>
                );
              })}
=======
              <TrainingSessionsList />
>>>>>>> cf47cd526da197cb9f29af5199012d59d6871929
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
