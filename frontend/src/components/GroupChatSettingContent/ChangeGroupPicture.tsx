"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ChangePictureDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePictureDialog({
  isOpen,
  onClose,
}: ChangePictureDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSave = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-primaryColour font-font">
        <DialogHeader>
          <DialogTitle className="text-2xl font-font font-bold">
            Change Group Picture
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="w-full max-w-sm space-y-2">
            <Label
              htmlFor="picture"
              className="font-font text-textColour font-medium"
            >
              Upload New Picture
            </Label>
            <div className="relative">
              <Input
                id="picture"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <label
                htmlFor="picture"
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <span
                  className="bg-primaryColour text-white px-4 py-2 rounded-md text-sm
                font-semibold hover:bg-primaryColour/80 transition-colors"
                >
                  Choose File
                </span>
                <span className="text-sm font-font text-fadedPrimaryColour">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </label>
            </div>
          </div>
          {selectedFile && (
            <p className="text-sm font-font text-fadedPrimaryColour">
              Selected file: {selectedFile.name}
            </p>
          )}
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
            disabled={!selectedFile}
            className="bg-secondaryColour text-primaryColour font-bold py-2 px-4 rounded
            hover:bg-textPlaceholderColour disabled:bg-fadedPrimaryColour disabled:text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
