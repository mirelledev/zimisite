import { api, requestConfig } from "../utils/config";

const profile = async (data: any, token: any) => {
  const config = requestConfig("GET", data, token, false);

  try {
    const res = await fetch(api + "/users/profile", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const getUserById = async (id: string) => {
  const config = requestConfig("GET", null, null, false);
  try {
    const res = await fetch(api + "/users/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const updateProfile = async (data: any, token: string) => {
  const config = requestConfig("PUT", data, token, true);

  try {
    const res = await fetch(api + "/users/", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const followUser = async (id: string, token: string) => {
  const config = requestConfig("PUT", null, token, false);

  try {
    const res = await fetch(api + "/users/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const userService = {
  profile,
  getUserById,
  updateProfile,
  followUser,
};

export default userService;
