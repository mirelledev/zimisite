import { api, requestConfig } from "../utils/config";

interface IPostText {
  text: string;
}

const addPost = async (data: IPostText, token: string) => {
  const config = requestConfig("POST", data, token, false);

  try {
    const res = await fetch(api + "/posts/", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getAllPosts = async (token: string) => {
  const config = requestConfig("GET", null, token, false);

  try {
    const res = await fetch(api + "/posts/", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const likePost = async (id: string, token: string) => {
  const config = requestConfig("PUT", null, token, false);

  try {
    const res = await fetch(api + "/posts/like/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getPostById = async (id: string, token: string) => {
  const config = requestConfig("GET", null, token, false);

  try {
    const res = await fetch(api + "/posts/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const commentPost = async (data: any, id: string, token: string) => {
  const config = requestConfig("PUT", data, token, false);
  try {
    const res = await fetch(api + "/posts/comment/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getUserPosts = async (id: string, token: string) => {
  const config = requestConfig("GET", null, token, false);
  try {
    const res = await fetch(api + "/posts/user/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const searchPostsAndUsers = async (query: string, token: string) => {
  const config = requestConfig("GET", null, token, false);
  try {
    const res = await fetch(api + "/posts/search?q=" + query, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getFollowingUsersPosts = async (token: string) => {
  const config = requestConfig("GET", null, token, false);

  try {
    const res = await fetch(api + "/posts/following", config)
      .then((res) => res.json())
      .catch((err) => err);
    return res;
  } catch (error) {
    console.log(error);
  }
};

const deletePost = async (id: string, token: string) => {
  const config = requestConfig("DELETE", null, token, false);

  try {
    const res = await fetch(api + "/posts/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const postService = {
  addPost,
  getAllPosts,
  likePost,
  getPostById,
  commentPost,
  getUserPosts,
  searchPostsAndUsers,
  getFollowingUsersPosts,
  deletePost,
};

export default postService;
