import {
  CommentPostRequest,
  CreatePostRequest,
  isPostCommentResponse,
  isPostResponse,
  isPostResponseSmall,
  PostCommentResponse,
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
};

const commentPost = async (
  data: CommentPostRequest,
): Promise<PostCommentResponse | null> => {
  try {
    const response = await api.post(`/Comment`, data);
    if (response.status === 200 && isPostCommentResponse(response.data))
      return response.data;
    else throw new Error("Invalid response structure");
  } catch {
    return null;
  }
};

const deleteComment = async (guid: string): Promise<boolean> => {
  try {
    const response = await api.delete(`/Comment/${guid}`);
    if (response.status === 204) return true;
    else return false;
  } catch {
    return false;
  }
};

const likeComment = async (guid: string): Promise<boolean> => {
  try {
    const response = await api.post(`/Comment/like/${guid}`);
    if (response.status === 200) return true;
    else return false;
  } catch {
    return false;
  }
};

const getComment = async (
  guid: string,
): Promise<PostCommentResponse | null> => {
  try {
    const response = await api.get<PostCommentResponse>(`/Comment/${guid}`);
    if (response.status === 200 && isPostCommentResponse(response.data))
      return response.data;
    else throw new Error("Invalid response structure");
  } catch {
    return null;
  }
};

const PostService = {
  getRandom,
  createPost,
  getPost,
  likePost,
  commentPost,
  deleteComment,
  likeComment,
  getComment
};

export default PostService;
