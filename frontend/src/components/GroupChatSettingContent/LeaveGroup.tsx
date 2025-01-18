import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { LeaveGroupDialogProps } from "@/types/dmchannels.ts";

export function LeaveGroupDialog({
  isOpen,
  onClose,
  onLeave,
}: LeaveGroupDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white text-primaryColour font-font">
        <DialogHeader>
          <DialogTitle className="text-2xl font-font font-bold">
            Leave Group
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-primaryColour font-font text-center">
            Are you sure you want to leave the group You will no longer have
            access to its content.
          </p>
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
            onClick={onLeave}
            className="bg-errorColour text-white py-2 px-4 rounded font-bold hover:bg-errorHoverColour"
          >
            Leave Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
