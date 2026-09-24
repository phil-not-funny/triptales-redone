"use client";

import { MessageCirclePlus } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import useUser from "@/hooks/useUser";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface CommentReplyFormProps {
  /** Called with the entered text when the form is submitted. */
  onSubmit: (content: string) => void | Promise<void>;
  /** Called when the user dismisses the form. */
  onCancel: () => void;
}

/**
 * Inline form for writing a reply to a comment. The entered text is local
 * state and therefore discarded whenever the form is unmounted.
 */
const CommentReplyForm: React.FC<CommentReplyFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [content, setContent] = useState<string>("");
  const { user } = useUser();
  const tCommon = useTranslations("Common");

  const isEmpty = content.trim().length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEmpty) return;
    return onSubmit(content);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{user?.username[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={tCommon("writeReply")}
            className="w-full resize-none"
            rows={3}
          />
          <div className="mt-2 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" size="sm" disabled={isEmpty}>
              <MessageCirclePlus /> {tCommon("postReply")}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentReplyForm;
