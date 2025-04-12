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
};

export const isUserPrivateResponse = (u: any): u is UserPrivateResponse =>
  "guid" in u && "username" in u && "displayName" in u && "email" in u;

export type UserPublicResponse = {
  guid: string;
  username: string;
  displayName: string;
  verified: boolean;
  following?: UserPublicResponseSmall[];
};

export type UserPublicResponseSmall = {
  guid: string;
  username: string;
  displayName: string;
  verified: boolean;
};

export const isUserPublicResponse = (u: any): u is UserPublicResponse =>
  "guid" in u &&
  "username" in u &&
  "displayName" in u &&
  "verified" in u &&
  "following" in u &&
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
  posts: PostResponse[];
  follows: boolean;
};

export const isUserDetailedResponse = (u: any): u is UserDetailedResponse =>
  "guid" in u &&
  "username" in u &&
  "displayName" in u &&
  "verified" in u &&
  "biography" in u &&
  "placeOfResidence" in u &&
  "favoriteDestination" in u &&
  "memberSince" in u &&
  "followerCount" in u &&
  Array.isArray(u.posts) &&
  u.posts.every(isPostResponse) &&
  "follows" in u;

export type UserPutFlavorRequest = {
  username?: string;
  displayName?: string;
  biography?: string;
  placeOfResidence?: string;
  favoriteDestination?: string;
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
};

export const isPostResponse = (p: any): p is PostResponse =>
  "guid" in p &&
  "title" in p &&
  "description" in p &&
  "author" in p &&
  "createdAt" in p &&
  "startDate" in p &&
  "endDate" in p &&
  "likesCount" in p;

export type CreatePostRequest = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};
