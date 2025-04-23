import { jwtDecode } from "jwt-decode";
import { Preferences } from "@capacitor/preferences";
import { isMobilePlatform } from "@/utils/isMobilePlatform.ts";
import { Http } from "@capacitor-community/http";

interface JwtPayload {
  exp: number;
}

export const getAuthToken = async () => {
  let token: string | null;

  if (isMobilePlatform()) {
    const { value } = await Preferences.get({ key: "auth_token" });
    token = value;
  } else {
    token = window.localStorage.getItem("auth_token");
  }

  if (token) {
    const decodedToken: JwtPayload = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
      await removeAuthToken();
      console.error("Token expired. Please log in again.");
      return null;
    }
    return token;
  }
  return null;
};

export const setAuthToken = async (token: string) => {
  if (isMobilePlatform()) {
    await Preferences.set({ key: "auth_token", value: token });
  } else {
    window.localStorage.setItem("auth_token", token);
  }
};

export const removeAuthToken = async () => {
  if (isMobilePlatform()) {
    await Preferences.remove({ key: "auth_token" });
  } else {
    window.localStorage.removeItem("auth_token");
  }
};

export const getBearerToken = async () => {
  const token = await getAuthToken();
  if (token) {
    return `Bearer ${token}`;
  } else {
    return "";
  }
};

export type TBody =
  | Record<string, unknown>
  | object
  | FormData
  | string
  | null
  | undefined;

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: TBody;
  requiresAuth?: boolean;
  isMultipart?: boolean;
}

export class ApiService {
  private static API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  public static async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
  ): Promise<T> {
    // Default options.
    const {
      method = "GET",
      headers = {},
      body,
      requiresAuth = true,
      isMultipart = false,
    } = options;

    if (requiresAuth) {
      console.log("Protected endpoint. Requires auth token.");
      const bearerToken = await getBearerToken();
      if (bearerToken) {
        headers["Authorization"] = bearerToken;
      } else {
        delete headers["Authorization"];
      }
    }

    const requestHeaders = { ...headers };
    let requestBody = body;

    // Ensure headers for non GET requests.
    if (!isMultipart && body && method !== "GET") {
      requestHeaders["Content-Type"] = "application/json";
      requestBody = JSON.stringify(body);
    }

    try {
      // API request handling for Mobile Platforms.
      if (isMobilePlatform()) {
        const capacitorOptions = {
          method,
          url: `${this.API_BASE_URL}${endpoint}`,
          headers: requestHeaders,
          data: requestBody,
        };

        console.log("capacitorOptions: ", capacitorOptions);
        const response = await Http.request(capacitorOptions);
        return response.data;
      } else {
        // API request handling for Web Platforms.
        const fetchOptions: RequestInit = {
          method,
          headers: requestHeaders,
          body: requestBody as BodyInit,
        };

        console.log("fetchOptions: ", fetchOptions);

        const response = await fetch(
          `${this.API_BASE_URL}${endpoint}`,
          fetchOptions,
        );

        return await response.json();
      }
    } catch (error) {
      console.error(
        `Error in Api Service request for ${this.API_BASE_URL}${endpoint}: `,
        error,
      );
      throw error;
    }
  }

  static get<T>(
    endpoint: string,
    options: Omit<ApiRequestOptions, "method"> = {},
  ) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  static post<T>(
    endpoint: string,
    body: TBody,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ) {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  static put<T>(
    endpoint: string,
    body: TBody,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ) {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  static patch<T>(
    endpoint: string,
    body: TBody,
    options: Omit<ApiRequestOptions, "method" | "body"> = {},
  ) {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  static delete<T>(
    endpoint: string,
    options: Omit<ApiRequestOptions, "method"> = {},
  ) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}
