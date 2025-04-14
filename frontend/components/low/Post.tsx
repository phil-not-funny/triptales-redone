"use client";

import { Calendar, Heart } from "lucide-react";
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
import { PostResponse } from "@/types/RequestTypes";
import { formatDateString } from "@/lib/utils";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";

interface PostProps {
  post: PostResponse;
  embed?: boolean;
}

const Post: React.FC<PostProps> = ({ post, embed = true }) => {
  const { loggedIn } = useUser();
  const router = useRouter();

  const handleViewMore = () => {
    router.push(`/post/${post.guid}`);
  };

  const handleLike = () => {
    // implement like functionality
  };

  return (
    <Card className="mx-auto mb-6 gap-0 overflow-hidden rounded-xl border border-gray-100 bg-white py-0 shadow-sm transition-shadow duration-300 hover:shadow-md lg:w-2xl">
      <CardHeader className="border-b border-gray-100 p-6">
        <CardTitle className="mb-2 text-2xl font-semibold text-gray-800">
          {post.title}
        </CardTitle>
        <div className="flex items-center text-sm text-gray-600 p-3">
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
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-gray-100 bg-gray-50 !p-3">
        <Button
          variant={"ghost"}
          disabled={!loggedIn}
          className="text-gray-600 transition-colors duration-200 hover:text-rose-500"
          onClick={handleLike}
        >
          <Heart />
          {post.likesCount} Likes
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
