import { isPostResponse, PostResponse } from "@/types/ReqeuestTypes";
import api from "../api";

type GetRandomPostsClientResponse = {
  success: boolean;
  data: PostResponse[];
};

const getRandom = async (
  number: number | undefined = 10,
): Promise<GetRandomPostsClientResponse> => {
  try {
    const response = await api.get<PostResponse[]>(
      `/Post/random?size=${number}`,
    );
    if (response.status === 200 )
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

const PostService = { getRandom };

export default PostService;
