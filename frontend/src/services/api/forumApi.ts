import { ApiService } from "@/services/apiHelper";
import { PostDto } from "@/types/forum";
import log from "loglevel";
import ResponseDto from "@/types/response.ts";

const EXTENDED_BASE_URL = "/api/forum";

/**
 * Fetches posts based on various query parameters.
 * - currentUserId: ID of the current user.
 * - searchTerm: (Optional) Term to search in posts.
 * - occurrenceDate: (Optional) Date of occurrence to filter posts.
 * - type: (Optional) Type of posts to filter.
 * - limit: (Optional) Limit of posts to fetch.
 * - page: (Optional) Page number for pagination.
 * - sortBy: (Optional) Sort posts by a specific field.
 * - sortDir: (Optional) Sort direction (ascending or descending).
 * @returns Promise<PostDto[]> List of posts.
 */
const fetchPosts = async (
  currentUserId: number,
  searchTerm?: string,
  occurrenceDate?: string,
  type?: string,
  limit?: number,
  page?: number,
  sortBy?: string,
  sortDir?: string,
): Promise<PostDto[]> => {
  const orgId = 1; // change when org id setup properly
  let url = `${EXTENDED_BASE_URL}/posts/search/${orgId}/${currentUserId}?`;

  const queryParams = [];

  if (searchTerm) queryParams.push(`searchTerm=${searchTerm}`);
  if (occurrenceDate) queryParams.push(`occurrenceDate=${occurrenceDate}`);
  if (type) queryParams.push(`type=${type}`);
  if (limit) queryParams.push(`limit=${limit}`);
  if (page) queryParams.push(`page=${page - 1}`);
  if (sortBy) queryParams.push(`sortBy=${sortBy}`);
  if (sortDir) queryParams.push(`sortDir=${sortDir}`);

  if (queryParams.length > 0) {
    url += queryParams.join("&");
  }

  log.info("Fetching posts from URL:", url);
  const response = await ApiService.get<ResponseDto<PostDto[]>>(url);

  if (response.statusCode === 200 && response.data) {
    return response.data;
  } else {
    throw new Error("Failed to fetch posts");
  }
};

export { fetchPosts };
