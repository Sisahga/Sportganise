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
import { getCookies } from "@/services/cookiesService.ts";

export function RenameGroupDialog({
  isOpen,
  onClose,
  channelName,
  channelId,
  setCurrentChannelName,
  currentUserId,
  webSocketRef,
}: RenameGroupDialogProps) {
  const cookies = getCookies();

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
        const updaterMessageView = `You changed the group name to ${newName}`;
        const otherMessageView = `${cookies.firstName} group name was changed to ${newName}`;
        const messagePayload: SendMessageComponent = {
          senderId: currentUserId,
          channelId: channelId,
          messageContent: `UPDATE*${currentUserId}*${updaterMessageView}*${otherMessageView}`,
          attachments: [],
          sentAt: new Date().toISOString(),
          type: "UPDATE",
          senderFirstName: cookies.firstName,
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
        className="sm:max-w-[425px] bg-white text-primaryColour rounded-lg"
        style={{ maxWidth: "90vw" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Rename Group</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex justify-between items-center gap-2">
            <Label
              htmlFor="current-name"
              className="w-2/5 text-left font-medium whitespace-nowrap"
            >
              Current Name
            </Label>
            <Input
              id="current-name"
              value={currentName}
              className="w-3/5 bg-textPlaceholderColour text-primaryColour"
              disabled
            />
          </div>
          <div className="flex justify-between items-center gap-2">
            <Label
              htmlFor="new-name"
              className="w-2/5 text-left font-medium whitespace-nonwrap"
            >
              New Name
            </Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-3/5 border-primaryColour"
              maxLength={50}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            onClick={handleSave}
            disabled={!newName.trim()}
            className="py-2 px-4 mx-force-none
             font-bold disabled:bg-fadedPrimaryColour disabled:text-white"
          >
            Save
          </Button>{" "}
          <Button
            variant="outline"
            onClick={onClose}
            className="text-primaryColour bg-white hover:bg-textPlaceholderColour"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
