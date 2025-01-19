import { useState } from "react";
import accountApi from "@/services/api/accountApi.ts";
import { UpdateAccountPayload } from "@/types/account.ts";

function useUpdateAccount() {
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const updateAccount = async (
    accountId: number,
    data: UpdateAccountPayload,
  ) => {
    setSuccess(false);
    setMessage(null);

    try {
      await accountApi.updateAccount(accountId, data);
      setSuccess(true);
      setMessage("Account successfully updated.");
    } catch (err) {
      console.error("Error updating account:", err);
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Failed to update account. Please try again.");
      }
    }
  };

  return {
    success,
    message,
    updateAccount,
  };
}

export default useUpdateAccount;
