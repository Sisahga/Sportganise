"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/Button";
import { UserPlus, UserMinus } from "lucide-react";

interface Member {
  id: string;
  name: string;
}

interface MembersSettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MembersSettingsDialog({
  isOpen,
  onClose,
}: MembersSettingsDialogProps) {
  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
    { id: "3", name: "Bob Johnson" },
  ]);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleAction = (member: Member) => {
    setSelectedMember(member);
    setAlertDialogOpen(true);
  };

  const confirmAction = () => {
    if (selectedMember) {
      setMembers(members.filter((m) => m.id !== selectedMember.id));
      setAlertDialogOpen(false);
      setSelectedMember(null);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px] bg-white text-primaryColour font-font">
          <DialogHeader>
            <DialogTitle className="text-2xl text-primaryColour font-font font-bold">
              Members Settings
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between py-2 font-font text-primaryColour"
              >
                <span>{member.name}</span>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction(member)}
                  >
                    <UserMinus className="h-4 w-4" />
                    <span className="sr-only">Remove {member.name}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            className="mt-4 bg-secondaryColour text-primaryColour font-bold py-2 px-4 rounded hover:bg-textPlaceholderColour
"
          >
            Add Members
            <UserPlus className="h-4 w-4 mr-2" />
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent className="bg-white text-primaryColour font-font">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will remove {selectedMember?.name} from the group.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-primaryColour text-primaryColour bg-white hover:bg-textPlaceholderColour">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
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
