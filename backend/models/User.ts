import { Schema, model, Types } from "mongoose";

export interface IFollowing {
  userId?: Types.ObjectId;
  name?: string;
  username?: string;
  profileImage?: string;
}

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  profileImage: string;
  followers: Array<IFollowing>;
  following: Array<IFollowing>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String },
    profileImage: { type: String },
    followers: [
      {
        userId: {
          type: Types.ObjectId,

          ref: "User",
        },
        name: { type: String },
        username: { type: String },
        profileImage: { type: String },
      },
    ],
    following: [
      {
        userId: {
          type: Types.ObjectId,

          ref: "User",
        },
        name: { type: String },
        username: { type: String },
        profileImage: { type: String },
      },
      ,
    ],
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);
export default User;
