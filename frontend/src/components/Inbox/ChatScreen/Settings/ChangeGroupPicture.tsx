import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ImageIcon, Loader } from "lucide-react";
import { ChangePictureDialogProps } from "@/types/dmchannels.ts";
import defaultGroupAvatar from "@/assets/defaultGroupAvatar.png";
import directMessagingApi from "@/services/api/directMessagingApi.ts";
import log from "loglevel";
import useSendMessage from "@/hooks/useSendMessage.ts";
import { SendMessageComponent } from "@/types/messaging.ts";
import {
  MAX_SINGLE_FILE_SIZE,
  MAX_SINGLE_FILE_SIZE_TEXT,
} from "@/constants/file.constants.ts";
import { useToast } from "@/hooks/use-toast.ts";
import { getCookies } from "@/services/cookiesService.ts";

export function ChangePictureDialog({
  isOpen,
  onClose,
  currentChannelId,
  currentChannelPictureUrl,
  setCurrentChannelPictureUrl,
  webSocketRef,
  currentUserId,
}: ChangePictureDialogProps) {
  const cookies = getCookies();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [popupChannelPicture, setPopupChannelPicture] = useState<
    string | undefined
  >(currentChannelPictureUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { sendDirectMessage } = useSendMessage();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setPopupChannelPicture(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSave = async () => {
    if (selectedFile) {
      if (selectedFile.size > MAX_SINGLE_FILE_SIZE) {
        log.error("File size exceeds the limit.");
        toast({
          title: "File size exceeds the limit",
          description: `Please upload a file that is less than ${MAX_SINGLE_FILE_SIZE_TEXT}.`,
          variant: "destructive",
        });
        return;
      }
      const formData = new FormData();
      formData.append("channelId", currentChannelId.toString());
      formData.append("image", selectedFile);
      formData.append("accountId", currentUserId.toString());

      setUploading(true);
      document.body.classList.add("pointer-events-none");
      const response = await directMessagingApi.updateChannelPicture(formData);
      if (response.statusCode === 200) {
        log.info("Channel picture updated successfully.");
        setCurrentChannelPictureUrl(response.data?.channelImageUrl || "");
        const updaterMessageView = "You changed the group picture";
        const otherMessageView = `${cookies.firstName} changed the group picture`;

        const messagePayload: SendMessageComponent = {
          senderId: currentUserId,
          channelId: currentChannelId,
          messageContent: `UPDATE*${currentUserId}*${updaterMessageView}*${otherMessageView}`,
          attachments: [],
          sentAt: new Date().toISOString(),
          type: "UPDATE",
          senderFirstName: cookies.firstName,
          avatarUrl: cookies.pictureUrl,
        };
        sendDirectMessage(messagePayload, webSocketRef);

        setPopupChannelPicture(response.data?.channelImageUrl || "");
        document.body.classList.remove("pointer-events-none");
        setUploading(false);
      } else if (response.statusCode === 404) {
        setPopupChannelPicture(currentChannelPictureUrl);
        log.error("Channel not found.");
      } else {
        setPopupChannelPicture(currentChannelPictureUrl);
        log.error("Failed to update channel picture internally.");
      }
      setSelectedFile(null);
      onClose();
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
            Change Group Picture
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="w-full max-w-sm space-y-2 flex flex-col gap-4">
            <div className="w-full">
              <img
                src={popupChannelPicture}
                alt={defaultGroupAvatar}
                className="w-36 h-36 object-cover mx-auto rounded-full"
              />
            </div>
            <div className="relative">
              <Input
                id="picture"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                capture="environment"
              />
              <label
                htmlFor="picture"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <span
                  className="bg-primaryColour text-white px-4 py-2 rounded-md text-sm
                font-semibold hover:bg-primaryColour/80 transition-colors flex items-center gap-2"
                >
                  Browse <ImageIcon size={16} />
                </span>
                <span className="text-sm font-font text-fadedPrimaryColour">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </label>
            </div>
          </div>
          <div className={`${uploading ? "" : "hidden"}`}>
            <Loader className="mx-auto" size={24} />
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
            disabled={!selectedFile}
            className="bg-secondaryColour text-primaryColour font-bold py-2 px-4 rounded mx-force-none
            hover:bg-textPlaceholderColour disabled:bg-fadedPrimaryColour disabled:text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
