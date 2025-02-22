import { useState, useEffect } from "react";
import { AccountPermissions } from "@/types/account";
import accountApi from "@/services/api/accountApi";
import log from "loglevel";

const useFetchUserPermissions = () => {
  const [data, setData] = useState<AccountPermissions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        log.info("Fetching user permissions...");

        const result = await accountApi.fetchUserPermissions();
        setData(result);

        log.info("Successfully fetched user permissions", result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
          log.error("Error fetching user permissions:", err.message);
        } else {
          setError("An unexpected error occurred");
          log.error("Unexpected error fetching user permissions");
        }
      } finally {
        setLoading(false);
        log.info("Finished fetching user permissions");
      }
    };

    fetchData();
  }, []);

  return { data, loading, error, setData };
};

export default useFetchUserPermissions;
