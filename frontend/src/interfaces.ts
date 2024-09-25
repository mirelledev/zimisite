import { Types } from "mongoose";

export interface IUserRegister {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IFollowing {
  userId?: Types.ObjectId;
  name?: string;
  username?: string;
  profileImage?: string;
}

export interface IUser {
  createdAt?: any;
  profileImage?: string;
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  followers?: Array<IFollowing>;
  following?: Array<IFollowing>;
}

export type T = {
  comment?: string;
  _id?: string;
  userId?: Types.ObjectId;
  username: string;
  userRealName: string;
  userProfilePicture?: string;
};

export interface IPost {
  createdAt?: any;
  _id?: any;
  text: string;
  userId?: Types.ObjectId;
  username: string;
  userRealName: string;
  userProfilePicture: string;
  likes: Array<T>;
  comments: Array<T>;
}

export interface commentSlice {
  comment: string;
  id: string;
  username: string;
  userRealName: string;
}
