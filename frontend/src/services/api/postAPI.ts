import { getBearerToken } from "@/services/apiHelper";
import { Post, ApiResponse } from "@/types/postdetail";
import { getCookies } from "../cookiesService";
import log from "loglevel";

const BASE_API_URL = import.meta.env.VITE_API_BASE_URL + "/api/forum/posts";

/**
 * Post APIs
 * - getPost(postId, accountId) -> fetches post details by ID
 * - likePost(postId, accountId) -> likes a post
 * - unlikePost(postId, accountId) -> unlikes a post
 * - addFeedback(postId, accountId, content) -> adds feedback to a post
 * - deleteFeedback(postId, feedbackId) -> deletes feedback from a post
 */
const postApi = {
  // Get Post Details
  getPost: async (postId: number): Promise<ApiResponse<Post>> => {
    const user = getCookies();
    log.debug(
      "Fetching post API, Post ID:",
      postId,
      user.accountId,
      BASE_API_URL,
    );

    const url = `${BASE_API_URL}/${postId}/${user.accountId}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: getBearerToken(),
        "Content-Type": "application/json",
      },
    });

    log.debug("Response status:", response.status);
    if (!response.ok) {
      const error = await response.json();
      log.error("Error fetching post:", error);
      throw new Error(
        error?.message || `Error fetching post with ID ${postId}`,
      );
    }

    const data = await response.json();
    log.debug("Fetched post data:", data);
    return data;
  },

  // Like a Post
  likePost: async (
    postId: number,
    accountId: number,
  ): Promise<ApiResponse<null>> => {
    log.debug("Liking post API, Post ID:", postId, "Account ID:", accountId);

    const url = `${BASE_API_URL}/${postId}/like`;
    log.debug("Request URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: getBearerToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountId }),
    });

    if (response.status === 500) {
      const error = await response.json();
      log.error("Error Code:", response.status);
      throw new Error(error?.message || `Error liking post with ID ${postId}`);
    }

    const data = await response.json();
    log.debug("Post liked successfully, response data:", data);
    return data;
  },

  // Unlike a Post
  unlikePost: async (postId: number, accountId: number): Promise<void> => {
    log.debug("Unliking post API, Post ID:", postId, "Account ID:", accountId);

    const url = `${BASE_API_URL}/${postId}/unlike/${accountId}`;
    log.debug("Request URL:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: getBearerToken(),
      },
    });

    log.debug("Response status:", response.status);
    if (!response.ok) {
      const error = await response.json();
      log.error("Error unliking post:", error);
      throw new Error(
        error?.message || `Error unliking post with ID ${postId}`,
      );
    }

    log.debug("Post unliked successfully");
  },

  // Add Feedback to Post
  addFeedback: async (
    postId: number,
    accountId: number,
    content: string,
  ): Promise<number> => {
    log.debug(
      "Adding feedback to post API, Post ID:",
      postId,
      "Account ID:",
      accountId,
      "Content:",
      content,
    );

    const url = `${BASE_API_URL}/${postId}/add-feedback`;
    log.debug("Request URL:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: getBearerToken(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountId, content }),
    });

    if (!response.ok) {
      const error = await response.json();
      log.error("Error adding feedback:", error);
      throw new Error(
        error?.message || `Error adding feedback to post with ID ${postId}`,
      );
    }

    const data = await response.json();
    log.debug("Feedback added successfully, response data:", data);

    return data.data.feedbackId;
  },

  // Delete Feedback from Post
  deleteFeedback: async (postId: number, feedbackId: number): Promise<void> => {
    log.debug(
      "Deleting feedback from post API, Post ID:",
      postId,
      "Feedback ID:",
      feedbackId,
    );

    const url = `${BASE_API_URL}/${postId}/delete-feedback/${feedbackId}`;
    log.debug("Request URL:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: getBearerToken(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      log.error("Error deleting feedback:", error);
      throw new Error(
        error?.message || `Error deleting feedback from post with ID ${postId}`,
      );
    }

    const data = await response.json();
    log.debug("Feedback deleted successfully, response data:", data);
  },
};

export default postApi;
