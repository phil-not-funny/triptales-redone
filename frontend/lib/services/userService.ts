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
import api from "../api";
import axios, { HttpStatusCode } from "axios";

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

type RegisterClientResponse = {
  status: HttpStatusCode;
  message: string;
};

const login = async (data: LoginRequest): Promise<LoginClientResponse> => {
  try {
    const response = await api.post("/User/login", data);
    if (
      response.status === HttpStatusCode.Ok &&
      isUserPrivateResponse(response.data)
    )
      return {
        status: response.status,
        message: "Login successful!",
        data: response.data,
      };
    else throw new Error("Invalid response structure");
  } catch (error) {
    return toFormattedErrorMessage(error);
  }
};

type LoginClientResponse = {
  status: HttpStatusCode;
  message: string;
  data?: UserPrivateResponse;
};

const me = async (): Promise<UserPrivateResponse | null> => {
  try {
    const response = await api.get("/User/me");
    if (
      response.status === HttpStatusCode.Ok &&
      isUserPrivateResponse(response.data)
    )
      return response.data;
    else throw new Error("Invalid response structure");
  } catch {
    return null;
  }
};

const logout = async (): Promise<boolean> => {
  try {
    const response = await api.get("/User/logout");
    return response.status === HttpStatusCode.NoContent;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const getByUsername = async (
  username: string,
): Promise<UserDetailedResponse | null> => {
  try {
    const response = await api.get(`/User/${username}`);
    if (
      response.status === HttpStatusCode.Ok &&
      isUserDetailedResponse(response.data)
    )
      return response.data;
    else throw new Error("Invalid response structure");
  } catch {
    return null;
  }
};

const follow = async (guid: string): Promise<boolean> => {
  try {
    const response = await api.post(`/User/follow/${guid}`);
    if (response.status === HttpStatusCode.Ok) {
      return true;
    } else return false;
  } catch {
    return false;
  }
};

const putFlavor = async (data: UserPutFlavorRequest): Promise<boolean> => {
  try {
    const response = await api.put("/User", data);
    if (response.status === HttpStatusCode.Ok) {
      return true;
    } else return false;
  } catch {
    return false;
  }
};

const userUpload = async (data: UserUploadRequest): Promise<boolean> => {
  try {
    const formData = new FormData();
    if (data.ProfilePicture) {
      formData.append("ProfilePicture", data.ProfilePicture);
    }
    if (data.BannerImage) {
      formData.append("BannerImage", data.BannerImage);
    }
    const response = await api.post("/User/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.status === HttpStatusCode.Ok;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const UserService = {
  register,
  login,
  me,
  logout,
  getByUsername,
  follow,
  putFlavor,
  userUpload
};

export default UserService;
