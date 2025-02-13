import React, { useState, useEffect,useRef} from "react";
import { CalendarIcon, ThumbsUp, MessageSquare, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import "react-day-picker/dist/style.css";
import BackButton from "../ui/back-button";
import useForumPosts from "@/hooks/useForumPosts";


const ForumContent: React.FC = () => {

  const navigate = useNavigate();

  const [likedposts, setLikedposts] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  
  //State for Filters
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [occurrenceDate, setOccurrenceDate] = useState<string | undefined>(undefined);
  const [type, setType] = useState("");
  const[limit, setLimit] = useState();
  const[page, setPage] = useState();
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("");
  const [sortOption, setSortOption] = useState('latest');
  const [selectedLabel] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);



  const { posts, loading, error, fetchPostsData, resetFilters } = useForumPosts();


  const fetchData = () => {
    fetchPostsData(
      searchTerm, occurrenceDate, type, selectedLabel, limit, page, sortBy, sortDir
    );
  };

   useEffect(() => {
    if (inputRef.current && searchTerm != "") {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, searchTerm ? 500 : 0);

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm)
  }

  const handleLike = (postId: number) => {
    setLikedposts((prev) => {
      const newLikedposts = new Set(prev);
      if (newLikedposts.has(postId)) {
        newLikedposts.delete(postId);
      } else {
        newLikedposts.add(postId);
      }
      return newLikedposts;
    });
  };

  const navigatePostDetail = (postId: number) => {
    navigate(`/pages/PostDetailPage`, { state: { postId }});
  };


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }



  return (
    <div className="min-h-screen pb-20">
      <BackButton />

      <h2 className="font-semibold text-3xl text-secondaryColour text-center mb-8">
        Forum
      </h2>

      <div className="mt-4 mb-2 flex items-center lg:mx-24">
        {/* Menu Bar with Filters */}
        <div className="mr-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-auto justify-start text-left font-normal flex items-center"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="space-y-2 p-2">
                {/* Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="w-4 h-4" />
                      Select Date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      numberOfMonths={1}
                      className="border rounded-sm"
                    />
                    <Button variant="outline" className="w-full">
                      Clear
                    </Button>
                  </PopoverContent>
                </Popover>

                {/* Sort Options */}
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">Sort by Latest</SelectItem>
                    <SelectItem value="oldest">Sort by Oldest</SelectItem>
                    <SelectItem value="most-likes">
                      Sort by Most Likes
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Search bar */}
        {/* <Input placeholder="Search..." className="w-full flex-grow" /> */}
        <Input
          ref={inputRef}
          placeholder="Search..."
          className="w-full flex-grow"
          value={searchTerm}
          onChange={handleInputChange}

        />
      </div>

      {/* posts Cards */}
      <div className="flex flex-col space-y-4 lg:mx-24">
        {posts.map((post) => (
          <Card
            key={post.postId}
            onClick={() => navigatePostDetail(post.postId)}
            className="cursor-pointer"
          >
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <div className="mt-4 text-xs">{post.occurrenceDate}</div>
            </CardHeader>
            <CardContent>
              <CardDescription>{post.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button
                variant="outline"
                className={`flex items-center space-x-1 ${likedposts.has(post.postId) ? "text-secondaryColour" : "text-primaryColour"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post.postId);
                }}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>
                  {post.likeCount + (likedposts.has(post.postId) ? 1 : 0)}
                </span>
              </Button>

              <Button
                variant="outline"
                className="flex items-center space-x-1"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePostDetail(post.postId);
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{post.feedbackCount}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination UI */}
        <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <Button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage((prev) => prev - 1);

                }
              }}
              className="text-primaryColour"
              disabled={currentPage === 1}
              variant="outline"
            >
              <ChevronLeft></ChevronLeft>
            </Button>
            <PaginationItem className="m-3">
              <span>Page {currentPage}</span>
            </PaginationItem>

            <Button
              onClick={() => {
                if (posts.length >= postsPerPage) {
                  setCurrentPage((prev) => prev + 1);

                }
              }}
              className="text-primaryColour"
              disabled={posts.length < postsPerPage}
              variant="outline"
            >
              <ChevronRight></ChevronRight>
            </Button>
          </PaginationContent>
        </Pagination>

      </div>
    </div>
  );
};

export default ForumContent;
