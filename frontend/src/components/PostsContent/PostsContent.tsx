//TODO: Connect and fetch from sessionId

import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Define the types for Post and Comment
interface Comment {
  id: number;
  username: string;
  role: string;
  content: string;
  date: Date;
}

interface Post {
  id: number;
  title: string;
  description: string;
  date: string;
  likes: number;
  comments: Comment[];
}

const PostsContent: React.FC = () => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState<string>("");

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [liked, setLiked] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  // MOCK DATA
  const dummyPost: Post = {
    id: 1,
    title: "Training Session Forum Example",
    date: "2024-12-05T12:30:00",
    description:
      "This is a sample description for the session. It contains details about the event or post.",
    likes: 23,
    comments: [
      {
        id: 1,
        username: "User1",
        role: "Player",
        content: "This is a sample comment.",
        date: new Date("2024-12-29T12:30:00"),
      },
      {
        id: 2,
        username: "User2",
        role: "Player",
        content: "Another comment here, really like this post!",
        date: new Date("2024-12-29T13:00:00"),
      },
    ],
  };

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setTimeout(() => {
        setPost(dummyPost);
        setLoading(false);
      });
    };

    fetchPost();
  }, []);

  const handleAddComment = async () => {
    if (newComment.trim() && post) {
      const newCommentObj: Comment = {
        id: post.comments.length + 1,
        username: "CurrentUser",
        role: "Player",
        content: newComment,
        date: new Date(),
      };

      const updatedPost = {
        ...post,
        comments: [...post.comments, newCommentObj],
      };
      setPost(updatedPost);
      setNewComment("");
    }
  };

  const toggleLike = async () => {
    if (post) {
      const updatedLikes = liked ? post.likes - 1 : post.likes + 1;
      const updatedPost = {
        ...post,
        likes: updatedLikes,
      };

      setPost(updatedPost);
      setLiked(!liked);
    }
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = post?.comments.slice(
    indexOfFirstComment,
    indexOfLastComment,
  );

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading || !post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-4 min-h-screen pb-20">
      <Button
        className="rounded-full w-2"
        variant="outline"
        onClick={() => navigate(-1)}
      >
        <MoveLeft />
      </Button>

      <div className="container mx-auto py-6">
        <Card className="w-full mx-auto">
          <CardHeader>
            <div className="my-4">
              <h1 className="font-bold text-lg text-primaryColour">
                {post.title}
              </h1>
              <p className="text-sm text-primaryColour">
                {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="font-light text-sm text-primaryColour">
                {post.description}
              </p>

              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  className={`flex items-center space-x-1 bg-transparent ${liked ? "text-secondaryColour" : "text-primaryColour"}`}
                  onClick={toggleLike}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes}</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comments.length}</span>
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

        {/* Comments Section with Pagination */}
        <div className="mt-6 space-y-4 font">
          {currentComments?.map((comment: Comment) => (
            <div key={comment.id} className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="text-sm font-light">
                  {comment.username}{" "}
                  <span className="text-secondaryColour font-bold">
                    {comment.role}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <div className="mt-2">
                <p className="text-sm font-light">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <Pagination className="mt-6 flex justify-center space-x-2">
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          >
            Previous
          </PaginationPrevious>
          <PaginationContent>
            {Array.from(
              { length: Math.ceil(post.comments.length / commentsPerPage) },
              (_, index) => (
                <PaginationItem
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  <PaginationLink>{index + 1}</PaginationLink>
                </PaginationItem>
              ),
            )}
          </PaginationContent>
          <PaginationNext
            onClick={() =>
              currentPage < Math.ceil(post.comments.length / commentsPerPage) &&
              handlePageChange(currentPage + 1)
            }
          >
            Next
          </PaginationNext>
        </Pagination>
      </div>
    </div>
  );
};

export default PostsContent;
