"use client";

import { Calendar, Heart, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { useUser } from "../providers/UserProvider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useRouter } from "next/navigation";
import { PostResponse, PostResponseSmall } from "@/types/RequestTypes";
import { beautifyDate, formatDateString } from "@/lib/utils";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useState } from "react";
import PostService from "@/lib/services/postService";
import { toast } from "sonner";
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

interface EmbeddedPostProps {
  // props when embed is true
  post: PostResponseSmall;
  embed: true;
}
interface FullPostProps {
  // props when embed is false
  post: PostResponse;
  embed: false;
}
type PostProps = EmbeddedPostProps | FullPostProps;

const PostSettings: React.FC<{ onDelete: () => Promise<void> }> = ({
  onDelete,
}) => {
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
                  onClick={onDelete}
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

const Post: React.FC<PostProps> = ({ post, embed }) => {
  const { user } = useUser();
  const [liked, setLiked] = useState<boolean>(post.userLiked);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount);

  const { loggedIn } = useUser();
  const router = useRouter();

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
    <Card className="mx-auto mb-6 gap-0 overflow-hidden rounded-xl border border-gray-100 bg-white py-0 shadow-sm transition-shadow duration-300 hover:shadow-md lg:w-2xl">
      <CardHeader className="relative border-b border-gray-100 p-6">
        <CardTitle className="mb-2 text-2xl font-semibold text-gray-800">
          {post.title}
        </CardTitle>
        {post.author.guid === user?.guid && (
          <PostSettings onDelete={handleDelete} />
        )}
        <div className="flex items-center p-3 text-sm text-gray-600">
          <span>
            By{" "}
            <Link
              href={`/user/${post.author.username}`}
              className="hover:underline"
            >
              {post.author.username}
            </Link>
          </span>
          <span className="mx-2">•</span>
          <span>Posted on {formatDateString(post.createdAt)}</span>
        </div>
        <div className="flex items-center space-x-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <span className="font-medium">Start:</span>{" "}
            {formatDateString(post.startDate)}
          </div>
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          <div>
            <span className="font-medium">End:</span>{" "}
            {formatDateString(post.endDate)}
          </div>
        </div>
      </CardHeader>
      <CardContent data-color-mode="light" className="p-6">
        <MDEditor.Markdown
          source={post.description}
          className="leading-relaxed text-gray-700"
        />
        {!embed && post.days && post.days.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              Timeline of Days
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {post.days.map((day, index) => (
                <AccordionItem key={index} value={`day-${index}`}>
                  <AccordionTrigger className="text-left">
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium text-gray-800">
                        Day {index + 1}: {day.title}
                      </span>
                      <span className="text-sm text-gray-500">
                        {beautifyDate(day.date)}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700">{day.description}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-gray-100 bg-gray-50 !p-3">
        <Button
          variant={"ghost"}
          disabled={!loggedIn}
          className="text-gray-600 transition-colors duration-200 hover:text-rose-500"
          onClick={handleLike}
        >
          <Heart className={liked ? "fill-red-500 text-red-500" : undefined} />
          {likesCount} Like{likesCount !== 1 ? "s" : ""}
        </Button>
        {embed ? (
          <Button
            variant={"default"}
            className="hover:text-white"
            onClick={handleViewMore}
          >
            View More
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default Post;
