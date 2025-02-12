//TODO: Connect and fetch from sessionId
import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import BackButton from "../ui/back-button";
import { useNavigate, useLocation } from "react-router";
import { getBearerToken } from "@/services/apiHelper";
import { Feedback, Post, ApiResponse } from "@/types/postdetail";

const baseMappingUrl = import.meta.env.VITE_API_BASE_URL + "/api/forum";

const PostsContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.state?.postId;

  const [isFocused, setIsFocused] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${baseMappingUrl}/posts/${postId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${getBearerToken()}`,
            'Content-Type': 'application/json',
          },
        });
        const data: ApiResponse = await response.json();

        // Ensure postId is defined before updating state
        if (data.statusCode === 200 && data.data?.postId) {
          setPost(data.data);
        } else {
          console.error("Post data is incomplete or invalid");
        }

        console.log("Post data set:", data);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  const handleAddComment = async () => {};

  const toggleLike = async () => {
    if (post) {
      const updatedLikes = liked ? post.likeCount - 1 : post.likeCount + 1;
      const updatedPost = {
        ...post,
        likeCount: updatedLikes, // Correct the property name
      };

      setPost(updatedPost);
      setLiked(!liked);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading || !post) {
    return <div>Loading...</div>;
  }

  // Calculate the total number of pages
  const totalPages = Math.ceil(post.feedbackList.length / commentsPerPage);

  // Slice the comments based on the current page
  const currentComments = post.feedbackList.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  return (
    <div className="py-4 min-h-screen pb-20">
      <BackButton />

      <div className="container mx-auto py-6">
        <Card className="w-full mx-auto">
          <CardHeader>
            <div className="my-4">
              <h1 className="font-bold text-lg text-primaryColour">{post.title}</h1>
              <p className="text-sm text-primaryColour">
                {formatDistanceToNow(new Date(post.creationDate), { addSuffix: true })}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="font-light text-sm text-primaryColour">{post.description}</p>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className={`flex items-center space-x-1 bg-transparent ${liked ? "text-secondaryColour" : "text-primaryColour"}`}
                  onClick={toggleLike}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likeCount}</span>
                </Button>

                <Button variant="outline" className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.feedbackCount}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Comment Section */}
        <div className="mt-6">
          <div className="w-full mb-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={1}
              className="w-full border p-3 rounded-full resize-none min-h-[40px] focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              placeholder="Leave a feedback..."
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {(newComment.trim() || isFocused) && (
            <div className="flex justify-end gap-2">
              <Button
                variant="default"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Comment
              </Button>
              <Button variant="default" onClick={() => setNewComment("")}>
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="mt-6 space-y-4 font">
          {currentComments.map((comment: Feedback) => (
            <div key={comment.feedbackId} className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-light">
                  {comment.author.name}{" "}
                  <span className="text-secondaryColour font-bold">{comment.author.type}</span>
                </div>

                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.creationDate), { addSuffix: true })}
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm font-light">{comment.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <Pagination className="mt-6 flex justify-center space-x-2">
          <Button
            variant= "outline"
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, index) => (
              <PaginationItem
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "text-white" : ""}
              >
                <PaginationLink>{index + 1}</PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
          <Button
            variant= "outline"
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Pagination>
      </div>
    </div>
  );
};

export default PostsContent;
