"use client";

import {
  Heart,
  MessageCircle,
  MessageCirclePlus,
  Minus,
  Plus,
} from "lucide-react";
import { PostCommentResponse, PostResponse } from "@/types/RequestTypes";
import { formatDateString } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import PostService from "@/lib/services/postService";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { useUser } from "../providers/UserProvider";
import { Textarea } from "../ui/textarea";

interface CommentProps {
  comment: PostCommentResponse;
  post: PostResponse;
  handleDeleteComment: (c: PostCommentResponse) => void;
  level?: number;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  post,
  handleDeleteComment,
  level = 0,
}) => {
  const { loggedIn, user } = useUser();
  const [liked, setLiked] = useState<boolean>(comment.userLiked);
  const [likesCount, setLikesCount] = useState<number>(comment.likesCount);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const [subComments, setSubComments] = useState<PostCommentResponse[]>(
    comment.comments || [],
  );

  const handleLike = async () => {
    const response = await PostService.likeComment(post.guid, comment.guid);
    if (response) {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    } else {
      toast.error("Failed to like the comment. Please try again later.");
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await PostService.commentPost(post.guid, {
      content: replyContent,
      parent: comment.guid,
    });
    if (response) {
      setSubComments((prev) => [response, ...prev]);
      setReplyContent("");
      setIsReplying(false);
      setIsExpanded(true);
      toast.success("Reply posted successfully!");
    } else {
      toast.error("Failed to post reply. Please try again later.");
    }
  };

  const handleDeleteSubComment = async (subComment: PostCommentResponse) => {
    const response = await PostService.deleteComment(
      post.guid,
      subComment.guid,
    );
    if (response) {
      setSubComments((prev) => prev.filter((c) => c.guid !== subComment.guid));
      toast.success("Comment deleted successfully!");
    } else {
      toast.error("Failed to delete comment. Please try again later.");
    }
  };

  const toggleReply = () => {
    setIsReplying(!isReplying);
    setReplyContent("");
  };

  const threadLineColor =
    level % 2 === 0 ? "border-gray-300" : "border-gray-400";

  return (
    <div className={`relative flex space-x-3 ${level > 0 ? "ml-6" : ""} mt-3`}>
      {level > 0 && (
        <div
          className={`absolute min-h-full w-px ${threadLineColor}`}
          style={{ left: "-9px", top: "12px" }}
        />
      )}
      <div className="flex-1">
        <div
          className={`rounded-lg p-3 ${
            level % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
          } border border-gray-200`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {comment.comments && comment.comments.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpand}
                  className="rounded-full text-gray-500"
                >
                  {isExpanded ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              )}
              <Link
                href={`/user/${comment.author.username}`}
                className="text-sm font-medium text-gray-800 hover:underline"
              >
                {comment.author.username}
              </Link>
            </div>
            <span className="text-xs text-gray-500">
              {formatDateString(comment.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-700">{comment.content}</p>
        </div>
        <div className="mt-2 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            disabled={!loggedIn}
            onClick={handleLike}
            className="text-gray-600 hover:text-rose-500"
          >
            <Heart
              className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span className="ml-1 text-xs">{likesCount}</span>
          </Button>
          <div className="flex items-center text-gray-600">
            <MessageCircle className="h-4 w-4" />
            <span className="ml-1 text-xs">{subComments.length}</span>
          </div>
          {loggedIn && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleReply}
              className="text-gray-600 hover:text-blue-500"
            >
              Reply
            </Button>
          )}
          {user?.guid === comment.author.guid && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteComment(comment)}
              className="text-gray-600 hover:text-red-500"
            >
              Delete
            </Button>
          )}
        </div>
        {isReplying && (
          <form onSubmit={handleReplySubmit} className="mt-3">
            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.username[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full resize-none"
                  rows={3}
                />
                <div className="mt-2 flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={toggleReply}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    <MessageCirclePlus /> Post Reply
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
        {subComments.length > 0 && isExpanded && (
          <div className="mt-2">
            {subComments.map((nestedComment, idx) => (
              <Comment
                post={post}
                key={nestedComment.guid}
                comment={nestedComment}
                handleDeleteComment={handleDeleteSubComment}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Comment;
