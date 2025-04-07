type Enitity = {
  guid: string;
}

export type User = {
  username: string;
  displayName: string;
  email: string;
  verified?: boolean;
  following?: User[];
} & Enitity;

export type Post = {
  title: string;
  description: string;
  author: User;
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  likes: User[];
} & Enitity;
