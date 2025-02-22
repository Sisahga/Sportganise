import { useState, useEffect } from "react";
import { AccountPermissions } from "@/types/account";
import accountApi from "@/services/api/accountApi";

const useFetchUserPermissions = () => {
  const [data, setData] = useState<AccountPermissions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await accountApi.fetchUserPermissions();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error, setData }; 
};

export default useFetchUserPermissions;
