import accountApi from "@/services/api/accountApi";
import log from "loglevel";

const useUpdateProfilePicture = () => {
  const updateProfilePicture = async (
    accountId: number,
    file: File,
  ): Promise<{ success: boolean; message: string }> => {
    log.info("Attempting to update profile picture...");
    try {
      const result = await accountApi.updateProfilePicture(accountId, file);
      log.info("Profile picture updated successfully");
      return result;
    } catch (err) {
      log.error("Profile picture update failed:", err);
      return { success: false, message: "Error occurred" };
    }
  };

  return {
    updateProfilePicture,
  };
};

export default useUpdateProfilePicture;
