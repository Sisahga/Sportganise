import { Check, Search } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { useState } from "react";
import { AccountDetailsDirectMessaging } from "@/types/account.ts";
import useAccountDetailsDirectMessaging from "@/hooks/useAccountDetailsDirectMessaging.ts";
import { AddMembersDialogProps } from "@/types/dmchannels.ts";
import log from "loglevel";

export default function AddMembers({
  selectedUsers,
  setSelectedUsers,
  submitButtonLabel,
  createFunction,
  currentUserId,
  excludedMembers,
}: AddMembersDialogProps) {
  const organizationId = 1; // TODO: Get from cookies once org cookies is properly setup.
  // States.
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  log.info(
    `AddMembers component initialized for organization ID: ${organizationId}`,
  );

  // Hook.
  const { users } = useAccountDetailsDirectMessaging(
    organizationId,
    currentUserId,
  );
  log.info(
    `Fetched ${users.length} users for organization ID: ${organizationId}`,
  );

  // Updates user search to be more specific by letter as they type player's name
  const filteredUsers = users.filter((user: AccountDetailsDirectMessaging) => {
    if (searchQuery.length === 0) {
      return false;
    }
    if (user.accountId === currentUserId) {
      return false;
    } else if (excludedMembers) {
      // Adding Channel Member: Don't show members that are already in the channel.
      if (excludedMembers.some((m) => m.accountId === user.accountId)) {
        return false;
      }
    }
    return (
      user.firstName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().startsWith(searchQuery.toLowerCase())
    );
  });

  // User can also select more than one user when creating a msg at first
  const toggleUserSelection = (user: AccountDetailsDirectMessaging) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.some((u) => u.accountId === user.accountId)) {
        user.selected = false;
        return prevSelected.filter((u) => u.accountId !== user.accountId);
      } else {
        user.selected = true;
        return [...prevSelected, user];
      }
    });
  };

  return (
    <>
      <div className="relative w-full px-4 sm:px-0">
        {/* search bar for user's to search for players */}
        <Search className="absolute left-7 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search for a player"
          className="pl-10 h-10 sm:h-12 w-full bg-white border border-gray-200 rounded-lg text-sm sm:text-base"
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
            setIsSearching(event.target.value.length > 0);
          }}
        />
      </div>
      {/* once user searches for a player, results will start to show */}
      {(isSearching || selectedUsers.length > 0) && (
        <ScrollArea className="flex-1 w-full max-h-[40vh] rounded-md border overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Render selected players at the top */}
            {selectedUsers.map((user) => (
              <div
                key={user.accountId}
                className={`${user.accountId === currentUserId ? "force-hide" : ""}
                        flex items-center justify-between p-2 bg-gray-100 rounded-md`}
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.pictureUrl}
                      alt={user.firstName + " " + user.lastName}
                    />
                    <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm">
                    {user.firstName + " " + user.lastName}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleUserSelection(user)}
                >
                  Remove
                </Button>
              </div>
            ))}

            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Button
                  key={user.accountId}
                  variant="ghost"
                  className={`
                              ${user.selected ? "bg-white opacity-60" : "bg-placeholder-colour"}
                              w-full flex items-center space-x-4 h-auto p-4 justify-start hover:bg-white
                              ${user.accountId === currentUserId ? "force-hide" : ""}`}
                  onClick={() => toggleUserSelection(user)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.pictureUrl}
                      alt={user.firstName + " " + user.lastName}
                    />
                    <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium text-sm">
                        {user.firstName + " " + user.lastName}
                      </span>
                      <span className="text-xs font-light primary-colour">
                        {user.type.toUpperCase()}
                      </span>
                    </div>
                    {user.selected && (
                      <div className="flex flex-grow items-center justify-end">
                        <Check className="text-green-800"></Check>
                      </div>
                    )}
                  </div>
                </Button>
              ))
            ) : (
              <p
                className={`${searchQuery === "" ? "hidden" : ""} 
                    text-center font-light primary-colour`}
              >
                No players found
              </p>
            )}
          </div>
        </ScrollArea>
      )}
      {selectedUsers.length > 0 && (
        <div className="mt-4">
          <Button className="w-full text-sm" onClick={createFunction}>
            <p className="font-bold">{submitButtonLabel}</p>
            {/*<PenBox className="primary-colour" strokeWidth={2}></PenBox>*/}
          </Button>
        </div>
      )}
    </>
  );
}
