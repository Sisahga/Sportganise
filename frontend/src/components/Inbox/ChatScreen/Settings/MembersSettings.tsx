import {useEffect, useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog.tsx";
import {Button} from "@/components/ui/Button.tsx";
import {UserMinus, UserPlus} from "lucide-react";
import {ChannelMember, GroupChannelMemberRole, MembersSettingsDialogProps,} from "@/types/dmchannels.ts";

export function MembersSettingsDialog({
  isOpen,
  onClose,
  channelMembers,
}: MembersSettingsDialogProps) {
  const [members, setMembers] = useState<ChannelMember[]>(channelMembers);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<ChannelMember | null>(
    null,
  );
  console.log("Members from member settings dialog: ", members);

  useEffect(() => {
    setMembers(channelMembers);
  }, [channelMembers]);

  const handleRemove = (member: ChannelMember) => {
    setSelectedMember(member);
    setAlertDialogOpen(true);
  };

  const handleRemoveConfirm = () => {
    if (selectedMember) {
      setMembers(
        members.filter((m) => m.accountId !== selectedMember.accountId),
      );
      // Call API to remove member from group

      setAlertDialogOpen(false);
      setSelectedMember(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="sm:max-w-[425px] bg-white text-primaryColour font-font rounded-lg"
          style={{ maxWidth: "90vw" }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl text-primaryColour font-font font-bold">
              Members Settings
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {members.map((member) => (
              <div
                key={member.accountId}
                className="flex items-center justify-between py-2 font-font text-primaryColour gap-4"
              >
                <div className="flex w-full justify-between items-center">
                  <span>{member.firstName} {member.lastName}</span>
                  <span className="font-light text-sm faded-primary-colour italic">
                    {member.role == GroupChannelMemberRole.ADMIN && "ADMIN"}
                  </span>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(member)}
                  >
                    <UserMinus className="h-4 w-4" />
                    <span className="sr-only">
                      Remove {member.firstName} {member.lastName}
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            className="mt-4 bg-secondaryColour text-primaryColour font-bold
            py-2 px-4 rounded hover:bg-textPlaceholderColour"
          >
            Add Members
            <UserPlus className="h-4 w-4 mr-2" />
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent
          className="bg-white text-primaryColour font-font rounded-lg"
          style={{ maxWidth: "85vw" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {selectedMember?.firstName}{" "}
              {selectedMember?.lastName} from the group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="text-primaryColour
            bg-white hover:bg-textPlaceholderColour"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              className="bg-secondaryColour text-primaryColour font-bold hover:bg-textPlaceholderColour"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
