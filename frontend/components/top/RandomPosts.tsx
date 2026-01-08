"use client";

import PostService from "@/lib/services/postService";
import { PostResponseSmall } from "@/types/RequestTypes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Post from "../low/Post";
import Loading from "./Loading";
import Sorry from "../low/Sorry";
import { useTranslations } from 'next-intl';

const RandomPosts: React.FC = () => {
  const [posts, setPosts] = useState<PostResponseSmall[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const t = useTranslations("Home");
  const tToast = useTranslations("Toasts");

  const init = async () => {
    const response = await PostService.getRandom();

    if (response.success) setPosts(response.data);
    else {
      toast.error(tToast("fetchPostsError"));
    }
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
    <Sorry>{t("RandomPosts.error")}</Sorry>
  );
};

export default RandomPosts;
