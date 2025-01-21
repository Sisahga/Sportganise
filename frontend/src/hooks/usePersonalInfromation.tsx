import { useState, useEffect } from "react";
import accountApi from "@/services/api/accountApi.ts";
import { Account } from "@/types/account";

const usePersonalInformation = (accountId: number) => {
  const [data, setData] = useState<Account | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const accountData = await accountApi.getAccountById(accountId);
        setData(accountData);
      } catch (error) {
        console.error("Error fetching account", error);
        setError("Failed to fetch account data from the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [accountId]);

  return { data, loading, error };
};

export default usePersonalInformation;
