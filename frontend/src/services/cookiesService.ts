import Cookies from "js-cookie";
import { CookiesDto } from "@/types/auth";
import log from "loglevel";

export const setCookies = (cookies: CookiesDto) => {
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
};

export const getCookies = (): CookiesDto => {
  try {
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

export const clearCookies = () => {
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
};
