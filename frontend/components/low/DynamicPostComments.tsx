"use client";

import {
  PostCommentResponse,
  PostResponse,
} from "@/types/RequestTypes";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import PostService from "@/lib/services/postService";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { MessageCirclePlus } from "lucide-react";
import { Button } from "../ui/button";
import Avatar from "./Avatar";
import useUser from "@/hooks/useUser";
import { useTranslations } from 'next-intl';

interface Props {
  post: PostResponse;
}

const DynamicPostComments: React.FC<Props> = ({ post }) => {
  const [commentContent, setCommentContent] = useState<string>("");
  const [comments, setComments] = useState<PostCommentResponse[]>([]);
  const { user } = useUser();
  const t = useTranslations("Comment");
  const tCommon = useTranslations("Common");

  const init = async () => {
    const response = await PostService.getPost(post.guid);
    if (response.success && response.data != null) {
      setComments(response.data.comments);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await PostService.commentPost({
      content: commentContent,
      post: post!.guid,
    });
    if (response) {
      setCommentContent("");
      setComments((prev) => [response, ...prev]);
      toast.success(t("postSuccess"));
    } else {
      toast.error(t("postError"));
    }
  };

  const handleDeleteComment = async (comment: PostCommentResponse) => {
    const response = await PostService.deleteComment(comment.guid);
    if (response) {
      setComments((prev) => prev.filter((c) => c.guid !== comment.guid));
      toast.success(t("deleteSuccess"));
    } else {
      toast.error(t("deleteError"));
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <Card className="mx-auto mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:w-2xl">
      <CardHeader className="p-0">
        <h3 className="text-lg font-semibold text-gray-800">{tCommon("comments")}</h3>
      </CardHeader>
      <CardContent className="p-0">
        {Boolean(user) && (
          <form onSubmit={handleCommentSubmit} className="mt-4">
            <div className="flex space-x-3">
              <Avatar user={user!} />
              <div className="flex-1">
                <Textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder={tCommon("writeComment")}
                  className="w-full resize-none"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <Button type="submit" size="sm">
                    <MessageCirclePlus /> {tCommon("postComment")}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}
        {comments.length > 0 ? (
          <div className="mt-6">
            {comments.map((comment) => (
              <Comment
                post={post}
                key={comment.guid}
                handleDeleteComment={handleDeleteComment}
                comment={comment}
              />
            ))}
          </div>
        ) : (
          <p className="mt-6 text-gray-500">{tCommon("noCommentsYet")}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicPostComments;
