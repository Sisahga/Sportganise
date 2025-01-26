import { useEffect, useState } from "react";
import accountApi from "@/services/api/accountApi";
import { AccountType } from "@/types/account";

function useAccountRole(accountId: number) {
  const [role, setRole] = useState<AccountType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const account = await accountApi.getAccountById(accountId);
        setRole(account.type);
      } catch (err) {
        console.error("Error fetching account role:", err);
        setError("Failed to fetch account role");
      }
    };

    fetchRole();
  }, [accountId]);

  return { role, error };
}

export default useAccountRole;
