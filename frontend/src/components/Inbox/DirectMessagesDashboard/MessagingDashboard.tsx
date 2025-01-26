import { useEffect, useState } from "react";
import GroupSection from "@/components/Inbox/GroupMessages/GroupSection";
import MessagesSection from "../SimpleMessages/MessagesSection.tsx";
import { Channel } from "@/types/dmchannels.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";
import "./MessagingDashboard.css";
import log from "loglevel";

function DirectMessagesDashboard() {
  const accountId = 2;
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const simpleChannels = channels.filter(
    (channel) => channel.channelType === "SIMPLE",
  );
  const groupChannels = channels.filter(
    (channel) => channel.channelType === "GROUP",
  );

  const fetchChannels = async () => {
    try {
      const response = await directMessagingApi.getChannels(accountId);
      setChannels(response);
    } catch (err) {
      log.error("Error fetching chat messages:", err);
      setError("Failed to load messages.");
    }
  };

  useEffect(() => {
    fetchChannels().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    log.info("Simple Channels: ", simpleChannels);
  }, [simpleChannels]);
  useEffect(() => {
    log.info("Group Channels: ", groupChannels);
  }, [groupChannels]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
        <div className="space-y-1">
          <h2 className="font-semibold text-3xl text-secondaryColour text-center">
            Messages
          </h2>
          <p className="text-fadedPrimaryColour text-center">
            You have 0 unread messages
          </p>
        </div>
      </div>
      <GroupSection groupChannels={groupChannels} />
      <MessagesSection messageChannels={simpleChannels} />
    </div>
  );
}

export default DirectMessagesDashboard;
