import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { LeaveGroupDialogProps } from "@/types/dmchannels.ts";
import log from "loglevel";

log.setLevel("info");
export function LeaveGroupDialog({
  isOpen,
  onClose,
  onLeave,
}: LeaveGroupDialogProps) {
  if (isOpen) {
    log.info("LeaveGroupDialog opened");
  } else {
    log.info("LeaveGroupDialog closed");
  }

  const handleCancel = () => {
    log.info("Leave group action canceled");
    onClose();
  };

  const handleLeave = () => {
    log.info("Leave group action confirmed");
    onLeave();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] bg-white text-primaryColour font-font rounded-lg"
        style={{ maxWidth: "90vw" }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-font font-bold">
            Leave Group
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-primaryColour font-font text-center flex flex-col">
          <p>
            Are you sure you want to leave the group? You will no longer have
            access to its content.
          </p>
        </div>
        <DialogFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="text-primaryColour bg-white hover:bg-textPlaceholderColour"
          >
            Cancel
          </Button>
          <Button
            onClick={handleLeave}
            className="bg-primary-red text-white py-2 px-4 rounded font-bold hover:bg-errorHoverColour mx-force-none"
          >
            Leave Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
