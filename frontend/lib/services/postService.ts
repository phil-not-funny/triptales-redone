import {
  CreatePostRequest,
  isPostResponse,
  isPostResponseSmall,
  PostResponse,
  PostResponseSmall,
} from "@/types/RequestTypes";
import api from "../api";

type GetRandomPostsClientResponse = {
  success: boolean;
  data: PostResponseSmall[];
};

const getRandom = async (
  number: number | undefined = 10,
): Promise<GetRandomPostsClientResponse> => {
  try {
    const response = await api.get<PostResponseSmall[]>(
      `/Post/random?size=${number}`,
    );
    if (response.status === 200 && isPostResponseSmall(response.data[0]))
      return {
        success: true,
        data: response.data,
      };
    else throw new Error("Invalid response structure");
  } catch {
    return {
      success: false,
      data: [],
    };
  }
};

const createPost = async (data: CreatePostRequest): Promise<string | null> => {
  try {
    const response = await api.post<string>("/Post", data);
    if (response.status === 200) return response.data;
    else return null;
  } catch {
    return null;
  }
};

type GetPostClientResponse = {
  success: boolean;
  data: PostResponse | null;
};

const getPost = async (guid: string): Promise<GetPostClientResponse> => {
  try {
    const response = await api.get<PostResponse>(`/Post/${guid}`);
    console.log(response.data);
    
    if (response.status === 200 && isPostResponse(response.data))
      return { success: true, data: response.data };
    else throw new Error("Invalid response structure");
  } catch {
    return { success: false, data: null };
  }
};

const likePost = async (guid: string): Promise<boolean> => {
  try {
    const response = await api.post(`/Post/like/${guid}`);
    if (response.status === 200) return true;
    else return false;
  } catch {
    return false;
  }
}

const PostService = { getRandom, createPost, getPost, likePost };

export default PostService;
