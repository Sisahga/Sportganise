import { getBearerToken } from "@/services/apiHelper";
import { PostDto, PostResponse } from "@/types/forum";
import { getCookies } from "../cookiesService";
import log from "loglevel";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/forum";

/**
 * Fetches posts based on various query parameters.
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
  searchTerm?: string,
  occurrenceDate?: string,
  type?: string,
  limit?: number,
  page?: number,
  sortBy?: string,
  sortDir?: string,
): Promise<PostDto[]> => {
  const orgId = 1; //change when org id setup properly
  const user = getCookies();
  let url = `${baseMappingUrl}/posts/search/${orgId}/${user.accountId}?`;

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
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getBearerToken()}`,
      "Content-Type": "application/json",
    },
  });

  const data: PostResponse = await response.json();

  if (data.statusCode === 200) {
    return data.data;
  } else {
    throw new Error("Failed to fetch posts");
  }
};

export { fetchPosts };
