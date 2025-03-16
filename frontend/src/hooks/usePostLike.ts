import { useState, useCallback } from "react";
import postApi from "@/services/api/postAPI";
import log from "loglevel";

export const usePostLike = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const likePost = useCallback(
    async (postId: number, accountId: number | null) => {
      if (accountId === null) {
        log.warn("Account ID is null, cannot like post.");
        return;
      }

      setLoading(true);
      log.info(`Liking post with ID: ${postId} for Account ID: ${accountId}`);
      try {
        await postApi.likePost(postId, accountId);
        log.info(`Successfully liked post with ID: ${postId}`);
      } catch (err) {
        log.error(`Error liking post with ID: ${postId}`, err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const unlikePost = useCallback(
    async (postId: number, accountId: number | null) => {
      if (accountId === null) {
        log.warn("Account ID is null, cannot unlike post.");
        return;
      }

      setLoading(true);
      log.info(`Unliking post with ID: ${postId} for Account ID: ${accountId}`);
      try {
        await postApi.unlikePost(postId, accountId);
        log.info(`Successfully unliked post with ID: ${postId}`);
      } catch (err) {
        log.error(`Error unliking post with ID: ${postId}`, err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { likePost, unlikePost, loading };
};
