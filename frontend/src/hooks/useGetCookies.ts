import {
  getAccountIdCookie,
  getCookies,
  getEmailCookie,
} from "@/services/cookiesService.ts";
import { useCallback, useEffect, useState } from "react";
import { CookiesDto } from "@/types/auth.ts";
import log from "loglevel";

const useGetCookies = () => {
  const [cookies, setCookies] = useState<CookiesDto>();
  const [userId, setUserId] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [preLoading, setPreLoading] = useState<boolean>(true);

  const fetchCookies = useCallback(async () => {
    log.info("Fetching cookies...");
    return await getCookies();
  }, []);

  useEffect(() => {
    fetchCookies().then((res) => {
      setCookies(res);
      setUserId(getAccountIdCookie(res));
      setEmail(getEmailCookie(res));
      setPreLoading(false);
    });
  }, [fetchCookies]);

  return {
    cookies,
    userId,
    email,
    preLoading,
  };
};
export default useGetCookies;
