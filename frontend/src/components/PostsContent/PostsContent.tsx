import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import BackButton from "../ui/back-button";
import { useLocation } from "react-router";
import { Feedback } from "@/types/postdetail";
import { usePostLike } from "@/hooks/usePostLike";
import { useFeedback } from "@/hooks/useFeedback";
import { usePost } from "@/hooks/usePost";
import log from "loglevel";
import { Badge } from "../ui/badge";
import useGetCookies from "@/hooks/useGetCookies.ts";

const PostsContent: React.FC = () => {
  const commentsPerPage = 5;
  const location = useLocation();
  const postId = location.state?.postId;

  const { userId, cookies, preLoading } = useGetCookies();

  const { post, loading: postLoading, error, fetchPost } = usePost(postId);
  const { likePost, unlikePost } = usePostLike();
  const { addFeedback, deleteFeedback } = useFeedback();

  const [newComment, setNewComment] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [comments, setComments] = useState<Feedback[]>(
    post?.feedbackList || [],
  );
  const [liked, setLiked] = useState<boolean>(post ? post.liked : false);
  const [likeCount, setLikeCount] = useState<number>(post?.likeCount || 0);

  useEffect(() => {
    if (!preLoading && cookies) {
      fetchPost(userId).then((_) => _);
    }
  }, [preLoading, cookies, fetchPost]);

  const canDelete = (creationDate: string, commentAuthorId: number) => {
    const creationTime = new Date(creationDate).getTime();
    const currentTime = Date.now();
    const timeDiff = currentTime - creationTime;
    const timeLimit = 30 * 60 * 1000;
    return timeDiff <= timeLimit && commentAuthorId === userId;
  };

  const handleLike = (postId: number) => {
    if (!post) {
      log.error("Post is null or undefined");
      return;
    }

    if (liked) {
      setLiked(false);
      setLikeCount(likeCount - 1);
      log.debug(`Post ${postId} disliked by user ${userId}`);
      unlikePost(postId, userId).then((_) => _);
    } else {
      setLiked(true);
      setLikeCount(likeCount + 1);
      log.debug(`Post ${postId} liked by user ${userId}`);
      likePost(postId, userId).then((_) => _);
    }
  };

  const handleAddComment = async () => {
    if (
      !post ||
      !newComment.trim() ||
      cookies === null ||
      cookies?.type === null
    )
      return;
    else if (cookies && cookies.type) {
      const tempId = Date.now();
      const newCommentObj: Feedback = {
        feedbackId: tempId,
        author: {
          accountId: userId ?? 0,
          name: `${cookies.firstName} ${cookies.lastName}`,
          type: cookies.type,
          pictureUrl: cookies.pictureUrl || "",
        },
        description: newComment,
        creationDate: new Date().toISOString(),
      };

      setComments((prevComments) => [newCommentObj, ...prevComments]);
      setNewComment("");
      setCurrentPage(1);

      try {
        const feedbackId = await addFeedback(postId, userId ?? 0, newComment);
        log.info(`Comment added with Feedback ID: ${feedbackId}`);
        if (feedbackId) {
          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.feedbackId === tempId
                ? { ...comment, feedbackId }
                : comment,
            ),
          );
        }
      } catch (err) {
        log.error("Failed to add comment:", err);
      }
    } else {
      log.error("Cookies are null or type is null");
    }
  };

  const handleDeleteComment = (feedbackId: number) => {
    if (!post) return;

    setComments((prevComments) =>
      prevComments.filter((feedback) => feedback.feedbackId !== feedbackId),
    );

    deleteFeedback(postId, feedbackId).then((_) => _);
    log.info("Deleting comment for Feedback ID:", feedbackId);
  };

  useEffect(() => {
    if (post && post.feedbackList) {
      setComments(post.feedbackList);
      setLiked(post.liked);
      setLikeCount(post.likeCount || 0);
    }
  }, [post]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getBadgeVariant = (authorType: string) => {
    switch (authorType.toLowerCase()) {
      case "general":
        return { variant: "default" } as const;
      case "player":
        return { variant: "default" } as const;
      case "admin":
        return { variant: "outline" } as const;
      case "coach":
        return { variant: "secondary" } as const;
      default:
        return { variant: "destructive" } as const;
    }
  };

  if (preLoading || postLoading) {
    return (
      <div className="py-4 min-h-screen pb-20">
        <BackButton />
        <div className="container mx-auto py-6">
          <p>
            Loading post <LoaderCircle className="animate-spin h-6 w-6" />
          </p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="py-4 min-h-screen pb-20">
        <BackButton />
        <div className="container mx-auto py-6">
          <p>Error loading post. Please try again later.</p>
        </div>
      </div>
    );
  }

  //Pagination logic
  const startIndex = (currentPage - 1) * commentsPerPage;
  const currentComments = comments.slice(
    startIndex,
    startIndex + commentsPerPage,
  );
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  return (
    <div className="py-4 min-h-screen pb-20">
      <BackButton />

      {/*POSTS*/}
      <div className="container mx-auto py-6">
        <Card className="w-full mx-auto">
          <CardHeader>
            <div className="my-4">
              <h1 className="font-bold text-lg text-primaryColour">
                {post.title}
              </h1>
              <p className="text-sm text-primaryColour">
                {formatDistanceToNow(new Date(post.creationDate), {
                  addSuffix: true,
                })}
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
                  className={`flex items-center space-x-1 ${liked ? "text-secondaryColour" : "text-primaryColour"}`}
                  onClick={() => handleLike(post.postId)}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{likeCount}</span>
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center space-x-1"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments.length}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/*INPUT FOR NEW COMMENT */}
        <div className="mt-6">
          <div className="w-full mb-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={1}
              className="w-full border p-3 rounded-md resize-none min-h-[40px] focus:ring-2 focus:ring-blue-400 transition-all duration-300"
              placeholder="Leave a feedback..."
            />
          </div>

          {newComment.trim() && (
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

        {/* COMMENTS SECTION */}
        <div className="mt-8 space-y-4 font">
          <h2 className="text-lg font-semibold">Community Feedbacks</h2>
          {currentComments.map((comment: Feedback) => (
            <Card
              key={comment.feedbackId}
              className="p-4 bg-white rounded-lg shadow-sm"
            >
              <CardHeader className="p-0">
                <div className="flex items-center justify-between ">
                  <div className="text-sm font-light flex">
                    <span>{comment.author.name}</span>
                    <Badge
                      {...getBadgeVariant(comment.author.type)}
                      className="ml-1 h-5"
                    >
                      {comment.author.type.toLowerCase()}
                    </Badge>
                  </div>

                  <div className="text-xs text-gray-500 ">
                    {formatDistanceToNow(new Date(comment.creationDate), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </CardHeader>

              <CardContent className=" p-0">
                <div className=" mt-2">
                  <CardDescription className="text-sm font-light">
                    {comment.description}
                  </CardDescription>
                </div>

                {/* Conditionally render the delete button */}
                {canDelete(comment.creationDate, comment.author.accountId) && (
                  <div className=" flex justify-end mt-auto">
                    <Button
                      variant="destructive"
                      className="h-8"
                      onClick={() => handleDeleteComment(comment.feedbackId)}
                    >
                      <Trash2 className="w-2 h-2" />
                      <span className="text-xs">Delete</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PAGINATION */}
        <Pagination className="mt-2 pb-20">
          <PaginationContent>
            <Button
              variant="outline"
              className="text-primaryColour"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            >
              <ChevronLeft></ChevronLeft>
            </Button>

            <PaginationItem className="m-3">
              <span className="text-sm">Page {currentPage}</span>
            </PaginationItem>

            <Button
              variant="outline"
              className="text-primaryColour"
              disabled={comments.length <= 5 || currentPage === totalPages}
              onClick={() =>
                handlePageChange(Math.min(currentPage + 1, totalPages))
              }
            >
              <ChevronRight></ChevronRight>
            </Button>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default PostsContent;
