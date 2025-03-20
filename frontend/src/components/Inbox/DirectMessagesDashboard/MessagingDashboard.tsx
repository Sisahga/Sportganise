import { useEffect, useState } from "react";
import GroupSection from "@/components/Inbox/GroupMessages/GroupSection";
import MessagesSection from "../SimpleMessages/MessagesSection.tsx";
import { Channel } from "@/types/dmchannels.ts";
import directMessagingApi from "@/services/api/directMessagingApi.ts";
import "./MessagingDashboard.css";
import log from "loglevel";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { getAccountIdCookie, getCookies } from "@/services/cookiesService.ts";
import {
  GroupSkeleton,
  MessageSkeleton,
} from "@/components/Inbox/DirectMessagesDashboard/MessagingDashboardSkeletons.tsx";

function DirectMessagesDashboard() {
  const cookies = getCookies();
  const accountId = getAccountIdCookie(cookies);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unreadChannelCount, setUnreadChannelCount] = useState<number>(0);
  const navigate = useNavigate();

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
      response.forEach((channel) => {
        if (!channel.read) {
          setUnreadChannelCount((prev) => prev + 1);
        }
      });
      setLoading(false);
    } catch (err) {
      log.error("Error fetching chat messages:", err);
      setError("Failed to load messages.");
    }
  };

  useEffect(() => {
    fetchChannels().then((r) => r);
  }, []);

  useEffect(() => {
    log.debug("Simple Channels: ", simpleChannels);
  }, [simpleChannels]);
  useEffect(() => {
    log.debug("Group Channels: ", groupChannels);
  }, [groupChannels]);

  if (loading) {
    return (
      <div className="flex mx-auto flex-col sm:w-3/4 lg:w-3/5 gap-6 relative overflow-y-scroll pt-10 min-h-screen">
        <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
          <div className="space-y-1">
            <h2 className="font-semibold text-3xl text-secondaryColour text-center">
              Messages
            </h2>
            <p className="text-fadedPrimaryColour text-center mx-auto h-5 pt-2 rounded-md w-32 animate-skeleton"></p>
          </div>
        </div>
        <GroupSkeleton />
        <MessageSkeleton />
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
    <div className="flex mx-auto flex-col sm:w-3/4 lg:w-3/5 gap-6 relative overflow-y-scroll pt-10 min-h-screen">
      <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
        <div className="space-y-1">
          <h2 className="font-semibold text-3xl text-secondaryColour text-center">
            Messages
          </h2>
          <p className="text-fadedPrimaryColour text-center">
            You have {unreadChannelCount} unread messages.
          </p>
        </div>
        <div className="absolute right-5 top-0">
          {/* Add New Message Button */}
          <button
            className="p-2 rounded-lg bg-secondaryColour shadow-md"
            aria-label="Add New Message"
            onClick={() => {
              navigate("/pages/CreateDmChannelPage");
            }}
          >
            <Plus className="text-white" strokeWidth={4} size={20} />
          </button>
        </div>
      </div>
      <GroupSection groupChannels={groupChannels} />
      <MessagesSection messageChannels={simpleChannels} />
    </div>
  );
}

export default DirectMessagesDashboard;
