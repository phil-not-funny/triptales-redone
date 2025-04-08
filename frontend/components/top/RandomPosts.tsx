"use client";

import PostService from "@/lib/services/postService";
import { PostResponse } from "@/types/ReqeuestTypes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Post from "../low/Post";
import Loading from "./Loading";

const RandomPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const init = async () => {
    const response = await PostService.getRandom();
    console.log(response);

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
    posts.map((p) => <Post key={p.guid} post={p} />)
  ) : (
    <div className="flex min-h-[200px] flex-col items-center justify-center p-4 text-gray-800">
      <pre className="mb-4 text-4xl">:(</pre>
      <p className="text-center">
        We were unable to fetch posts from our server.
        <br />
        Please try again later or contact support if the problem persists.
      </p>
    </div>
  );
};

export default RandomPosts;
