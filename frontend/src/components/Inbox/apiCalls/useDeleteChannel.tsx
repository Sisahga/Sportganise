// src/apiCalls/useDeleteChannel.ts
import { useCallback } from "react";

function useDeleteChannel() {
  const deleteChannel = useCallback(
    async (channelId: number): Promise<void> => {
      const response = await fetch(
        `/api/messaging/delete-channel/${channelId}`,
        {
          method: "DELETE",
        },
      );

      if (response.status === 204) {
        // success
        return;
      } else if (response.status === 404) {
        throw new Error("Channel not found or already deleted.");
      } else if (response.status === 403) {
        throw new Error("You do not have permission to delete this channel.");
      } else {
        throw new Error("Something went wrong deleting the channel.");
      }
    },
    [],
  );

  return { deleteChannel };
}

export default useDeleteChannel;
