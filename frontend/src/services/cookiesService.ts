import Cookies from "js-cookie";
import { CookiesDto } from "@/types/auth";

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

export const getCookie = (name: string): string | any => {
  const cookieValue = Cookies.get(name);

  if (name === "organisationIds" && cookieValue) {
    try {
      return JSON.parse(cookieValue);
    } catch (e) {
      console.error(`Failed to parse cookie ${name}:`, e);
      return null;
    }
  }

  return cookieValue || null;
};

export const isCookiesDto = (data: any): data is CookiesDto => {
  if (!data || typeof data !== "object") {
    return false;
  }

  return (
    (data.accountId === null || typeof data.accountId === "number") &&
    typeof data.firstName === "string" &&
    typeof data.lastName === "string" &&
    typeof data.email === "string" &&
    (data.pictureUrl === null || typeof data.pictureUrl === "string") &&
    (data.type === null || typeof data.type === "string") &&
    (data.phone === null || typeof data.phone === "string") &&
    Array.isArray(data.organisationIds) &&
    data.organisationIds.every((id: any) => typeof id === "number")
  );
};

export const clearCookies = () => {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  });
};
