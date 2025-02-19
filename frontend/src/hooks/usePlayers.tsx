// usePlayers.ts
import { useEffect, useState } from "react";
import accountApi from "@/services/api/accountApi";

export interface Player {
  accountId: number;
  type: string;
  email: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
}

export default function usePlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function fetchPlayers() {
    setLoading(true);
    try {
      // call your API
      const response = await accountApi.getAllAccountsWithRoles();

      // Log the raw response to confirm it's an array
      console.log("Raw /api/account/permissions response:", response);

      // If response is just an array, do NOT do response.data
      setPlayers(response); // or response || []
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error fetching players");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlayers();
  }, []);

  return { players, loading, error, refetch: fetchPlayers };
}
