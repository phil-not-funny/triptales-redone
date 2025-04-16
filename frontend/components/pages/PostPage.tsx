"use client";

import PostService from "@/lib/services/postService";
import { PostResponse } from "@/types/RequestTypes";
import { useEffect, useState } from "react";
import Loading from "../top/Loading";
import Sorry from "../low/Sorry";
import Post from "../low/Post";

interface PostPageProps {
  guid: string;
}

const PostPage: React.FC<PostPageProps> = ({ guid }) => {
  const [post, setPost] = useState<PostResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const init = async () => {
    const response = await PostService.getPost(guid);
    if (response.success) setPost(response.data);
    else setPost(null);
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return loading ? (
    <Loading />
  ) : !post ? (
    <Sorry>The post you were looking for doesn't exist.</Sorry>
  ) : (
    <Post embed={false} post={post} />
  );
};

export default PostPage;
