import { hasKeys } from "@/lib/utils";
import { PostDay } from "./ModelTypes";

export type LoginRequest = {
  username: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  password: string;
  email: string;
  displayName: string;
};

export type UserPrivateResponse = {
  guid: string;
  username: string;
  displayName: string;
  email: string;
  profilePicture?: string;
  role: UserRole;
};

export type UserRole = "User" | "Admin";

export const isUserPrivateResponse = (u: unknown): u is UserPrivateResponse =>
  hasKeys(u, "guid", "username", "displayName", "email");

export type UserPublicResponse = {
  guid: string;
  username: string;
  displayName: string;
  verified: boolean;
  profilePicture?: string;
  following?: UserPublicResponseSmall[];
};

export type UserPublicResponseSmall = {
  guid: string;
  username: string;
  displayName: string;
  verified: boolean;
  profilePicture?: string;
};

export const isUserPublicResponse = (u: unknown): u is UserPublicResponse =>
  hasKeys(u, "guid", "username", "displayName", "verified", "following") &&
  Array.isArray(u.following);

export type UserDetailedResponse = {
  guid: string;
  username: string;
  displayName: string;
  verified?: boolean;
  biography?: string;
  placeOfResidence?: string;
  favoriteDestination?: string;
  memberSince: string;
  followerCount: number;
  posts: PostResponseSmall[];
  userFollowing: boolean;
  profilePicture?: string;
  bannerImage?: string;
};

export const isUserDetailedResponse = (u: unknown): u is UserDetailedResponse =>
  hasKeys(
    u,
    "guid",
    "username",
    "displayName",
    "verified",
    "biography",
    "placeOfResidence",
    "favoriteDestination",
    "memberSince",
    "followerCount",
    "posts",
    "userFollowing",
  ) &&
  Array.isArray(u.posts) &&
  u.posts.every(isPostResponseSmall);

export type UserPutFlavorRequest = {
  username?: string;
  displayName?: string;
  biography?: string;
  placeOfResidence?: string;
  favoriteDestination?: string;
};

export type UserUploadRequest = {
  ProfilePicture: File | null;
  BannerImage: File | null;
};

// ANCHOR POST SECTION

export type PostResponse = {
  title: string;
  description: string;
  author: UserPublicResponseSmall;
  createdAt: string;
  startDate: string;
  endDate: string;
  likesCount: number;
  guid: string;
  days: PostDay[];
  userLiked: boolean;
  commentsCount: number;
  comments: PostCommentResponse[];
  userCommented: boolean;
  picture?: string;
};

export type PostResponseSmall = {
  title: string;
  description: string;
  author: UserPublicResponseSmall;
  createdAt: string;
  startDate: string;
  endDate: string;
  likesCount: number;
  guid: string;
  userLiked: boolean;
  commentsCount: number;
  picture?: string;
};

export type PostCommentResponse = {
  guid: string;
  author: UserPublicResponseSmall;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  userLiked: boolean;
  comments: PostCommentResponse[];
};

export const isPostResponse = (p: unknown): p is PostResponse =>
  hasKeys(
    p,
    "guid",
    "title",
    "description",
    "author",
    "createdAt",
    "startDate",
    "endDate",
    "likesCount",
    "days",
    "userLiked",
    "commentsCount",
    "comments",
    "userCommented",
  ) &&
  Array.isArray(p.days) &&
  Array.isArray(p.comments) &&
  p.comments.every(isPostCommentResponse);

export const isPostResponseSmall = (p: unknown): p is PostResponseSmall =>
  hasKeys(
    p,
    "guid",
    "title",
    "description",
    "author",
    "createdAt",
    "startDate",
    "endDate",
    "likesCount",
    "userLiked",
    "commentsCount",
  );

export const isPostCommentResponse = (p: unknown): p is PostCommentResponse =>
  hasKeys(
    p,
    "author",
    "content",
    "createdAt",
    "likesCount",
    "commentsCount",
    "comments",
    "userLiked",
  ) &&
  Array.isArray(p.comments) &&
  p.comments.every(isPostCommentResponse);

export type CreatePostRequest = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  days: CreatePostRequestDay[] | [];
};

export type CreatePostRequestDay = {
  title: string;
  description: string;
  date: string;
};

export type CommentPostRequest = {
  parent?: string;
  post?: string;
  content: string;
};
