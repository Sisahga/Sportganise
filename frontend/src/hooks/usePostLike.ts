import { useState, useCallback } from "react";
import postApi from "@/services/api/postAPI";

export const usePostLike = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const likePost = useCallback(async (postId: number, accountId: number | null) => {
        if (accountId === null) {
            console.error("Account ID is null. Cannot like the post.");
            return;
        }

        setLoading(true);
        try {
            const data = await postApi.likePost(postId, accountId);
            console.log("Post liked successfully:", data);
        } catch (err) {
            console.error("Error liking the post:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const unlikePost = useCallback(async (postId: number, accountId: number | null) => {
        if (accountId === null) {
            console.error("Account ID is null. Cannot unlike the post.");
            return;
        }

        setLoading(true);
        try {
            await postApi.unlikePost(postId, accountId);
            console.log("Post unliked successfully");
        } catch (err) {
            console.error("Error unliking the post:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {likePost, unlikePost, loading };
};
