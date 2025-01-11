// MessagingApp.tsx
import { useNavigate } from "react-router-dom";
import { Plus, ArrowLeft } from "lucide-react";
import useGroups from "../apiCalls/useGroups";
import useMessages from "../apiCalls/useMessages";
import GroupSection from "@/components/Inbox/GroupMessages/GroupSection";
import MessagesSection from "./MessagesSection";

function MessagingApp() {
  const navigate = useNavigate();
  const { groups, loading: groupsLoading } = useGroups();
  const { messages, loading: messagesLoading, error } = useMessages();

  // Handle overall loading state
  if (groupsLoading || messagesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  // Handle errors
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header Section */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow">
        {/* Back Button */}
        <button
          className="p-3 rounded-full bg-white hover:bg-gray-300"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="text-gray-800" size={24} />
        </button>

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-800">Messages</h1>

        {/* Add New Message Button */}
        <button className="p-3 rounded-full bg-secondaryColour">
          <Plus className="text-white" size={24} />
        </button>
      </header>

      {/* Group Section */}
      <GroupSection groups={groups} />

      {/* Messages Section */}
      <MessagesSection messages={messages} />
    </div>
  );
}

export default MessagingApp;
