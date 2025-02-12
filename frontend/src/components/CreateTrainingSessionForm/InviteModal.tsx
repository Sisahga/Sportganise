import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // import if available
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: string; // e.g., "Coach", "Player", etc.
}

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
  members: Member[];
  selectedMembers: string[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function InviteModal({
  open,
  onClose,
  members,
  selectedMembers,
  setSelectedMembers,
}: InviteModalProps) {
  const [search, setSearch] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(members);

  useEffect(() => {
    setFilteredMembers(
      members.filter(
        (member) =>
          member.name.toLowerCase().includes(search.toLowerCase()) ||
          member.email.toLowerCase().includes(search.toLowerCase()) ||
          member.role.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, members]);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="max-w-lg"
        aria-describedby="invite-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>Select Members</DialogTitle>
          <DialogDescription id="invite-dialog-description">
            Invite members to training sessions.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
          />
        </div>
        <div className="max-h-60 overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="p-2">Invite</th>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-100">
                  <td className="p-2">
                    <Checkbox
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                  </td>
                  <td className="p-2">{member.name}</td>
                  <td className="p-2">{member.email}</td>
                  <td className="p-2">{member.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
