import { getAccountIdCookie, getCookies } from "@/services/cookiesService.ts";
import { useEffect, useState } from "react";
import { CookiesDto } from "@/types/auth.ts";

const useGetCookies = () => {
  const [cookies, setCookies] = useState<CookiesDto>();
  const [userId, setUserId] = useState<number>(0);
  const [preLoading, setPreLoading] = useState<boolean>(true);

  const fetchCookies = async () => {
    const response = await getCookies();
    setCookies(response);
    setUserId(getAccountIdCookie(response));
  };

  useEffect(() => {
    fetchCookies().then(() => {
      setPreLoading(false);
    });
  }, [fetchCookies]);

  return {
    userId,
    cookies,
    preLoading,
  };
};
export default useGetCookies;
