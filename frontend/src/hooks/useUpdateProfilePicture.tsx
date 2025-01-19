
import accountApi from "@/services/api/accountApi";

const useUpdateProfilePicture = () => {

    const updateProfilePicture = async (accountId: number, file: File): Promise<{ success: boolean; message: string }> => {

        try {

            const result = await accountApi.updateProfilePicture(accountId, file);

            return result;
        } catch (err) {
            console.error("Error in Profile Picture Update:", err);
            return { success: false, message: "Error occurred" };
        }
    };

    return {
        updateProfilePicture,
    };
};

export default useUpdateProfilePicture;
