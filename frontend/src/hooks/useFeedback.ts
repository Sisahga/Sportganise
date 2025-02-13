import { useState } from "react";
import postApi from "@/services/api/postAPI";
import log from "loglevel";

export const useFeedback = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean | null>(null);  // State for success/failure
    const [message, setMessage] = useState<string>("");  // State for message

    const addFeedback = async (postId: number, accountId: number | null, content: string) => {
        if (accountId === null) {
            log.error("Cannot add feedback: Account ID is null.");
            setSuccess(false);
            setMessage("Account ID is required");
            return;
        }

        setLoading(true);
        setSuccess(null);  
        setMessage("");    

        try {
            await postApi.addFeedback(postId, accountId, content);
            log.info("Added feedback successfully");
            setSuccess(true);
            setMessage("Feedback added successfully");
        } catch (err) {
            log.error("Adding feedback failed:", err);
            setSuccess(false);
            setMessage("Error occurred while adding feedback");
        } finally {
            setLoading(false);
        }
    };

    const deleteFeedback = async (postId: number, accountId: number | null) => {
        if (accountId === null) {
            log.error("Cannot delete feedback: Account ID is null.");
            setSuccess(false);
            setMessage("Account ID is required");
            return;
        }

        setLoading(true);
        setSuccess(null);  
        setMessage("");   

        try {
            await postApi.deleteFeedback(postId, accountId);
            log.info("Deleted Feedback Successfully");
            setSuccess(true);
            setMessage("Feedback deleted successfully");
        } catch (err) {
            log.error("Deleting feedback failed:", err);
            setSuccess(false);
            setMessage("Error occurred while deleting feedback");
        } finally {
            setLoading(false);
        }
    };

    return { addFeedback, deleteFeedback, loading, success, message };
};
