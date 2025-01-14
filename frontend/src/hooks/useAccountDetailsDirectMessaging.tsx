import {useEffect, useState} from "react";
import { AccountDetailsDirectMessaging } from "@/types/account.ts";
import accountApi from "@/services/api/accountApi.ts";

function useAccountDetailsDirectMessaging (organizationId: number) {
  const [users, setUsers] = useState<AccountDetailsDirectMessaging[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response =  await accountApi.getUserAccounts(organizationId);
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers().then(r => r);
  }, [organizationId]);
  useEffect(() => {
    console.log("Users: ", users);
  }, [users]);

  return {
    users
  }
}

export default useAccountDetailsDirectMessaging;