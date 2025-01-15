import { AccountDetailsDirectMessaging } from "@/types/account.ts";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/account";

const accountApi = {
  getUserAccounts: async (organizationId: number, userId: number) => {
    const response = await fetch(
      `${baseMappingUrl}/get-all-users/${organizationId}/${userId}`,
    );
    const data: AccountDetailsDirectMessaging[] = await response.json();
    return data;
  },
};

export default accountApi;
