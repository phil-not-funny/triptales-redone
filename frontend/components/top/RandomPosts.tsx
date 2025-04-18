"use client";

import PostService from "@/lib/services/postService";
import { PostResponseSmall } from "@/types/RequestTypes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Post from "../low/Post";
import Loading from "./Loading";
import Sorry from "../low/Sorry";

const RandomPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostResponseSmall[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const init = async () => {
    const response = await PostService.getRandom();

    if (response.success) setPosts(response.data);
    else toast.error("Failed to Fetch Posts from Server!");
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  return loading ? (
    <Loading />
  ) : posts.length ? (
    posts.map((p) => <Post key={p.guid} post={p} embed={true} />)
  ) : (
    <Sorry>We were unable to fetch posts from our server.</Sorry>
  );
};

export default RandomPosts;
