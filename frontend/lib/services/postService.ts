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
import { HttpStatusCode } from "axios";
import api from "../api";
import { fetchValidated, succeeds } from "./requestHelpers";

type GetRandomPostsClientResponse = {
  success: boolean;
  data: PostResponseSmall[];
};

type GetPostClientResponse = {
  success: boolean;
  data: PostResponse | null;
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

const getPost = async (guid: string): Promise<GetPostClientResponse> => {
  const post = await fetchValidated(
    () => api.get(`/Post/${guid}`),
    isPostResponse,
  );
  return { success: post !== null, data: post };
};

const likePost = (guid: string): Promise<boolean> =>
  succeeds(() => api.post(`/Post/like/${guid}`));

const commentPost = (
  data: CommentPostRequest,
): Promise<PostCommentResponse | null> =>
  fetchValidated(() => api.post(`/Comment`, data), isPostCommentResponse);

const deleteComment = (guid: string): Promise<boolean> =>
  succeeds(() => api.delete(`/Comment/${guid}`), HttpStatusCode.NoContent);

const likeComment = (guid: string): Promise<boolean> =>
  succeeds(() => api.post(`/Comment/like/${guid}`));

const getComment = (guid: string): Promise<PostCommentResponse | null> =>
  fetchValidated(() => api.get(`/Comment/${guid}`), isPostCommentResponse);

const deletePost = (guid: string): Promise<boolean> =>
  succeeds(() => api.delete(`/Post/${guid}`), HttpStatusCode.NoContent);

/**
 * Uploads the title picture of a post, or the picture of one of its days
 * when `dayIndex` is given.
 */
const uploadPicture = (
  guid: string,
  picture: File,
  dayIndex?: number,
): Promise<boolean> => {
  const formData = new FormData();
  formData.append("Picture", picture);
  const url =
    dayIndex === undefined
      ? `/Post/upload/${guid}`
      : `/Post/upload/${guid}/day/${dayIndex}`;
  return succeeds(() =>
    api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

const PostService = {
  getRandom,
  createPost,
  getPost,
  likePost,
  deletePost,
  commentPost,
  deleteComment,
  likeComment,
  getComment,
  uploadPicture,
};

export default PostService;
