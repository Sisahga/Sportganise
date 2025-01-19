"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RenameGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RenameGroupDialog({ isOpen, onClose }: RenameGroupDialogProps) {
  const [currentName, setCurrentName] = useState("Current Group Name");
  const [newName, setNewName] = useState("");

  const handleSave = () => {
    if (newName.trim()) {
      setCurrentName(newName);
      setNewName("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-primaryColour font-font">
        <DialogHeader>
          <DialogTitle className="text-2xl font-font font-bold">
            Rename Group
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="current-name"
              className="w-1/4 text-right font-font font-medium whitespace-nowrap"
            >
              Current Name
            </Label>
            <Input
              id="current-name"
              value={currentName}
              className="col-span-3 font-font bg-textPlaceholderColour text-primaryColour"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="new-name"
              className="text-right font-font font-medium whitespace-nonwrap"
            >
              New Name
            </Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="col-span-3 border-primaryColour focus:ring-secondaryColour focus:border-secondaryColour"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-primaryColour text-primaryColour bg-white hover:bg-textPlaceholderColour"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!newName.trim()}
            className="bg-secondaryColour text-primaryColour py-2 px-4 rounded font-bold hover:bg-textPlaceholderColour disabled:bg-fadedPrimaryColour disabled:text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
