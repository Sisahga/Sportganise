"use client";

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { MemberStatus, DeleteRequestProps } from "@/types/deleteRequest";
import log from "loglevel";

// Using mock data for now until it's configured with BE
const mockRequestedBy = "Jane Doe";
const mockMembers: MemberStatus[] = [
  { name: "John", status: "approved" },
  { name: "Mary", status: "approved" },
  { name: "Joe", status: "approved" },
  { name: "Jeff", status: "pending" },
];

// Added Partial because using mock data; you'll probably remove it
export default function DeleteRequest({
  requestedBy = mockRequestedBy,
  members: initialMembers = mockMembers,
}: Partial<DeleteRequestProps>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [members, setMembers] = React.useState(initialMembers);
  const [showMessage, setShowMessage] = React.useState(false);

  log.info("Initial members:", initialMembers);

  const handleApprove = (memberName: string) => {
    log.info(`Approving member: ${memberName}`);
    const updatedMembers = members.map(
      (member): MemberStatus =>
        member.name === memberName ? { ...member, status: "approved" } : member,
    );

    setMembers(updatedMembers);
    log.info("Updated members after approval:", updatedMembers);
    setShowMessage(true);
    log.info("Approval message is now visible.");
    setIsOpen(false);
    log.info("Drawer closed.");
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={setIsOpen} direction="top">
        <DrawerTrigger asChild className="flex items-center justify-center">
          <div>
            <Button
              className="flex items-center gap-2"
              aria-label="Delete Request"
            >
              Delete Request
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </DrawerTrigger>
        <DrawerContent className="fixed top-0 left-0 right-0 min-h-64 rounded-b-[10px] translate-y-0">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle className="text-center mt-14">
                Delete Request
              </DrawerTitle>
              <DrawerDescription
                className="text-sm text-muted-foreground text-center"
                data-testid="description" // Added data-testid
              >
                <span>
                  <strong>{requestedBy}</strong> requested to delete the
                  channel.
                </span>
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-2 space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">
                Approval Status:
              </p>
              {members.map((member, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{member.name}</span>
                  {member.status === "approved" ? (
                    <Badge
                      variant="secondary"
                      className="bg-primaryColour text-white rounded-md hover:bg-hover-none"
                    >
                      Approved
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-textPlaceholderColour text-black rounded-md hover:bg-hover-none"
                    >
                      Pending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            <DrawerFooter>
              <div className="flex gap-3 justify-center w-full">
                <Button
                  variant="default"
                  className="flex-1"
                  onClick={() => handleApprove("Jeff")} // For now, approving Jeff to test
                >
                  Approve
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1">
                    Close
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      {showMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 mb-28">
          <Badge variant="secondary" className="px-4 py-2 rounded-md">
            You approved the request!
          </Badge>
        </div>
      )}
    </>
  );
}
