import React from "react";

//shadcn imports
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

//image imports
import icon from "../../assets/file-document-svgrepo-com.svg";

export default function CreateTrainingSessionForm() {
  const [date, setDate] = React.useState<Date>();

  /*
  const handleSelect = (date: Date | undefined) => {
    console.log("Selected date:", date);
    
  };
  */
  return (
    <div>
      <form>
        <div className="grid grid-rows-* gap-y-6">
          {/*Form Title*/}
          <div>
            <h2 className="text-2xl font-semibold">Create New Event</h2>
            <h2>Complete the form and submit</h2>
          </div>

          {/*Event Title*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="title">
              Title
            </Label>
            <Input
              type="text"
              id="title"
              placeholder="Name the event"
              required
            />
          </div>

          {/*Type of Event*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="type">
              Type of Event
            </Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select type</SelectLabel>
                  <SelectItem value="training-session">
                    Training Session
                  </SelectItem>
                  <SelectItem value="fundraiser">Fundraiser</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/*Date Picker*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="date">
              Pick a Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/*Start and End Time*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="time">
              Time
            </Label>
            <div className="flex gap-2">
              <Input id="start-time" type="time" />
              <Input id="end-time" type="time" />
            </div>
          </div>

          {/*Location*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="location">
              Location
            </Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select location</SelectLabel>
                  <SelectItem value="st-denis">
                    Centre de loisirs St-Denis
                  </SelectItem>
                  <SelectItem value="maisonnneuve">
                    Collège de Maisonneuve
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/*Recurring*/}
          <div className="flex items-center space-x-2">
            <Checkbox id="recurring" />
            <Label
              htmlFor="recurring"
              className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Recurring event
            </Label>
          </div>

          {/*Public or Private*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="visibility">
              Visibility
            </Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Select who can see</SelectLabel>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Members only</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/*Description*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="description">
              Description
            </Label>
            <Textarea placeholder="Add description of the event..." />
          </div>

          {/*Add File*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="attachment">
              Add Attachment
            </Label>
            <div className="flex gap-2">
              <img src={icon} className="content-center"></img>
              <Input id="attachment" type="file" />
            </div>
          </div>

          {/*Capacity*/}
          <div className="grid grid-row-2 gap-1">
            <Label className="font-semibold" htmlFor="capacity">
              Attendance Capacity
            </Label>
            <Input
              type="number"
              min="0"
              placeholder="Write the max number of attendees"
            ></Input>
          </div>

          {/*Invitation and Player List*/}
          <div className="flex gap-1 items-center space-x-2">
            <Checkbox className="self-start" />
            <div className="flex flex-col">
              <Label
                htmlFor="attendance"
                className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Notify all players
              </Label>
              <a href="../" className="underline text-neutral-400">
                Customize attendance list
              </a>
            </div>
          </div>
          <div>
            <Button className="w-full font-semibold">Create New Event</Button>
          </div>
          <div className="text-center self-center">
            <a href="../" className="underline text-neutral-400">
              Cancel
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
