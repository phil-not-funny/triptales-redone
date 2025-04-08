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
import { useEffect } from "react";
import { PostResponse } from "@/types/RequestTypes";
import { convertToDate } from "@/lib/utils";

interface PostProps {
  post: PostResponse;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { loggedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log(post);
  }, [post]);

  const formatDate = (date: string): string => {
    return convertToDate(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewMore = () => {
    router.push(`/posts/${post.guid}`);
  };

  const handleLike = () => {
    // implement like functionality
  };

  return (
    <Card className="mx-auto mb-6 lg:w-2xl gap-0 overflow-hidden rounded-xl border border-gray-100 bg-white py-0 shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Header Section */}
      <CardHeader className="border-b border-gray-100 p-6">
        <CardTitle className="mb-2 text-2xl font-semibold text-gray-800">
          {post.title}
        </CardTitle>
        <div className="flex items-center text-sm text-gray-600">
          <span>By {post.author.username}</span>
          <span className="mx-2">•</span>
          <span>Posted on {formatDate(post.createdAt)}</span>
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardContent className="p-6">
        <p className="mb-4 leading-relaxed text-gray-700">{post.description}</p>

        {/* Date Range */}
        <div className="flex items-center space-x-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <span className="font-medium">Start:</span>{" "}
            {formatDate(post.startDate)}
          </div>
          <div className="h-2 w-2 rounded-full bg-gray-300"></div>
          <div>
            <span className="font-medium">End:</span> {formatDate(post.endDate)}
          </div>
        </div>
      </CardContent>

      {/* Footer Section */}
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
        <Button
          variant={"default"}
          className="hover:text-white"
          onClick={handleViewMore}
        >
          View More
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Post;
