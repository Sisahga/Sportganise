import Cookies from "js-cookie";
import { CookiesDto } from "@/types/auth";
import log from "loglevel";
import { removeAuthToken } from "@/services/apiHelper.ts";
import { Preferences } from "@capacitor/preferences";
import { isMobilePlatform } from "@/utils/isMobilePlatform.ts";

export const setCookies = async (cookies: CookiesDto) => {
  if (isMobilePlatform()) {
    await Preferences.set({
      key: "accountId",
      value: cookies.accountId?.toString() || "",
    });
    await Preferences.set({ key: "firstName", value: cookies.firstName });
    await Preferences.set({ key: "lastName", value: cookies.lastName });
    await Preferences.set({ key: "email", value: cookies.email });
    await Preferences.set({
      key: "pictureUrl",
      value: cookies.pictureUrl || "",
    });
    await Preferences.set({ key: "type", value: cookies.type || "" });
    await Preferences.set({ key: "phone", value: cookies.phone || "" });
    await Preferences.set({
      key: "organisationIds",
      value: JSON.stringify(cookies.organisationIds),
    });
  } else {
    Cookies.set("accountId", cookies.accountId?.toString() || "", {
      path: "/",
      expires: 14,
    });
    Cookies.set("firstName", cookies.firstName, { path: "/", expires: 14 });
    Cookies.set("lastName", cookies.lastName, { path: "/", expires: 14 });
    Cookies.set("email", cookies.email, { path: "/", expires: 14 });
    Cookies.set("pictureUrl", cookies.pictureUrl || "", {
      path: "/",
      expires: 14,
    });
    Cookies.set("type", cookies.type || "", { path: "/", expires: 14 });
    Cookies.set("phone", cookies.phone || "", { path: "/", expires: 14 });
    Cookies.set("organisationIds", JSON.stringify(cookies.organisationIds), {
      path: "/",
      expires: 14,
    });
  }
};

export const getCookies = async (): Promise<CookiesDto> => {
  try {
    if (isMobilePlatform()) {
      const [
        accountId,
        firstName,
        lastName,
        email,
        pictureUrl,
        type,
        phone,
        organisationIds,
        jwtToken,
      ] = await Promise.all([
        Preferences.get({ key: "accountId" }),
        Preferences.get({ key: "firstName" }),
        Preferences.get({ key: "lastName" }),
        Preferences.get({ key: "email" }),
        Preferences.get({ key: "pictureUrl" }),
        Preferences.get({ key: "type" }),
        Preferences.get({ key: "phone" }),
        Preferences.get({ key: "organisationIds" }),
        Preferences.get({ key: "jwtToken" }),
      ]);

      return {
        accountId: accountId.value ? parseInt(accountId.value, 10) : null,
        firstName: firstName.value || "",
        lastName: lastName.value || "",
        email: email.value || "",
        pictureUrl: pictureUrl.value || null,
        type: type.value || "",
        phone: phone.value || "",
        organisationIds: organisationIds.value
          ? JSON.parse(organisationIds.value)
          : [],
        jwtToken: jwtToken.value || null,
      };
    } else {
      return {
        accountId: Cookies.get("accountId")
          ? parseInt(Cookies.get("accountId")!, 10)
          : null,
        firstName: Cookies.get("firstName") || "",
        lastName: Cookies.get("lastName") || "",
        email: Cookies.get("email") || "",
        pictureUrl: Cookies.get("pictureUrl") || null,
        type: Cookies.get("type") || "",
        phone: Cookies.get("phone") || "",
        organisationIds: Cookies.get("organisationIds")
          ? JSON.parse(Cookies.get("organisationIds")!)
          : [],
        jwtToken: null,
      };
    }
  } catch (e) {
    log.error("Failed to parse cookies:", e);
    return {
      accountId: null,
      firstName: "",
      lastName: "",
      email: "",
      pictureUrl: null,
      type: "",
      phone: "",
      organisationIds: [],
      jwtToken: null,
    };
  }
};

export const getOrgCookie = (cookiesDto: CookiesDto): number[] => {
  return cookiesDto.organisationIds || [];
};

export const getAccountIdCookie = (cookiesDto: CookiesDto): number => {
  return <number>cookiesDto.accountId;
};

export const getFirstNameCookie = (cookiesDto: CookiesDto): string => {
  return cookiesDto.firstName;
};

export const getLastNameCookie = (cookiesDto: CookiesDto): string => {
  return cookiesDto.lastName;
};

export const getEmailCookie = (cookiesDto: CookiesDto): string => {
  return cookiesDto.email;
};

export const getPictureUrlCookie = (cookiesDto: CookiesDto): string | null => {
  return cookiesDto.pictureUrl;
};

export const getTypeCookie = (cookiesDto: CookiesDto): string | null => {
  return cookiesDto.type;
};

export const getPhoneCookie = (cookiesDto: CookiesDto): string | null => {
  return cookiesDto.phone;
};

export const isCookiesDto = (
  data: null | string | object,
): data is CookiesDto => {
  if (data === null || typeof data === "string") {
    return false;
  }
  if (typeof data === "object") {
    return (
      "accountId" in data &&
      "firstName" in data &&
      "lastName" in data &&
      "email" in data &&
      "phone" in data &&
      "pictureUrl" in data &&
      "type" in data &&
      "organisationIds" in data
    );
  }

  // If it's neither a string nor an object, we return false
  return false;
};

export const clearCookies = async () => {
  if (isMobilePlatform()) {
    await Preferences.clear();
  } else {
    const cookieNames = [
      "accountId",
      "firstName",
      "lastName",
      "email",
      "pictureUrl",
      "type",
      "phone",
      "organisationIds",
    ];

    cookieNames.forEach((name) => {
      Cookies.remove(name, { path: "/" });
    });
  }

  await removeAuthToken();
};

// Stores a product in the recently viewed cookie
export const addRecentlyViewedProduct = (product: {
  title: string;
  imageUrl: string;
  price: string;
  seller: string;
  link: string;
}) => {
  try {
    const cookieKey = "recentlyViewedProducts";
    const existing = Cookies.get(cookieKey);
    let recent: (typeof product)[] = existing ? JSON.parse(existing) : [];

    // Remove if it already exists (based on link)
    recent = recent.filter((item) => item.link !== product.link);

    // Add to the start of the list
    recent.unshift(product);

    // Keep only 3 items max
    if (recent.length > 3) recent = recent.slice(0, 3);

    Cookies.set(cookieKey, JSON.stringify(recent), { path: "/", expires: 7 });
  } catch (e) {
    console.error("Failed to update recently viewed:", e);
  }
};

// Gets the last 3 recently viewed products from cookies
export const getRecentlyViewedProducts = (): {
  title: string;
  imageUrl: string;
  price: string;
  seller: string;
  link: string;
}[] => {
  try {
    const cookieKey = "recentlyViewedProducts";
    const stored = Cookies.get(cookieKey);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse recently viewed products:", e);
    return [];
  }
};
