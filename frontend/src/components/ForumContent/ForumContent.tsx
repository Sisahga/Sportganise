import React, { useState, useEffect, useRef } from "react";
import { CalendarIcon, ThumbsUp, MessageSquare, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
import { Input } from "../ui/input";
import Filters from "./Filters";
import BackButton from "../ui/back-button";

import useForumPosts from "@/hooks/useForumPosts";
import { Badge } from "../ui/badge";

const ForumContent: React.FC = () => {

  const navigate = useNavigate();

  const [likedposts, setLikedposts] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [occurrenceDate, setOccurrenceDate] = useState<string | undefined>(undefined);
  const [type, setType] = useState("");
  const [selectedLabel] = useState<string>("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("");
  const [sortOption, setSortOption] = useState('latest');
  
  const inputRef = useRef<HTMLInputElement>(null);


  const { posts, loading, error, fetchPostsData, resetFilters } = useForumPosts();


  const fetchData = () => {
    fetchPostsData(
      searchTerm, occurrenceDate, type, selectedLabel, postsPerPage, currentPage, sortBy, sortDir
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
    navigate(`/pages/PostDetailPage`, { state: { postId } });
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleApplyFilters = () => {
    fetchData();
  };

  const handleClearFilters = () => {
    resetFilters(searchTerm, setOccurrenceDate, setType, setSortBy, setSortOption, setSortDir, setCurrentPage, setPostsPerPage);
  };


// Utility function to format the occurrence date
const formatOccurrenceDate = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const amPm = date.getHours() >= 12 ? 'PM' : 'AM';
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${hours}:${minutes} ${amPm}`;
};

  const getBadgeVariant = (programType: string) => {
    switch (programType.toLowerCase()) {
      case "training":
        return { variant: "default" } as const;
      case "fundraiser":
        return { variant: "secondary" } as const;
      case "tournament":
        return { className: "bg-teal-300" };
      case "special":
        return { className: "bg-lime-300" };
      default:
        return { variant: "outline" } as const;
    }
  };



  return (
    <div className="min-h-screen pb-20">
      <BackButton />
      <h2 className="font-semibold text-3xl text-secondaryColour text-center mb-4">Forum</h2>

      {/* Filter Component */}
      <div className="mt-4 mb-2 flex items-center gap-x-1 lg:mx-24">
        <Filters
          occurrenceDate={occurrenceDate}
          setOccurrenceDate={setOccurrenceDate}
          type={type}
          setType={setType}
          sortOption={sortOption}
          setSortOption={setSortOption}
          sortDir={sortDir}
          setSortDir={setSortDir}
          sortBy={sortBy}
          setSortBy={setSortBy}
          postsPerPage={postsPerPage}
          setPostsPerPage={setPostsPerPage}
          handleClearFilters={handleClearFilters}
          handleApplyFilters={handleApplyFilters}
        />
        {/* Search Bar */}
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
            <CardTitle className="flex">
  {post.title}
  <Badge {...getBadgeVariant(post.type)} className="ml-2 h-5">
    {post.type.toLowerCase()}
  </Badge>
</CardTitle>

              <div className="mt-2 text-xs">
                {formatOccurrenceDate(post.occurrenceDate)}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>{post.description}</CardDescription>
            </CardContent>
            <CardFooter className="flex space-x-2">
              <Button
                variant="outline"
                className={`flex items-center rounded-full ${likedposts.has(post.postId) ? "text-secondaryColour" : "text-primaryColour"}`}
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
                className=" flex items-center rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/pages/PostDetailPage`, { state: { postId: post.postId } });
                }}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{post.feedbackCount}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
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