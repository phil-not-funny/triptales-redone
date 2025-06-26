"use client";

import { useState } from "react";
import { PostProps } from "./Post";
import { Button } from "../ui/button";
import { Heart, MessageCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import PostService from "@/lib/services/postService";
import { useRouter } from "next/navigation";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import useUser from "@/hooks/useUser";

export const PostControls: React.FC<PostProps> = ({ post, embed }) => {
  const [liked, setLiked] = useState<boolean>(post.userLiked);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount);
  const router = useRouter();

  const { loggedIn } = useUser();

  const handleViewMore = () => {
    router.push(`/post/${post.guid}`);
  };

  const handleLike = async () => {
    const response = await PostService.likePost(post.guid);
    if (response) {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
      toast.success(`${newLiked ? "Liked" : "Unliked"} the post successfully!`);
    } else {
      toast.error("Failed to like the post. Please try again later.");
    }
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <Button
          variant={"ghost"}
          disabled={!loggedIn}
          className="text-gray-600 transition-colors duration-200 hover:text-rose-500"
          onClick={handleLike}
        >
          <Heart className={liked ? "fill-red-500 text-red-500" : undefined} />
          {likesCount} Like{likesCount !== 1 ? "s" : ""}
        </Button>
        <div className="flex items-center text-sm text-gray-400">
          <MessageCircle className="h-4 w-4" />
          <span className="ml-2">
            {post.commentsCount} Comment{post.commentsCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
      {embed ? (
        <Button
          variant={"default"}
          className="hover:text-white"
          onClick={handleViewMore}
        >
          View More
        </Button>
      ) : null}
    </>
  );
};

export const PostSettings: React.FC<PostProps> = ({ post, user }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await PostService.deletePost(post.guid);
    if (response) {
      toast.success("Post deleted successfully!");
      router.push("/user/" + user?.username);
    } else {
      toast.error("Failed to delete the post. Please try again later.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className="absolute top-4 right-4 h-7 w-7">
          <Settings className="!h-5 !w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col items-start justify-center gap-2">
        <h3 className="text-base font-semibold uppercase">Quick Settings</h3>
        <Dialog>
          <DialogTrigger>
            <Button variant={"destructive"} size={"sm"}>
              Delete this Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete this
                post and remove its data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex w-full flex-row items-center justify-between">
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={handleDelete}
                  variant={"destructive"}
                >
                  Permanently Delete
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="button" variant={"outline"}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
};
