import { useNavigate } from "react-router-dom";

interface Group {
  channelId: number;
  channelName: string;
  channelImageBlob: string;
}

interface GroupSectionProps {
  groups: Group[];
}

function GroupSection({ groups }: GroupSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-4 px-4">
      <h2 className="font-semibold text-lg text-gray-700">Groups</h2>
      <div className="px-4 py-3 bg-white mt-4 rounded-lg shadow">
        <div className="flex gap-4 overflow-x-auto">
          {groups.map((group) => (
            <button
              key={group.channelId}
              type="button"
              className="flex flex-col items-center w-20 cursor-pointer focus:outline-none"
              onClick={() =>
                navigate("/chat", {
                  state: {
                    chatName: group.channelName,
                    chatAvatar: group.channelImageBlob,
                    chatType: "group",
                    channelId: group.channelId,
                  },
                })
              }
            >
              <img
                src={group.channelImageBlob}
                alt={group.channelName}
                className="w-16 h-16 rounded-full object-cover"
              />
              <span className="text-sm text-gray-600 mt-2 text-center">
                {group.channelName}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GroupSection;
