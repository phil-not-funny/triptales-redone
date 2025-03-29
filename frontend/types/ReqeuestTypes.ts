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

type UserPublicResponseSmall = {
  guid: string;
  username: string;
  displayName: string;
  verified: boolean;
};

export const isUserPublicResponse = (u: any): u is UserPublicResponse =>
    "guid" in u && "username" in u && "displayName" in u && "verified" in u && "following" in u && Array.isArray(u.following);