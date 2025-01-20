"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {RenameGroupDialogProps} from "@/types/dmchannels.ts";

export function RenameGroupDialog(
    {
      isOpen,
      onClose,
      channelName
    }: RenameGroupDialogProps) {
  const [currentName, setCurrentName] = useState(channelName);
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
      <DialogContent className="sm:max-w-[425px] bg-white text-primaryColour font-font rounded-lg"
      style={{maxWidth: "90vw"}}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-font font-bold">
            Rename Group
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex justify-between items-center gap-2">
            <Label
              htmlFor="current-name"
              className="w-2/5 text-left font-font font-medium whitespace-nowrap"
            >
              Current Name
            </Label>
            <Input
              id="current-name"
              value={currentName}
              className="w-3/5 font-font bg-textPlaceholderColour text-primaryColour"
              disabled
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <Label
              htmlFor="new-name"
              className="w-2/5 text-left font-font font-medium whitespace-nonwrap"
            >
              New Name
            </Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-3/5 border-primaryColour focus:ring-secondaryColour focus:border-secondaryColour"
              maxLength={50}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-primaryColour bg-white hover:bg-textPlaceholderColour"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!newName.trim()}
            className="bg-secondaryColour text-primaryColour py-2 px-4 mx-force-none
            rounded font-bold hover:bg-textPlaceholderColour disabled:bg-fadedPrimaryColour disabled:text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
