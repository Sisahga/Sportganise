import {
  getAccountIdCookie,
  getCookies,
  getEmailCookie,
} from "@/services/cookiesService.ts";
import { useCallback, useEffect, useState } from "react";
import { CookiesDto } from "@/types/auth.ts";

const useGetCookies = () => {
  const [cookies, setCookies] = useState<CookiesDto>();
  const [userId, setUserId] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [preLoading, setPreLoading] = useState<boolean>(true);

  const fetchCookies = useCallback(async () => {
    const response = await getCookies();
    setCookies(response);
    setUserId(getAccountIdCookie(response));
    setEmail(getEmailCookie(response));
    setPreLoading(false);
  }, []);

  useEffect(() => {
    fetchCookies().then((_) => _);
  }, [fetchCookies]);

  return {
    cookies,
    userId,
    email,
    preLoading,
  };
};
export default useGetCookies;
