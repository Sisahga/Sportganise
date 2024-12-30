// src/apiCalls/useBlockUser.ts
import { useCallback } from "react";

function useBlockUser() {
  const blockUser = useCallback(async (userIdToBlock: number): Promise<void> => {
    const response = await fetch("/api/users/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blockedUserId: userIdToBlock }),
    });

    if (!response.ok) {
      throw new Error("Failed to block user.");
    }
  }, []);

  return { blockUser };
}

export default useBlockUser;
