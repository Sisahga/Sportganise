// usePlayers.ts
import { useEffect, useState } from "react";
import accountApi from "@/services/api/accountApi";
import log from "loglevel";
import { toast } from "@/hooks/use-toast.ts";

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
      const response = await accountApi.getAllAccountsWithRoles();

      log.debug("/api/account/permissions Response:", response);
      if (response) {
        setPlayers(response);
      } else if (!response) {
        setPlayers([]);
        log.warn("No account data.");
        toast({
          title: "No account data.",
          description: "No players found.",
          variant: "warning",
        });
      }
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
    fetchPlayers().then((_) => _);
  }, []);

  return { players, loading, error, refetch: fetchPlayers };
}
