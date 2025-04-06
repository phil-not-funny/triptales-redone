export type User = {
  guid: string;
  username: string;
  displayName: string;
  email: string;
  verified?: boolean;
  following?: User[];
};

export type Post = {
  title: string;
  description: string;
  author: User;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  likes: User[];
};
