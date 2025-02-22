import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import accountApi from "@/services/api/accountApi";
import { AccountPermissions } from "@/types/account";
import log from "loglevel";

const useUpdateRole = (
  data: AccountPermissions[],
  setData: React.Dispatch<React.SetStateAction<AccountPermissions[]>>,
) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const updateUserRole = async (
    selectedUser: AccountPermissions,
    newRole: string,
  ) => {
    if (selectedUser) {
      setLoading(true);
      try {
        await accountApi.updateUserRole(selectedUser.accountId, newRole);

        const updatedUsers = data.map((user) =>
          user.accountId === selectedUser.accountId
            ? { ...user, type: newRole }
            : user,
        );
        setData(updatedUsers);
        log.info(
          `Successfully updated ${selectedUser.firstName} ${selectedUser.lastName}'s role to ${newRole}`,
        );
        toast({
          title: "Role Updated Successfully",
          description: `${selectedUser.firstName} ${selectedUser.lastName}'s role has been updated to ${newRole}.`,
          variant: "success",
        });
      } catch (error) {
        log.error("Error updating role", error);
        toast({
          title: "Error",
          description:
            "There was an error updating the role. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return { updateUserRole, loading };
};

export default useUpdateRole;
