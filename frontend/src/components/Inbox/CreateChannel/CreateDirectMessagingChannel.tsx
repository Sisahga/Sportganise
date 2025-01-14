import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/Button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import {Search, ArrowLeft, Check} from "lucide-react";
import { useState } from "react";
import useAccountDetailsDirectMessaging from "@/hooks/useAccountDetailsDirectMessaging.tsx";
import {AccountDetailsDirectMessaging} from "@/types/account.ts";
import {useNavigate} from "react-router-dom";
import useCreateChannel from "@/hooks/useCreateChannel.tsx";
import {CreateChannelDto} from "@/types/dmchannels.ts";

export default function CreateDirectMessagingChannel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const organizationId = 1; // TODO: Replace with actual organization ID from cookies
  const userId = 2; // TODO: Replace with actual user ID from cookies
  const [selectedUsers, setSelectedUsers] = useState<AccountDetailsDirectMessaging[]>([]);
  const currentUser = {
    accountId: 2,
    firstName: "Walter",
    lastName: "White",
    pictureUrl: "https://sportganise-bucket.s3.us-east-2.amazonaws.com/walter_white_avatar.jpg",
    type: "COACH",
    phone: "333-333-3333",
    selected: true
  }

  // Fetch all users from the backend
  const { users } = useAccountDetailsDirectMessaging(organizationId);

  // Use Create Channel hook
  const { createChannel } = useCreateChannel();

  // Updates user search to be more specific by letter as they type player's name
  const filteredUsers = users.filter((user: AccountDetailsDirectMessaging) => {
    if (searchQuery.length === 0) {
      return false;
    }
    if (user.accountId === userId) {
      return false;
    }
    return user.firstName.toLowerCase().startsWith(searchQuery.toLowerCase())
        || user.lastName.toLowerCase().startsWith(searchQuery.toLowerCase());
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

  const handleCreateChannel = async () => {
    selectedUsers.push(currentUser);
    const selectedUserIds = selectedUsers.map((user) => user.accountId);
    const channelName = ""; // TODO: Add option for user to name the channel if more than 2 members.
    const channelType = selectedUserIds.length > 2 ? "GROUP" : "SIMPLE";
    const newChannelDetails: CreateChannelDto = {
      channelId: null,
      channelName: channelName,
      channelType: channelType,
      memberIds: selectedUserIds,
      createdAt: new Date().toISOString(),
      avatarUrl: null,
    }
    console.log("New Channel Details:", newChannelDetails);
    const channelResponse = await createChannel(newChannelDetails, userId);
    console.log("Channel Response:", channelResponse);
    if (channelResponse?.statusCode === 201) {
      navigate("/pages/DirectMessageChannelPage", {
        state: {
          channelId: channelResponse?.data?.channelId,
          channelName: channelResponse.data?.channelName,
          channelType: channelResponse.data?.channelType,
          channelImageBlob: channelResponse.data?.avatarUrl,
          read: true,
        },
      });
    } else if (channelResponse?.statusCode === 302) {
      navigate("/pages/DirectMessageChannelPage", {
        state: {
          channelId: channelResponse?.data?.channelId,
          channelName: channelResponse.data?.channelName,
          channelType: channelResponse.data?.channelType,
          channelImageBlob: channelResponse.data?.avatarUrl,
          read: false,
        },
      });
    } else {
      console.error("Error creating channel:", channelResponse);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* header for the messages page, different from main layout */}
      <header className="pt-8 flex items-center justify-between px-4 py-3 bg-white shadow gap-6">
        {/* Back Button */}
        <Button
            variant="ghost"
            className="rounded-full bg-white w-10 h-10 flex items-center justify-center"
            onClick={() => navigate(-1)}
        >
          <ArrowLeft
              className="text-gray-800"
              size={24}
              style={{width: "1.25rem", height: "1.25rem"}}
              strokeWidth={3}
          />
        </Button>

        {/* Title */}
        <h1 className="text-xl font-bold flex-grow text-gray-800">Messages</h1>
      </header>
      {/* user can search for any players to send his first message */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 relative">
        <div className="max-w-md mx-auto space-y-6 sm:space-y-8 mt-[-12rem]">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-font text-center leading-tight px-4 animate-textPulse">
            Chat with other players and coaches!
          </h1>
          <div className="relative w-full px-4 sm:px-0">
            {/* search bar for user's to search for players */}
            <Search className="absolute left-7 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500"/>
            <Input
                type="text"
                placeholder="Search for a player"
                className="font-font pl-10 h-10 sm:h-12 w-full bg-white border border-gray-200 rounded-lg text-sm sm:text-base"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setIsSearching(event.target.value.length > 0);
              }}
            />
          </div>
          {/* once user searches for a player, results will start to show */}
          {(isSearching || selectedUsers.length > 0) && (
            <ScrollArea className="flex-1 w-full max-h-[400px] rounded-md border overflow-y-auto">
              <div className="p-4 space-y-4">
                {/* Render selected players at the top */}
                {selectedUsers.map((user) => (
                  <div
                    key={user.accountId}
                    className={`${user.accountId === userId ? "force-hide" : ""}
                      flex items-center justify-between p-2 bg-gray-100 rounded-md`}
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.pictureUrl} alt={user.firstName + " " + user.lastName} />
                        <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium font-font text-sm">
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
                      className=
                          {`
                            ${user.selected ? "bg-white opacity-60" : "bg-placeholder-colour"}
                            w-full flex items-center space-x-4 h-auto p-4 justify-start hover:bg-white
                            ${user.accountId === userId ? "force-hide" : ""}`
                          }
                      onClick={() => toggleUserSelection(user)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.pictureUrl} alt={user.firstName + " " + user.lastName} />
                        <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex justify-between w-full">
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-medium font-font text-sm">
                            {user.firstName + " " + user.lastName}
                          </span>
                          <span className="text-xs font-font font-light primary-colour">
                            {user.type.toUpperCase()}
                          </span>
                        </div>
                        {user.selected &&
                            <div className="flex flex-grow items-center justify-end">
                              <Check className="text-green-800"></Check>
                        </div>
                        }
                      </div>
                    </Button>
                  ))
                ) : (
                  <p className={`${searchQuery === "" ? "hidden" : ""} 
                  text-center font-light font-font primary-colour`}>
                    No players found
                  </p>
                )}
              </div>
            </ScrollArea>
          )}
          {selectedUsers.length > 0 && (
            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-full font-font text-sm text-light font-bold primary-colour
                bg-secondaryColour rounded-lg"
                onClick={handleCreateChannel}
              >
                <b>New Message</b>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
