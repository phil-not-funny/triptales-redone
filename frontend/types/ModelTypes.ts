type Entity = {
  guid: string;
}

export type User = {
  username: string;
  displayName: string;
  email: string;
  verified?: boolean;
  following?: User[];
  likedPosts?: Post[];
  posts?: Post[];
  biography?: string;
  placeOfResidence?: string;
  favoriteDestination?: string;
  memberSince?: Date;
} & Entity;

export type Post = {
  title: string;
  description: string;
  author: User;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  likes: User[];
  days: PostDay[];
} & Entity;

export type PostDay = {
  title: string;
  description: string;
  date: Date;
}