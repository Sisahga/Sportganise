import { useState } from "react";
import accountApi from "@/services/api/accountApi.ts";
import { UpdateAccountPayload } from "@/types/account.ts";
import log from "loglevel";

function useUpdateAccount() {
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const updateAccount = async (
    accountId: number,
    data: UpdateAccountPayload,
  ) => {
    setSuccess(false);
    setMessage(null);
    log.info("Updating personal information:", data);

    try {
      await accountApi.updateAccount(accountId, data);
      setSuccess(true);
      setMessage("Account successfully updated.");
      log.info("Profile updated successfully");
    } catch (err) {
      log.error("Profile update failed:", err);
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
