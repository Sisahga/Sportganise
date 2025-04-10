import {
  AccountDetailsDirectMessaging,
  Account,
  UpdateAccountPayload,
  AccountPermissions,
} from "@/types/account.ts";
import { ApiService } from "@/services/apiHelper.ts";
import { setCookies, getCookies } from "@/services/cookiesService";
import ResponseDto from "@/types/response.ts";
import log from "loglevel";

const EXTENDED_BASE_URL = "/api/account";

const accountApi = {
  getUserAccounts: async (organizationId: number, userId: number) => {
    return await ApiService.get<ResponseDto<AccountDetailsDirectMessaging[]>>(
      `${EXTENDED_BASE_URL}/get-all-users/${organizationId}/${userId}`,
    );
  },

  getAllAccountsWithRoles: async () => {
    const response = await ApiService.get<ResponseDto<AccountPermissions[]>>(
      `${EXTENDED_BASE_URL}/permissions`,
    );

    if (response.statusCode === 200) {
      return response.data;
    } else {
      const errorMessage =
        response.message || `HTTP error! status: ${response.statusCode}`;
      throw new Error(errorMessage);
    }
  },

  getAccountById: async (accountId: number): Promise<Account> => {
    const response = await ApiService.get<ResponseDto<Account>>(
      `${EXTENDED_BASE_URL}/${accountId}`,
    );
    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else {
      throw new Error(`Error ${response.statusCode}: ${response.message}`);
    }
  },

  updateAccount: async (
    accountId: number,
    data: UpdateAccountPayload,
  ): Promise<void> => {
    const response = await ApiService.put<ResponseDto<void>>(
      `${EXTENDED_BASE_URL}/${accountId}`,
      data,
    );

    if (response.statusCode === 204) {
      const currentCookies = await getCookies();
      if (currentCookies) {
        await setCookies({
          ...currentCookies,
          email: data.email || currentCookies.email,
        });
      }
    } else {
      const errorMessage =
        response.message || `HTTP error! status: ${response.statusCode}`;
      throw new Error(errorMessage);
    }
  },

  updateProfilePicture: async (
    accountId: number,
    file: File,
  ): Promise<{ success: boolean; message: string }> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await ApiService.put<ResponseDto<void>>(
      `${EXTENDED_BASE_URL}/${accountId}/picture`,
      formData,
      {
        isMultipart: true,
      },
    );

    if (response.statusCode === 204) {
      return {
        success: true,
        message: "Your profile picture has been successfully updated.",
      };
    } else if (response.statusCode === 404) {
      return { success: false, message: "Account not found" };
    } else if (response.statusCode === 500) {
      return { success: false, message: "Failed to upload the file" };
    } else {
      return {
        success: false,
        message: "Unexpected error occurred while updating the profile picture",
      };
    }
  },

  fetchUserPermissions: async (): Promise<AccountPermissions[]> => {
    const response = await ApiService.get<ResponseDto<AccountPermissions[]>>(
      `${EXTENDED_BASE_URL}/permissions`,
    );

    if (response.statusCode === 200 && response.data) {
      return response.data;
    } else {
      throw new Error("Failed to fetch permissions from backend");
    }
  },

  //Function to update user role
  updateUserRole: async (accountId: number, newRole: string): Promise<void> => {
    const response = await ApiService.put<ResponseDto<void>>(
      `${EXTENDED_BASE_URL}/${accountId}/type`,
      { type: newRole },
    );
    if (response.statusCode === 204) {
      log.debug("User role updated successfully");
    } else {
      throw new Error("Failed to update the role: " + response.message);
    }
  },
};

export default accountApi;
