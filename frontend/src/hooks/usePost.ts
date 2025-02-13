import { useState, useEffect } from "react";
import postApi from "@/services/api/postAPI";
import { Post } from "@/types/postdetail";

export const usePost = (postId: number) => {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await postApi.getPost(postId);
                setPost(response.data);
            } catch (err) {
                setError("Failed to fetch post.");
                setLoading(false);
            } finally{
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    return { post, loading, error };
};
