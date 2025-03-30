import {
  isUserPrivateResponse,
  LoginRequest,
  RegisterRequest,
  UserPrivateResponse,
} from "@/types/ReqeuestTypes";
import api from "../api";
import axios, { HttpStatusCode } from "axios";

const register = async (
  data: RegisterRequest,
): Promise<RegisterClientResponse> => {
  try {
    const response = await api.post("/User/register", data);
    return { status: response.status, message: "Registration successful" };
  } catch (error) {
    return axios.isAxiosError(error)
      ? { status: error.response?.status!, message: error.response?.data }
      : {
          status: HttpStatusCode.InternalServerError,
          message: "An unknown error occurred",
        };
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
        message: "Login successful",
        data: response.data,
      };
    else throw new Error("Invalid response structure");
  } catch (error) {
    if (axios.isAxiosError(error))
      return {
        status: error.response?.status!,
        message: error.response?.data,
      };
    else
      return {
        status: HttpStatusCode.InternalServerError,
        message: "An unknown error occurred",
      };
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
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default { register, login, me };
