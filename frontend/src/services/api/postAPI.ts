import { ApiService } from "@/services/apiHelper";
import { FeedbackResponseDto, Post } from "@/types/postdetail";
import log from "loglevel";
import ResponseDto from "@/types/response.ts";

const EXTENDED_BASE_URL = "/api/forum/posts";

/**
 * Post APIs
 * - getPost(postId, accountId) -> fetches post details by ID
 * - likePost(postId, accountId) -> likes a post
 * - unlikePost(postId, accountId) -> unlikes a post
 * - addFeedback(postId, accountId, content) -> adds feedback to a post
 * - deleteFeedback(postId, feedbackId) -> deletes feedback from a post
 */
const postApi = {
  getPost: async (
    postId: number,
    userId: number,
  ): Promise<ResponseDto<Post>> => {
    log.debug("Fetching post API, Post ID:", postId, userId, EXTENDED_BASE_URL);

    const url = `${EXTENDED_BASE_URL}/${postId}/${userId}`;

    const response = await ApiService.get<ResponseDto<Post>>(url);

    log.debug("Response status:", response.statusCode);
    if (response.statusCode === 201) {
      log.debug("Post successfully fetched.");
      return response;
    } else {
      log.error("Error Code:", response.statusCode);
      throw new Error(
        response?.message || `Error fetching post with ID ${postId}`,
      );
    }
  },

  likePost: async (
    postId: number,
    accountId: number,
  ): Promise<ResponseDto<null>> => {
    log.debug("Liking post API, Post ID:", postId, "Account ID:", accountId);

    const url = `${EXTENDED_BASE_URL}/${postId}/like`;

    const response = await ApiService.post<ResponseDto<null>>(url, {
      accountId,
    });

    if (response.statusCode === 201) {
      log.debug("Post successfully liked.");
      return response;
    } else {
      log.error("Error Code:", response.statusCode);
      throw new Error(
        response?.message || `Error liking post with ID ${postId}`,
      );
    }
  },

  unlikePost: async (postId: number, accountId: number): Promise<void> => {
    log.debug("Unliking post API, Post ID:", postId, "Account ID:", accountId);

    const url = `${EXTENDED_BASE_URL}/${postId}/unlike/${accountId}`;
    log.debug("Request URL:", url);

    const response = await ApiService.delete<ResponseDto<string>>(url);

    if (response.statusCode !== 204) {
      log.error("Error unliking post: ", response.message);
      throw new Error(
        response?.message || `Error unliking post with ID ${postId}`,
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

    const url = `${EXTENDED_BASE_URL}/${postId}/add-feedback`;
    log.debug("Request URL:", url);

    const response = await ApiService.post<ResponseDto<FeedbackResponseDto>>(
      url,
      {
        accountId,
        content,
      },
    );

    if (response.statusCode === 201 && response.data) {
      log.debug("Feedback successfully added.");
      return response.data.feedbackId;
    } else if (response.statusCode === 201 && !response.data) {
      log.error("Successful response but no feedback ID returned in response.");
      throw new Error(
        `Error adding feedback to post with ID ${postId}: No feedback ID returned.`,
      );
    } else {
      log.error("Error Code:", response.statusCode);
      throw new Error(
        response?.message || `Error adding feedback to post with ID ${postId}`,
      );
    }
  },

  // Delete Feedback from Post
  deleteFeedback: async (postId: number, feedbackId: number): Promise<void> => {
    log.debug(
      "Deleting feedback from post API, Post ID:",
      postId,
      "Feedback ID:",
      feedbackId,
    );

    const url = `${EXTENDED_BASE_URL}/${postId}/delete-feedback/${feedbackId}`;
    log.debug("Request URL:", url);

    const response = await ApiService.delete<ResponseDto<string>>(url);

    if (response.statusCode === 204) {
      log.debug("Feedback successfully deleted.");
    } else {
      log.error("Error Code:", response.statusCode);
      throw new Error(
        response?.message ||
          `Error deleting feedback from post with ID ${postId}`,
      );
    }
  },
};

export default postApi;
