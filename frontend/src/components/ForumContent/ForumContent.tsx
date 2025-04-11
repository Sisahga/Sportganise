import React, { useState, useEffect, useRef } from "react";
import {
  ThumbsUp,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
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
import { PostDto } from "@/types/forum";
import { usePostLike } from "@/hooks/usePostLike";
import useGetCookies from "@/hooks/useGetCookies.ts";
import log from "loglevel";

const ForumContent: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const { userId, preLoading } = useGetCookies();

  const { posts, loading, error, fetchPostsData, resetFilters } =
    useForumPosts();
  const { likePost, unlikePost } = usePostLike();

  const [post, setPost] = useState<PostDto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [occurrenceDate, setOccurrenceDate] = useState<string | undefined>(
    undefined,
  );

  const [type, setType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("");
  const [sortOption, setSortOption] = useState("latest");

  useEffect(() => {
    if (posts) {
      setPost(posts);
    }
  }, [posts]);

  useEffect(() => {
    if (inputRef.current && searchTerm != "") {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    if (!preLoading) {
      if (userId !== 0) {
        const timer = setTimeout(
          () => {
            fetchPostsData(
              userId,
              searchTerm,
              occurrenceDate,
              type,
              postsPerPage,
              currentPage,
              sortBy,
              sortDir,
            ).then((_) => _);
          },
          searchTerm ? 500 : 0,
        );

        return () => clearTimeout(timer);
      } else {
        log.warn("User ID is not set. Cannot fetch posts.");
      }
    }
  }, [searchTerm, currentPage, preLoading, userId]);

  const navigatePostDetail = (postId: number) => {
    navigate(`/pages/PostDetailPage`, { state: { postId } });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
  };

  const handleLike = (postId: number) => {
    setPost((prevPosts) =>
      prevPosts.map((post) => {
        if (post.postId === postId) {
          const Liked = !post.liked;
          const newLikeCount = Liked ? post.likeCount + 1 : post.likeCount - 1;

          if (Liked) {
            likePost(postId, userId).then((_) => _);
          } else {
            unlikePost(postId, userId).then((_) => _);
          }

          return {
            ...post,
            liked: Liked,
            likeCount: newLikeCount,
          };
        }
        return post;
      }),
    );
  };

  const handleApplyFilters = () => {
    fetchPostsData(
      userId,
      searchTerm,
      occurrenceDate,
      type,
      postsPerPage,
      currentPage,
      sortBy,
      sortDir,
    ).then((_) => _);
  };

  const handleClearFilters = () => {
    resetFilters(
      userId,
      searchTerm,
      setOccurrenceDate,
      setType,
      setSortBy,
      setSortOption,
      setSortDir,
      setCurrentPage,
      setPostsPerPage,
    ).then((_) => _);
  };

  if (preLoading || loading) {
    return (
      <div>
        <LoaderCircle className="animate-spin h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Utility function to format the occurrence date
  const formatOccurrenceDate = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const amPm = date.getHours() >= 12 ? "PM" : "AM";
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
      <h2 className="font-semibold text-3xl text-secondaryColour text-center mb-4">
        Forum
      </h2>

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
          className="w-full flex-grow bg-white"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>

      {/* Posts */}
      <div className="flex flex-col space-y-4 lg:mx-24">
        {post.map((post) => (
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
                className={`flex items-center rounded-lg ${post.liked ? "text-secondaryColour" : "text-primaryColour"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(post.postId);
                }}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{post.likeCount}</span>
              </Button>

              <Button
                variant="outline"
                className=" flex items-center rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/pages/PostDetailPage`, {
                    state: { postId: post.postId },
                  });
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>{post.feedbackCount}</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 pb-4">
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
