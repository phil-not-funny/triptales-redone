"use client";

import PostService from "@/lib/services/postService";
import { PostCommentResponse, PostResponse } from "@/types/RequestTypes";
import { useEffect, useState } from "react";
import Loading from "../top/Loading";
import Sorry from "../low/Sorry";
import Post from "../low/Post";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useUser } from "../providers/UserProvider";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { MessageCirclePlus } from "lucide-react";
import Comment from "../low/Comment";
import { toast } from "sonner";

interface PostPageProps {
  guid: string;
}

const PostPage: React.FC<PostPageProps> = ({ guid }) => {
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [commentContent, setCommentContent] = useState<string>("");
  const [comments, setComments] = useState<PostCommentResponse[]>([]);
  const [commentsCount, setCommentsCount] = useState<number>(0);

  const { loggedIn, user } = useUser();

  const init = async () => {
    const response = await PostService.getPost(guid);
    if (response.success && response.data != null) {
      setPost(response.data);

      setComments(response.data.comments);
      setCommentsCount(response.data.commentsCount);
    } else setPost(null);
    setLoading(false);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await PostService.commentPost(post!.guid, {
      content: commentContent,
    });
    if (response) {
      setCommentContent("");
      setCommentsCount((prev) => prev + 1);
      setComments((prev) => [response, ...prev]);
      toast.success("Comment posted successfully!");
    } else {
      toast.error("Failed to post comment. Please try again later.");
    }
  };

  const handleDeleteComment = async (comment: PostCommentResponse) => {
    const response = await PostService.deleteComment(post!.guid, comment.guid);
    if (response) {
      setComments((prev) => prev.filter((c) => c.guid !== comment.guid));
      toast.success("Comment deleted successfully!");
    } else {
      toast.error("Failed to delete comment. Please try again later.");
    }
  };

  useEffect(() => {
    init();
  }, []);

  return loading ? (
    <Loading />
  ) : !post ? (
    <Sorry>The post you were looking for doesn't exist.</Sorry>
  ) : (
    <div className="gap-6">
      <Post embed={false} post={post} />
      <Card className="mx-auto mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:w-2xl">
        <CardHeader className="p-0">
          <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
        </CardHeader>
        <CardContent className="p-0">
          {loggedIn && (
            <form onSubmit={handleCommentSubmit} className="mt-4">
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.username.toUpperCase()[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full resize-none"
                    rows={3}
                  />
                  <div className="mt-2 flex justify-end">
                    <Button type="submit" size="sm">
                      <MessageCirclePlus /> Post Comment
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
          {comments.length > 0 ? (
            <div className="mt-6">
              {comments.map((comment) => (
                <Comment post={post} key={comment.guid} handleDeleteComment={handleDeleteComment} comment={comment} />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-gray-500">No comments yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PostPage;
