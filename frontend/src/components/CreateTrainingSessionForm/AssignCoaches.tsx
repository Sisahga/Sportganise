import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Member } from "./InviteModal";
import { Checkbox } from "../ui/checkbox";
import { ControllerRenderProps } from "react-hook-form";
import { FormValues } from "@/types/trainingSessionFormValues";
import { Input } from "../ui/input";
import log from "loglevel";

type AssignCoachProps = {
  members: Member[];
  field: ControllerRenderProps<FormValues, "coaches">;
  onSelectCoaches: (selectedCoaches: number[]) => void;
};

const AssignCoach: React.FC<AssignCoachProps> = ({
  members,
  field,
  onSelectCoaches,
}) => {
  const [open, setOpen] = useState(true);
  const [selectedCoaches, setSelectedCoaches] = useState<number[]>(
    field.value || [],
  );
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSelectedCoaches(field.value || []);
  }, [field.value]);

  // Filter the members with the role 'COACH'
  const coaches = members.filter((member) => member.role === "COACH");
  log.debug("All coaches:", coaches);

  // Filter the coaches based on search term.
  const filteredCoaches = coaches.filter((coach) =>
    coach.name.toLowerCase().includes(search.toLowerCase()),
  );
  log.debug("Filtered coaches based on search:", filteredCoaches);

  // Handle coach selection
  const toggleCoachSelection = (id: number) => {
    setSelectedCoaches((prevSelected) => {
      const newSelected = prevSelected.includes(id)
        ? prevSelected.filter((memberId) => memberId !== id)
        : [...prevSelected, id];

      field.onChange(newSelected);
      log.debug(`Coach selection updated: ${newSelected}`);
      return newSelected;
    });
  };

  const handleDone = () => {
    log.info("Coaches(id) in charge of the program:", selectedCoaches);
    onSelectCoaches(selectedCoaches);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-lg"
        aria-describedby="assign-coach-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Select Coaches</DialogTitle>
          <DialogDescription id="assign-coach-dialog-description">
            Select coaches to assign to the program.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search coaches..."
          />
        </div>

        <div className="max-h-60 overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr>
                <td className="p-2 font-bold">Select</td>
                <td className="p-2 font-bold">Name</td>
                <td className="p-2 font-bold">Role</td>
              </tr>
            </thead>
            <tbody>
              {filteredCoaches.map((coach) => (
                <tr key={coach.id} className="hover:bg-gray-100">
                  <td className="p-2">
                    <Checkbox
                      aria-label={`Assign ${coach.name}`}
                      checked={selectedCoaches.includes(coach.id)}
                      onCheckedChange={() => toggleCoachSelection(coach.id)}
                    />
                  </td>
                  <td className="p-2">{coach.name}</td>
                  <td className="p-2">{coach.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <DialogFooter>
          <Button onClick={handleDone}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignCoach;
