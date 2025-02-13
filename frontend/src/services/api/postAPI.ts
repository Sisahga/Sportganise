import { getBearerToken } from "@/services/apiHelper";
import { Post, ApiResponse } from "@/types/postdetail";


const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/forum/posts";
const postApi = {
    async getPost(postId: number): Promise<ApiResponse<Post>> {
        console.log("Fetching post API, Post ID:", postId);
        console.log(baseMappingUrl)

        const url = `${baseMappingUrl}/${postId}`;
        console.log("Request URL:", url);

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getBearerToken()}`,
                "Content-Type": "application/json"
            }
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
            const error = await response.json();
            console.log("Error fetching post:", error);
            throw new Error(error?.message || `Error fetching post with ID ${postId}`);
        }

        const data = await response.json();
        console.log("Fetched post data:", data);
        return data;
    },

    async likePost(postId: number, accountId: number): Promise<ApiResponse<null>> {
        console.log("Liking post API, Post ID:", postId, "Account ID:", accountId);

        const url = `${baseMappingUrl}/${postId}/like`;
        console.log("Request URL:", url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getBearerToken()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ accountId })
        });

        if (response.status === 500) {
            const error = await response.json();
            console.log("Error Code:", response.status)
            throw new Error(error?.message || `Error liking post with ID ${postId}`);
        }

        const data = await response.json();
        console.log("Post liked successfully, response data:", data);
        return data;
    },

    async unlikePost(postId: number, accountId: number): Promise<void> {
        console.log("Unliking post API, Post ID:", postId, "Account ID:", accountId);

        const url = `${baseMappingUrl}/${postId}/unlike/${accountId}`;
        console.log("Request URL:", url);

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getBearerToken()}`
            }
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
            const error = await response.json();
            console.log("Error unliking post:", error);
            throw new Error(error?.message || `Error unliking post with ID ${postId}`);
        }

        console.log("Post unliked successfully");
    },

    async addFeedback(postId: number, accountId: number, content: string): Promise<ApiResponse<null>> {
        console.log("Adding feedback to post API, Post ID:", postId, "Account ID:", accountId, "Content:", content);

        const url = `${baseMappingUrl}/${postId}/add-feedback`;
        console.log("Request URL:", url);

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${getBearerToken()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ accountId, content })
        });

        console.log("Response status:", response.status);
        if (!response.ok) {
            const error = await response.json();
            console.log("Error adding feedback:", error);
            throw new Error(error?.message || `Error adding feedback to post with ID ${postId}`);
        }

        const data = await response.json();
        console.log("Feedback added successfully, response data:", data);
        return data;
    },

    async deleteFeedback(postId: number, feedbackId: number): Promise<void> {
        console.log("Deleting feedback from post API, Post ID:", postId, "Feedback ID:", feedbackId);
    
        const url = `${baseMappingUrl}/${postId}/delete-feedback/${feedbackId}`; // Change endpoint to use feedbackId
        console.log("Request URL:", url);
    
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${getBearerToken()}`
            }
        });
    
        console.log("Response status:", response.status);
        if (!response.ok) {
            const error = await response.json();
            console.log("Error deleting feedback:", error);
            throw new Error(error?.message || `Error deleting feedback from post with ID ${postId}`);
        }
    
        const data = await response.json();
        console.log("Feedback deleted successfully, response data:", data);
    }
    
    
};



export default postApi;


