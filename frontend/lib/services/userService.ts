import {
  isUserDetailedResponse,
  isUserPrivateResponse,
  LoginRequest,
  RegisterRequest,
  UserDetailedResponse,
  UserPrivateResponse,
  UserPutFlavorRequest,
  UserUploadRequest,
} from "@/types/RequestTypes";
import api, { clearToken, setToken } from "../api";
import axios, { HttpStatusCode } from "axios";
import { fetchValidated, succeeds } from "./requestHelpers";

type RegisterClientResponse = {
  status: HttpStatusCode;
  message: string;
};

type LoginClientResponse = {
  status: HttpStatusCode;
  message: string;
  data?: UserPrivateResponse;
};

const toFormattedErrorMessage = (
  error: unknown,
): { status: HttpStatusCode; message: string } => {
  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response;
    return {
      status: status ?? HttpStatusCode.InternalServerError,
      message: formatErrorMessage(data),
    };
  } else
    return {
      status: HttpStatusCode.InternalServerError,
      message: "An unknown error occurred",
    };
};

const formatErrorMessage = (data: unknown): string => {
  if (Array.isArray(data)) {
    return data
      .map((member) => (member as { errorMessage?: string })?.errorMessage)
      .filter(Boolean)
      .join(" AND ");
  }
  return String(data);
};

const register = async (
  data: RegisterRequest,
): Promise<RegisterClientResponse> => {
  try {
    const response = await api.post("/User/register", data);
    return {
      status: response.status,
      message: "Account created successfully!",
    };
  } catch (error) {
    return toFormattedErrorMessage(error);
  }
};

const login = async (data: LoginRequest): Promise<LoginClientResponse> => {
  try {
    const response = await api.post("/User/login", data);
    const { token, user } = response.data ?? {};
    if (
      response.status === HttpStatusCode.Ok &&
      typeof token === "string" &&
      user &&
      isUserPrivateResponse(user)
    ) {
      setToken(token);
      return {
        status: response.status,
        message: "Login successful!",
        data: user,
      };
    } else throw new Error("Invalid response structure");
  } catch (error) {
    return toFormattedErrorMessage(error);
  }
};

const me = (): Promise<UserPrivateResponse | null> =>
  fetchValidated(() => api.get("/User/me"), isUserPrivateResponse);

const logout = async (): Promise<boolean> => {
  clearToken();
  return true;
};

const getByUsername = (
  username: string,
): Promise<UserDetailedResponse | null> =>
  fetchValidated(() => api.get(`/User/${username}`), isUserDetailedResponse);

const follow = (guid: string): Promise<boolean> =>
  succeeds(() => api.post(`/User/follow/${guid}`));

const putFlavor = (data: UserPutFlavorRequest): Promise<boolean> =>
  succeeds(() => api.put("/User", data));

const userUpload = (data: UserUploadRequest): Promise<boolean> => {
  const formData = new FormData();
  if (data.ProfilePicture) {
    formData.append("ProfilePicture", data.ProfilePicture);
  }
  if (data.BannerImage) {
    formData.append("BannerImage", data.BannerImage);
  }
  return succeeds(() =>
    api.post("/User/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  );
};

/** Admin only. */
const setVerified = (guid: string, verified: boolean): Promise<boolean> =>
  succeeds(
    () => api.put(`/User/${guid}/verified`, { verified }),
    HttpStatusCode.NoContent,
  );

const UserService = {
  register,
  login,
  me,
  logout,
  getByUsername,
  follow,
  putFlavor,
  userUpload,
  setVerified,
};

export default UserService;
