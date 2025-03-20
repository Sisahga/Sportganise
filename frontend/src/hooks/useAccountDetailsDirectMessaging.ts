import { useEffect, useState } from "react";
import { AccountDetailsDirectMessaging } from "@/types/account.ts";
import accountApi from "@/services/api/accountApi.ts";

function useAccountDetailsDirectMessaging(
  organizationId: number,
  userId: number,
) {
  const [users, setUsers] = useState<AccountDetailsDirectMessaging[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await accountApi.getUserAccounts(
          organizationId,
          userId,
        );
        setUsers(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };
    fetchUsers().then((r) => r);
  }, [organizationId, userId]);
  useEffect(() => {
    console.log("Users: ", users);
  }, [users]);

  return {
    users,
    loading,
  };
}

export default useAccountDetailsDirectMessaging;
