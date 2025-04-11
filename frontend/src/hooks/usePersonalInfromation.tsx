import { useCallback, useState } from "react";
import accountApi from "@/services/api/accountApi.ts";
import { Account } from "@/types/account";
import log from "loglevel";

const usePersonalInformation = () => {
  const [data, setData] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountData = useCallback(async (accountId: number) => {
    log.info("Fetching personal information");
    setLoading(true);
    setError(null);

    try {
      const accountData = await accountApi.getAccountById(accountId);
      setData(accountData);
      log.info("Fetched personal information succesfully", accountData);
    } catch (error) {
      log.error("Error fetching personal information:", error);
      setError("Failed to fetch account data from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetchAccountData, data, loading, error };
};

export default usePersonalInformation;
