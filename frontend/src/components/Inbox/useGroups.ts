// useGroups.ts
import { useState, useEffect } from "react";

interface Group {
  channelId: number;
  channelName: string;
  channelImageBlob: string;
}

function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate data fetching with a timeout
    const fetchData = async () => {
      // Mock data
      const mockGroups: Group[] = [
        {
          channelId: 1,
          channelName: "Mock Group Chat",
          channelImageBlob: "/assets/defaultGroupAvatar.png",
        },
        {
          channelId: 3,
          channelName: "Another Group",
          channelImageBlob: "/assets/defaultGroupAvatar.png",
        },
      ];
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setGroups(mockGroups);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { groups, loading };
}

export default useGroups;
