import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft
} from "react-icons/fa";

// Mock data to simulate user and message information
const mockGroups = [
  {
    id: 1,
    name: "Badmintors",
    image: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=B",
  },
  {
    id: 2,
    name: "Group 1",
    image: "https://via.placeholder.com/150/2196F3/FFFFFF?text=G1",
  },
  {
    id: 3,
    name: "Onibaddies",
    image: "https://via.placeholder.com/150/FF5722/FFFFFF?text=O",
  },
];

const mockMessages = [
  {
    id: 1,
    name: "Mark",
    image: "https://via.placeholder.com/150/007BFF/FFFFFF?text=M",
    preview: "Lorem ipsum, dolor...",
    time: "10:51AM",
  },
  {
    id: 2,
    name: "Rebecca",
    image: "https://via.placeholder.com/150/DC3545/FFFFFF?text=R",
    preview: "Lorem ipsum, dolor...",
    time: "YESTERDAY",
    unreadCount: 5,
  },
  {
    id: 3,
    name: "Todd",
    image: "https://via.placeholder.com/150/28A745/FFFFFF?text=T",
    preview: "Lorem ipsum, dolor...",
    time: "MONDAY",
    unreadCount: 3,
  },
  {
    id: 4,
    name: "Alicia",
    image: "https://via.placeholder.com/150/FFC107/FFFFFF?text=A",
    preview: "Lorem ipsum, dolor...",
    time: "01/29/2024",
    unreadCount: 1,
  },
  {
    id: 5,
    name: "Bella",
    image: "https://via.placeholder.com/150/6F42C1/FFFFFF?text=B",
    preview: "Lorem ipsum, dolor...",
    time: "8:51PM",
  },
  {
    id: 6,
    name: "Paris",
    image: "https://via.placeholder.com/150/E83E8C/FFFFFF?text=P",
    preview: "Lorem ipsum, dolor...",
    time: "01/29/2024",
    unreadCount: 1,
  },
];

function MessagingApp() {
  const [messages, setMessages] = useState(mockMessages);
  const navigate = useNavigate();

  // Placeholder for API call to send a new message
  const sendMessage = async (message:any) => {
    try {
      // Uncomment when backend is ready
      // const response = await fetch('/api/messages', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(message),
      // });
      // const data = await response.json();
      // setMessages((prevMessages) => [...prevMessages, data]);
      console.log("Message sent:", message);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Placeholder for reflecting newly sent message in the current channel
  useEffect(() => {
    // Logic to update the message list in real-time can be added here
    // This can include WebSocket or polling mechanism to fetch new messages
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header Section */}
      <header className="flex items-center justify-between px-4 py-3 bg-white shadow">
        {/* Back Button */}
        <button
          className="p-3 rounded-full bg-white hover:bg-gray-300"
          onClick={() => navigate("/HomePage")} // Navigate back to messages list
        >
          <FaArrowLeft className="text-gray-800 text-lg" />
        </button>

        {/* Title */}
        <h1 className="text-xl font-bold text-gray-800">Messages</h1>

        {/* Add New Message Button */}
        <button className="p-3 rounded-full bg-secondaryColour">
          <FaPlus className="text-white" />
        </button>
      </header>

      {/* Groups Section */}
      <div className="mt-4 px-4">
      <h2 className="font-semibold text-lg text-gray-700 ">Groups</h2>
        <div className="px-4 py-3 bg-white mt-4 rounded-lg shadow">
          
          <div className="flex gap-4 overflow-x-auto">
            {mockGroups.map((group) => (
              <div
                key={group.id}
                className="flex flex-col items-center w-20 cursor-pointer"
                onClick={() => {
                  // Navigate to ChatScreen with group details
                  navigate("/chat", {
                    state: {
                      chatName: group.name,
                      chatAvatar: group.image,
                      chatType: "group", // Indicate that this is a group chat
                      groupId: group.id, // Pass group ID if needed
                    },
                  });
                }}
              >
                <img
                  src={group.image}
                  alt={group.name}
                  className="w-16 h-16 rounded-full border border-gray-300 object-cover"
                />
                <span className="text-sm text-gray-600 mt-2 text-center">
                  {group.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages Section */}
      <div className="mt-4 px-4">
        <h2 className="font-semibold text-lg text-gray-700 mb-4">
          Messages
        </h2>
        <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => {
                // Navigate to ChatScreen with message details
                navigate("/chat", {
                  state: {
                    chatName: message.name,
                    chatAvatar: message.image,
                    chatType: "individual", // Indicate that this is an individual chat
                    messageId: message.id, // Pass message ID if needed
                  },
                });
              }}
            >
              {/* User Profile Picture */}
              <img
                src={message.image}
                alt={message.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {/* Message Details */}
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-md font-bold text-gray-800">
                    {message.name}
                  </h3>
                  <span className="text-sm text-gray-400">{message.time}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{message.preview}</p>
              </div>
              {/* Unread Messages Count */}
              {message.unreadCount && (
                <div className="ml-4 p-1 rounded-full bg-secondaryColour w-6 h-6 text-white text-center text-xs">
                  {message.unreadCount}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MessagingApp;
