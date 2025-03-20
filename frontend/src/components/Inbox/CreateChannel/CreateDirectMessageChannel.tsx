import { Button } from "@/components/ui/Button.tsx";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import AddMembers from "../AddMembers.tsx";
import { useState } from "react";
import { AccountDetailsDirectMessaging } from "@/types/account.ts";
import useCreateChannel from "@/hooks/useCreateChannel.ts";
import { CreateChannelDto } from "@/types/dmchannels.ts";
import log from "loglevel";
import { getAccountIdCookie, getCookies } from "@/services/cookiesService.ts";
import { motion } from "framer-motion";

export default function CreateDirectMessagingChannel() {
  const cookies = getCookies();
  const userId = getAccountIdCookie(cookies);
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState<
    AccountDetailsDirectMessaging[]
  >([]);
  const { createChannel } = useCreateChannel();

  const currentUser = {
    accountId: userId,
    firstName: cookies.firstName,
    lastName: cookies.lastName,
    pictureUrl: cookies.pictureUrl || "",
    type: cookies.type!,
    phone: cookies.phone || "",
    selected: true,
  };

  const handleCreateChannel = async () => {
    const updatedUsersWithCurrent = [...selectedUsers, currentUser];
    const selectedUserIds = updatedUsersWithCurrent.map(
      (user) => user.accountId,
    );
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
    setSelectedUsers(updatedUsersWithCurrent);
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
    <div
      className="flex flex-col bg-transparent"
      style={{ height: "calc(-192px + 100vh)" }}
    >
      {/* header for the messages page, different from main layout */}
      <header
        className="flex items-center justify-between p-4 bg-transparent shadow gap-6"
        style={{ borderRadius: "0 0 1rem 1rem" }}
      >
        {/* Back Button */}
        <Button
          className="rounded-xl font-semibold"
          variant="outline"
          onClick={() => {
            navigate(-1);
          }}
          aria-label="back"
        >
          <ChevronLeft />
          <p className="sm:block hidden">Back</p>
        </Button>
        <h1 className="text-xl font-bold flex-grow text-gray-800">
          Create Channel
        </h1>
      </header>
      {/* user can search for any players to send his first message */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 md:px-8 relative">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          viewport={{ once: true }}
        >
          <div className="max-w-md mx-auto space-y-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center leading-tight px-4 animate-textPulse">
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
        </motion.div>
      </div>
    </div>
  );
}
