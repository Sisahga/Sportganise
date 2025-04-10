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
import { Member } from "./types";

interface SelectMembersModalProps {
  open: boolean;
  onClose: () => void;
  members: Member[];
  selectedMembers: number[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<number[]>>;
  description?: string;
  title?: string;
}

export default function SelectMembersModal({
  open,
  onClose,
  members,
  selectedMembers,
  setSelectedMembers,
  description,
  title = "Select Members",
}: SelectMembersModalProps) {
  const [search, setSearch] = useState("");
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(members);

  useEffect(() => {
    setFilteredMembers(
      members.filter(
        (member) =>
          member.name.toLowerCase().includes(search.toLowerCase()) ||
          member.role.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, members]);

  const toggleMember = (id: number) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    console.log("Current selected members:", selectedMembers);
  }, [selectedMembers]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="max-w-lg"
        aria-describedby="select-dialog-description"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription id="select-dialog-description">
              {description}
            </DialogDescription>
          ) : null}
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
                <th className="p-2">Selected</th>
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-100">
                  <td className="p-2">
                    <Checkbox
                      aria-label={`Invite ${member.name}`}
                      checked={selectedMembers.includes(member.id)}
                      onCheckedChange={() => toggleMember(member.id)}
                    />
                  </td>
                  <td className="p-2">{member.name}</td>
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
