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
import {
  RenameChannelDto,
  RenameGroupDialogProps,
} from "@/types/dmchannels.ts";
import useRenameChannel from "@/hooks/useRenameChannel.ts";
import log from "loglevel";
import useSendMessage from "@/hooks/useSendMessage.ts";
import { SendMessageComponent } from "@/types/messaging.ts";

export function RenameGroupDialog({
  isOpen,
  onClose,
  channelName,
  channelId,
  setCurrentChannelName,
  currentUserId,
  webSocketRef,
}: RenameGroupDialogProps) {
  const [currentName, setCurrentName] = useState(channelName);
  const [newName, setNewName] = useState("");

  const { renameChannel } = useRenameChannel();
  const { sendDirectMessage } = useSendMessage();

  const handleSave = async () => {
    if (newName.trim()) {
      const renameChannelDto: RenameChannelDto = {
        channelId: channelId,
        channelName: newName,
      };
      const response = await renameChannel(renameChannelDto);
      if (response?.status === 200) {
        log.info("Channel renamed successfully");
        const updaterMessageView = "You changed the group name to " + newName;
        // TODO: Change to actual first name from cookies or smt
        const otherMessageView = "Walter group name was changed to " + newName;
        const messagePayload: SendMessageComponent = {
          senderId: currentUserId,
          channelId: channelId,
          messageContent: `UPDATE*${currentUserId}*${updaterMessageView}*${otherMessageView}`,
          attachments: [],
          sentAt: new Date().toISOString(),
          type: "UPDATE",
          senderFirstName: "Walter", // TODO: Replace with actual first name from cookies
          avatarUrl:
            "https://sportganise-bucket.s3.us-east-2.amazonaws.com/walter_white_avatar.jpg",
        };
        sendDirectMessage(messagePayload, webSocketRef);
        setCurrentName(newName);
        setNewName("");
        setCurrentChannelName(newName);
        onClose();
      } else if (response?.status === 404) {
        log.error("Channel not found");
      } else {
        log.error("Error renaming channel");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] bg-white text-primaryColour font-font rounded-lg"
        style={{ maxWidth: "90vw" }}
      >
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
