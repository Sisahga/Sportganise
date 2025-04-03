import { useEffect, useMemo } from "react";
import GroupSection from "@/components/Inbox/GroupMessages/GroupSection";
import MessagesSection from "../SimpleMessages/MessagesSection.tsx";
import "./MessagingDashboard.css";
import log from "loglevel";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";
import {
  GroupSkeleton,
  MessageSkeleton,
} from "@/components/Inbox/DirectMessagesDashboard/MessagingDashboardSkeletons.tsx";
import useGetCookies from "@/hooks/useGetCookies.ts";
import useGetChannels from "@/hooks/useGetChannels.ts";

function DirectMessagesDashboard() {
  const navigate = useNavigate();
  const { userId, preLoading } = useGetCookies();
  const { channels, error, loading, unreadChannelCount, fetchChannels } =
    useGetChannels();

  const simpleChannels = useMemo(
    () => channels.filter((channel) => channel.channelType === "SIMPLE"),
    [channels],
  );
  const groupChannels = useMemo(
    () => channels.filter((channel) => channel.channelType === "GROUP"),
    [channels],
  );

  useEffect(() => {
    if (!preLoading) {
      fetchChannels(userId).then((_) => _);
    }
  }, [userId, preLoading]);

  useEffect(() => {
    if (!preLoading && channels) {
      log.debug("Simple Channels: ", simpleChannels);
    }
  }, [simpleChannels, preLoading]);
  useEffect(() => {
    if (!preLoading && channels) {
      log.debug("Group Channels: ", groupChannels);
    }
  }, [groupChannels, preLoading]);

  if (preLoading || loading) {
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
