import { useEffect, useState } from "react";
import { AccountDetailsDirectMessaging } from "@/types/account.ts";
import accountApi from "@/services/api/accountApi.ts";
import log from "loglevel";
import { toast } from "@/hooks/use-toast.ts";

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
        if (response.statusCode === 200 && response.data) {
          setUsers(response.data);
          setLoading(false);
        } else if (response.statusCode === 200 && !response.data) {
          setUsers([]);
          setLoading(false);
          toast({
            variant: "warning",
            title: "No users found",
            description: "No users found for this organization.",
          });
        } else {
          log.error("Error fetching users:", response.message);
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: response.message,
          });
        }
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
