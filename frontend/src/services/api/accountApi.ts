import {
  AccountDetailsDirectMessaging,
  Account,
  UpdateAccountPayload,
  AccountPermissions,
} from "@/types/account.ts";
import { getBearerToken } from "@/services/apiHelper.ts";
import { setCookies, getCookies } from "@/services/cookiesService";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/account";

const accountApi = {
  getUserAccounts: async (organizationId: number, userId: number) => {
    const response = await fetch(
      `${baseMappingUrl}/get-all-users/${organizationId}/${userId}`,
      {
        headers: {
          Authorization: getBearerToken() || "",
        },
      },
    );
    const data: AccountDetailsDirectMessaging[] = await response.json();
    return data;
  },
  getAllAccountsWithRoles: async () => {
    const response = await fetch(`${baseMappingUrl}/permissions`, {
      headers: {
        Authorization: getBearerToken(),
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  },

  //Function to get account by id
  getAccountById: async (accountId: number): Promise<Account> => {
    const response = await fetch(`${baseMappingUrl}/${accountId}`, {
      headers: {
        Authorization: getBearerToken(),
      },
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return await response.json();
  },

  //Function to update account information
  updateAccount: async (
    accountId: number,
    data: UpdateAccountPayload,
  ): Promise<void> => {
    const response = await fetch(`${baseMappingUrl}/${accountId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Account not found");
      }
      throw new Error("Failed to update account");
    }
    if (data && response.ok) {
      const currentCookies = await getCookies();
      if (currentCookies) {
        await setCookies({
          ...currentCookies,
          email: data.email || currentCookies.email,
        });
      }
    }
  },

  // Function to update profile picture
  updateProfilePicture: async (
    accountId: number,
    file: File,
  ): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${baseMappingUrl}/${accountId}/picture`, {
      method: "PUT",
      headers: {
        Authorization: getBearerToken(),
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, message: "Account not found" };
      } else if (response.status === 500) {
        return { success: false, message: "Failed to upload the file" };
      } else {
        return {
          success: false,
          message:
            "Unexpected error occurred while updating the profile picture",
        };
      }
    }

    return {
      success: true,
      message: "Your profile picture has been successfully updated.",
    };
  },

  //Function to get user permissions
  fetchUserPermissions: async (): Promise<AccountPermissions[]> => {
    const response = await fetch(`${baseMappingUrl}/permissions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch permissions from backend");
    }

    return response.json();
  },

  //Function to update user role
  updateUserRole: async (accountId: number, newRole: string): Promise<void> => {
    const response = await fetch(`${baseMappingUrl}/${accountId}/type`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getBearerToken(),
      },
      body: JSON.stringify({ type: newRole }),
    });

    if (!response.ok) {
      throw new Error("Failed to update the role");
    }
  },
};

export default accountApi;
