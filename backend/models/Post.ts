import { Schema, model, Types } from "mongoose";

export type Like = {
  userId?: Types.ObjectId;
};

export type Comment = {
  userId?: Types.ObjectId;
  comment?: string;
  username?: string;
  userRealName?: string;
  userProfilePicture?: string;
};

export interface IPost {
  text: string;
  userId?: Types.ObjectId;
  username: string;
  userRealName: string;
  userProfilePicture: string;
  likes: Array<Like>;
  comments: Array<Comment>;
}

const postSchema = new Schema<IPost>(
  {
    text: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    userRealName: { type: String, required: true },
    userProfilePicture: { type: String },
    likes: [{ userId: { type: Types.ObjectId, ref: "User" } }],
    comments: [
      {
        userId: {
          type: Types.ObjectId,

          ref: "User",
        },
        userProfilePicture: { type: String },
        comment: { type: String },
        username: { type: String },
        userRealName: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = model<IPost>("Post", postSchema);
export default Post;
