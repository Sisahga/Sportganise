"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Ban, UserX } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import log from "loglevel";
import BackButton from "../ui/back-button";

log.setLevel("info");

interface BlockedUser {
  id: string;
  name: string;
  email: string;
}

export default function BlockedUsersList() {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
    },
  ]);

  const [isUnblockOpen, setIsUnblockOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<BlockedUser | null>(null);

  const handleUnblock = () => {
    if (selectedUser) {
      log.info(`Attempting to unblock user: ${selectedUser.name}`);
      setBlockedUsers(
        blockedUsers.filter((user) => user.id !== selectedUser.id),
      );
      log.info(`User unblocked: ${selectedUser.name}`);
      setIsUnblockOpen(false);
    }
  };

  const handleUnblockClick = (user: BlockedUser) => {
    log.info(`Unblock button clicked for user: ${user.name}`);
    setSelectedUser(user);
    setIsUnblockOpen(true);
  };

  return (
    <div className="md:px-4 flex-1 pb-16">
      <BackButton />

      <Card className="space-y-8 max-w-3xl mx-auto mt-4 border shadow-md mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <UserX className="h-6 w-6" />
            Blocked Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          {blockedUsers.length === 0 ? (
            <div className="text-center py-8 text-fadedPrimaryColour">
              No blocked users
            </div>
          ) : (
            <div className="space-y-4">
              {blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-white shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                    <h3 className="font-medium text-primaryColour">
                      {user.name}
                    </h3>
                    <p className="text-sm text-fadedPrimaryColour pr-1">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleUnblockClick(user)}
                    className="bg-primaryColour hover:bg-primaryColour/70 text-white px-2 py-1 text-xs sm:px-2 sm:py-1 sm:text-sm"
                  >
                    <Ban className="h-4 w-4 mr-2 sm:h-3 sm:w-3 sm:mr-1" />
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isUnblockOpen} onOpenChange={setIsUnblockOpen}>
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to unblock this user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will allow {selectedUser?.name} to interact with you again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white text-primaryColour hover:bg-fadedPrimaryColour hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnblock}
              className="bg-red text-white hover:bg-red/90"
            >
              Unblock User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
