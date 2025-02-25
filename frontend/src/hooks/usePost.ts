import { useState, useEffect } from "react";
import postApi from "@/services/api/postAPI";
import { Post } from "@/types/postdetail";
import log from "loglevel";

export const usePost = (postId: number) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      log.info(`Fetching post with ID: ${postId}`);

      try {
        const response = await postApi.getPost(postId);
        setPost(response.data);
        log.info(`Post fetched successfully:`, response.data);
      } catch (err) {
        log.error(`Error fetching post with ID: ${postId}`, err);
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
};
