import { Button } from "@/components/ui/Button.tsx";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AddMembers from "../AddMembers.tsx";
import { useState } from "react";
import { AccountDetailsDirectMessaging } from "@/types/account.ts";
import useCreateChannel from "@/hooks/useCreateChannel.ts";
import { CreateChannelDto } from "@/types/dmchannels.ts";
import log from "loglevel";

export default function CreateDirectMessagingChannel() {
  const userId = 2; // TODO: Replace with actual user ID from cookies
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState<
    AccountDetailsDirectMessaging[]
  >([]);
  const { createChannel } = useCreateChannel();

  const currentUser = {
    accountId: 2,
    firstName: "Walter",
    lastName: "White",
    pictureUrl:
      "https://sportganise-bucket.s3.us-east-2.amazonaws.com/walter_white_avatar.jpg",
    type: "COACH",
    phone: "333-333-3333",
    selected: true,
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
    };
    log.info("New Channel Details:", newChannelDetails);
    const channelResponse = await createChannel(newChannelDetails, userId);
    log.info("Channel Response:", channelResponse);
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
      log.error("Error creating channel:", channelResponse);
    }
  };

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
            style={{ width: "1.25rem", height: "1.25rem" }}
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
          <AddMembers
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            submitButtonLabel={"Create Channel"}
            createFunction={handleCreateChannel}
            currentUserId={userId}
            excludedMembers={null}
          />
        </div>
      </div>
    </div>
  );
}
