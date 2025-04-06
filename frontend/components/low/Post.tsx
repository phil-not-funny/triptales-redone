"use client";

import { Post as PostType } from "@/types/ModelTypes";

interface PostProps {
  post: PostType;
}

const Post: React.FC<PostProps> = ({ post }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h6 className="text-2xl font-bold">{post.title}</h6>
    </div>
  );
};

export default Post;
