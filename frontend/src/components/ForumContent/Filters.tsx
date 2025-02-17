import React, { useEffect, useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/Button";

import { ScrollArea } from "@/components/ui/scroll-area";

interface FilterProps {
  occurrenceDate: string | undefined;
  setOccurrenceDate: React.Dispatch<React.SetStateAction<string | undefined>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  sortOption: string;
  setSortOption: React.Dispatch<React.SetStateAction<string>>;
  sortDir: string;
  setSortDir: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  postsPerPage: number;
  setPostsPerPage: React.Dispatch<React.SetStateAction<number>>;
  handleClearFilters: () => void;
  handleApplyFilters: () => void;
}

const Filters: React.FC<FilterProps> = ({
  occurrenceDate,
  setOccurrenceDate,
  type,
  setType,
  sortOption,
  setSortOption,
  setSortDir,
  setSortBy,
  postsPerPage,
  setPostsPerPage,
  handleClearFilters,
  handleApplyFilters,
}) => {
  const [direction, setDirection] = useState<
    "top" | "right" | "bottom" | "left"
  >("bottom");

  useEffect(() => {
    const updateDirection = () => {
      if (window.innerWidth >= 1024) {
        setDirection("left");
      } else if (window.innerWidth >= 768) {
        setDirection("left");
      } else {
        setDirection("bottom");
      }
    };
    updateDirection();
    window.addEventListener("resize", updateDirection);
    return () => {
      window.removeEventListener("resize", updateDirection);
    };
  }, []);

  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-6">
          <Filter className="text-secondaryColour w-3 h-3" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="lg:w-[30vw] md:w-[40vw] ">
        <DrawerHeader className="flex flex-col items-center text-center relative">
          {/* Close button*/}
          {direction === "bottom" && (
            <DrawerClose asChild>
              <Button
                variant="ghost"
                className="text-fadedPrimaryColour rounded-full absolute top-5 left-4 w-2"
              >
                <X></X>
              </Button>
            </DrawerClose>
          )}

          <DrawerTitle>Filter Options</DrawerTitle>
          <DrawerDescription>Customize your filters</DrawerDescription>
        </DrawerHeader>
        <Separator className="border border-secondaryColour" />

        <ScrollArea className="h-[80vh]">
          <div className="px-6 mb-2 mt-8 space-y-4">
            <div className="flex h-10 space-x-1">
              <Select
                value={
                  occurrenceDate
                    ? new Date(occurrenceDate).toLocaleDateString()
                    : " "
                }
                onValueChange={(value) =>
                  setOccurrenceDate(
                    value ? new Date(value).toISOString() : undefined,
                  )
                }
              >
                <SelectTrigger className="h-7 mb-8 flex items-center justify-between px-3 py-1">
                  <SelectValue>
                    {occurrenceDate
                      ? new Date(occurrenceDate).toLocaleDateString()
                      : "Select Date"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <div className="flex justify-center items-center">
                    <Calendar
                      mode="single"
                      numberOfMonths={1}
                      selected={
                        occurrenceDate ? new Date(occurrenceDate) : undefined
                      }
                      onSelect={(date) =>
                        setOccurrenceDate(date ? date.toISOString() : undefined)
                      }
                      defaultMonth={
                        occurrenceDate ? new Date(occurrenceDate) : undefined
                      }
                      className=" px-2 justify-center items-center"
                      classNames={{
                        day_today:
                          "border border-secondaryColour text-accent-foreground",
                        day: cn(
                          buttonVariants({ variant: "outline" }),
                          "h-8 w-8 rounded-full p-0 font-normal aria-selected:opacity-100",
                        ),
                      }}
                    />
                  </div>
                </SelectContent>
              </Select>

              {/* Clear Button for Date picker */}
              <Button
                variant="outline"
                className="h-7 w-2 bg-transparent rounded-md"
                onClick={() => setOccurrenceDate(undefined)}
                aria-label="Clear date"
              >
                <X color="#383C42" />
              </Button>
            </div>

            <Separator></Separator>

            {/* Sort By */}
            <RadioGroup
              value={sortOption}
              onValueChange={(value) => {
                setSortOption(value);
                if (value === "latest") {
                  setSortDir("desc");
                  setSortBy("");
                } else if (value === "oldest") {
                  setSortDir("asc");
                  setSortBy("");
                } else if (value === "Most Likes") {
                  setSortBy("likeCount");
                  setSortDir("");
                }
              }}
            >
              <h3 className="text-sm font-semibold">Sort by</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center w-full">
                  <label htmlFor="latest" className="text-xs">
                    Latest{" "}
                    <span className="text-fadedPrimaryColour">(default)</span>
                  </label>

                  <RadioGroupItem
                    value="latest"
                    id="latest"
                    checked={sortOption === "latest"}
                  />
                </div>
                <div className="flex justify-between items-center w-full">
                  <label htmlFor="oldest" className="text-xs">
                    Oldest
                  </label>
                  <RadioGroupItem
                    value="oldest"
                    id="oldest"
                    checked={sortOption === "oldest"}
                  />
                </div>
                <div className="flex justify-between items-center w-full">
                  <label htmlFor="Most Likes" className="text-xs">
                    Most Likes
                  </label>
                  <RadioGroupItem
                    value="Most Likes"
                    id="Most Likes"
                    checked={sortOption === "Most Likes"}
                  />
                </div>
              </div>
            </RadioGroup>

            <Separator></Separator>

            {/* Type of Event */}
            <RadioGroup value={type} onValueChange={(value) => setType(value)}>
              <h3 className="text-sm font-semibold">Type of event</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center w-full">
                  <label htmlFor="all" className="text-xs">
                    All
                  </label>
                  <RadioGroupItem value="" id="all" checked={type === ""} />
                </div>
                <div className="flex justify-between items-center w-full">
                  <label htmlFor="training" className="text-xs">
                    Training
                  </label>
                  <RadioGroupItem
                    value="TRAINING"
                    id="training"
                    checked={type === "TRAINING"}
                  />
                </div>
                <div className="flex justify-between items-center w-full">
                  <label htmlFor="fundraiser" className="text-xs">
                    Fundraiser
                  </label>
                  <RadioGroupItem
                    value="FUNDRAISER"
                    id="fundraiser"
                    checked={type === "FUNDRAISER"}
                  />
                </div>
                <div className="flex justify-between items-center w-full">
                  <label htmlFor="tournament" className="text-xs">
                    Tournament
                  </label>
                  <RadioGroupItem
                    value="TOURNAMENT"
                    id="tournament"
                    checked={type === "TOURNAMENT"}
                  />
                </div>

                <div className="flex justify-between items-center w-full">
                  <label htmlFor="special" className="text-xs">
                    Special
                  </label>
                  <RadioGroupItem
                    value="SPECIAL"
                    id="special"
                    checked={type === "SPECIAL"}
                  />
                </div>
              </div>
            </RadioGroup>

            <Separator></Separator>

            {/* Show Per Page */}
            <div>
              <h3 className="text-sm font-semibold mb-1">Show per page</h3>
              <Select
                onValueChange={(value) => setPostsPerPage(Number(value))}
                value={postsPerPage.toString()}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">
                    <span>10</span>{" "}
                    <span className="text-fadedPrimaryColour">(default)</span>
                  </SelectItem>
                  <SelectItem value="15">15</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className=" px-12 mt-8 mb-8 flex flex-row justify-between items-center gap-2">
            <Button
              onClick={handleClearFilters}
              variant="default"
              className="w-full shadow-lg"
            >
              Clear all
            </Button>
            <Button
              onClick={handleApplyFilters}
              variant="outline"
              className="w-full shadow-lg text-white bg-secondaryColour"
            >
              Apply filter
            </Button>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default Filters;
