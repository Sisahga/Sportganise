//TODO: fix the handlelike and handlecomment UI.
import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Trash2} from "lucide-react"; 
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

import BackButton from "../ui/back-button";
import { useLocation } from "react-router";
import { getCookies } from "@/services/cookiesService";
import { Feedback} from "@/types/postdetail";
import { usePostLike } from "@/hooks/usePostLike";
import { useFeedback } from "@/hooks/useFeedback";
import { usePost } from "@/hooks/usePost";

const canEditOrDelete = (creationDate: string) => {
  const creationTime = new Date(creationDate).getTime();
  const currentTime = Date.now();
  const timeDiff = currentTime - creationTime;
  const timeLimit = 30 * 60 * 1000; 
  return timeDiff <= timeLimit;
};


const PostsContent: React.FC = () => {
  const location = useLocation();


  const [likedposts, setLikedposts] = useState<Set<number>>(new Set());
  const postId = location.state?.postId;
  const user = getCookies();
  const [liked, setLiked] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;


  const { post, loading: postLoading, error } = usePost(postId);
  const { likePost, unlikePost} = usePostLike();
  const { addFeedback, deleteFeedback} = useFeedback();
  const [comments, setComments] = useState<Feedback[]>(post?.feedbackList || []);

  const handleLike = (postId: number) => {
    setLikedposts((prev) => {
      const newLikedPosts = new Set(prev);

      if (liked) {
        newLikedPosts.delete(postId);
        setLiked(false);
        unlikePost(postId,user.accountId);
      } else {
        newLikedPosts.add(postId);
        setLiked(true);
        likePost(postId,user.accountId);
      }
      return newLikedPosts;
    });
  };

  const handleAddComment = () => {
    if (!post || !newComment.trim() || user === null || user.type === null) return; // Check for null user.type
  
    const newCommentObj: Feedback = {
      feedbackId: Date.now(),
      author: { 
        accountId: user.accountId ?? 0, 
        name: `${user.firstName} ${user.lastName}`, 
        type: user.type,  
        pictureUrl: user.pictureUrl || "" 
      },
      description: newComment,
      creationDate: new Date().toISOString(),
    };
  
    setComments((prevComments) => [newCommentObj, ...prevComments]);
    setNewComment(""); 
    setCurrentPage(1);
  
    addFeedback(postId, user.accountId ?? 0, newComment);
  };
  

  const handleDeleteComment = (feedbackId: number) => {
    if (!post) return; 

    setComments((prevComments) => prevComments.filter(
      (feedback) => feedback.feedbackId !== feedbackId
    ));


    deleteFeedback(postId, feedbackId);
    console.log("Deleting comment for Feedback ID:", feedbackId);
  };

  useEffect(() => {
    if (post && post.feedbackList) {
      setComments(post.feedbackList); 
    }
  }, [post]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  if (postLoading) {
    return (
      <div className="py-4 min-h-screen pb-20">
        <BackButton />
        <div className="container mx-auto py-6">
          <p>Loading post...</p>
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

  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const currentComments = comments.slice(
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
                  className={`flex items-center space-x-1 ${likedposts.has(post.postId) ? "text-secondaryColour" : "text-primaryColour"}`}
                  onClick={() => handleLike(post.postId)}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likeCount + (likedposts.has(post.postId) ? 1 : 0)}</span>
                </Button>

                <Button variant="outline" className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{comments.length}</span>
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
            />
          </div>

          {(newComment.trim()) && (
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
    <Card key={comment.feedbackId} className="p-4 bg-white rounded-lg shadow-sm">
      <CardHeader className="p-0">
        <div className="flex items-center justify-between">
          <div className="text-sm font-light">
            {comment.author.name}{" "}
            <span className="text-secondaryColour font-bold">{comment.author.type}</span>
          </div>

          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(comment.creationDate), { addSuffix: true })}
          </div>
        </div>
      </CardHeader>

      <CardContent  className=" p-0">
        <div className=" mt-2">
          <CardDescription className="text-sm font-light">{comment.description}</CardDescription>
        </div>

            {/* Conditionally render the edit and delete buttons */}
      {canEditOrDelete(comment.creationDate) && (
        <div className=" flex justify-end mt-auto">
          <Button
            variant="destructive"
            className="w-2 flex items-center space-x-1"
            onClick={() => handleDeleteComment(comment.feedbackId)}
          >
            <Trash2 className="w-4 h-4" />
           
          </Button>
        </div>
      )}
      </CardContent>

  
    </Card>
  ))}
</div>


        {/* Pagination Controls */}
        <Pagination className="mt-6 flex justify-center space-x-2">
          <Button
            variant="outline"
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
            variant="outline"
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
