import { getBearerToken } from "@/services/apiHelper";
import { PostDto, PostResponse } from "@/types/forum";
import { getCookies } from "../cookiesService";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/forum";

//FETCH POSTS API
const fetchPosts = async (
  searchTerm?: string,
  occurrenceDate?: string,
  type?: string,
  selectedLabel?: string,
  limit?: number,
  page?: number,
  sortBy?: string,
  sortDir?: string
): Promise<PostDto[]> => {
  const orgId = 1;  //change when org id setup properly
  const user = getCookies();
  let url = `${baseMappingUrl}/posts/search?orgId=${orgId}&accountId=${user.accountId}`;


  if (searchTerm) url += `&searchTerm=${searchTerm}`;
  if (occurrenceDate) url += `&occurrenceDate=${occurrenceDate}`;
  if (type) url += `&type=${type}`;
  if (selectedLabel) url += `&selectedLabel=${selectedLabel}`;
  if (limit) url += `&limit=${limit}`;
  if (page) url += `&page=${page - 1}`;
  if (sortBy) url += `&sortBy=${sortBy}`;
  if (sortDir) url += `&sortDir=${sortDir}`;

  console.log("Fetching posts from URL:", url);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${getBearerToken()}`,
      'Content-Type': 'application/json',
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
