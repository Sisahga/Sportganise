import { useState } from "react";
import { fetchPosts } from "@/services/api/forumApi";
import { PostDto } from "@/types/forum";
import log from "loglevel";

const useForumPosts = () => {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //Fetch all posts
  const fetchPostsData = async (
    currentUserId: number,
    searchTerm?: string,
    occurrenceDate?: string,
    type?: string,
    limit?: number,
    page?: number,
    sortBy?: string,
    sortDir?: string,
  ) => {
    setLoading(true);
    try {
      const result = await fetchPosts(
        currentUserId,
        searchTerm,
        occurrenceDate,
        type,
        limit,
        page,
        sortBy,
        sortDir,
      );

      setPosts(result);
      setError(null);
    } catch (error) {
      setError("Error fetching posts");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Reset all filters except searchTerm
  const resetFilters = async (
    currentUserId: number,
    searchTerm: string,
    setOccurrenceDate: (value: string) => void,
    setType: (value: string) => void,
    setSortBy: (value: string) => void,
    setSortOption: (value: string) => void,
    setSortDir: (value: string) => void,
    setPage: (value: number) => void,
    setLimit: (value: number) => void,
  ) => {
    try {
      setOccurrenceDate("");
      setType("");
      setSortBy("");
      setSortOption("latest");
      setSortDir("desc");
      setPage(1);
      setLimit(10);

      await fetchPosts(currentUserId, searchTerm);

      const updatedPosts = await fetchPosts(currentUserId, searchTerm);
      log.info("Filters reset succesfully");
      setPosts(updatedPosts);
    } catch (error) {
      log.error("Error resetting filters", error);
    }
  };

  return {
    posts,
    loading,
    error,
    fetchPostsData,
    resetFilters,
  };
};

export default useForumPosts;
