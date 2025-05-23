type Entity = {
  guid: string;
};

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
  profilePicture?: string;
  bannerImage?: string;
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
};

export type PostComment = {
  author: User;
  post: Post;
  createdAt: Date;
  content: string;
  likes: User[];
  comments: PostComment[];
} & Entity;
