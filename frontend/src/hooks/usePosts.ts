import { useState} from "react";
import { fetchPosts } from "@/services/api/forumApi";
import { PostDto } from "@/types/forum";

const usePosts = () => {
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //Fetch all posts
  const fetchPostsData = async (
    searchTerm?: string,
    occurrenceDate?: string,
    type?: string,
    selectedLabel?: string,
    limit?: number,
    page?: number,
    sortBy?: string,
    sortDir?: string
  ) => {
    setLoading(true);
    try {
      const result = await fetchPosts(
        searchTerm,
        occurrenceDate,
        type,
        selectedLabel,
        limit,
        page,
        sortBy,
        sortDir
      );
      
      setPosts(result);
      setError(null);
   
    } catch (error) {
      setError("Error fetching posts");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };



  
   // Reset all filters except searchTerm
  const resetFilters = async (
    searchTerm: string,
    setOccurrenceDate: (value: string) => void,
    setType: (value: string) => void,
    setSortBy: (value: string) => void,
    setSortOption: (value: string) => void,
    setSortDir: (value: string) => void,
    setPage: (value: number) => void,
    setLimit: (value: number) => void
  ) => {
   
    setOccurrenceDate("");
    setType("");
    setSortBy("");
    setSortOption("latest");
    setSortDir("desc"); 
    setPage(1);
    setLimit(10);
  
    const updatedPosts = await fetchPosts(searchTerm);
    setPosts(updatedPosts);
  };

  
  return {
    posts,
    loading,
    error,
    fetchPostsData,
    resetFilters,
  };
};

export default usePosts;
