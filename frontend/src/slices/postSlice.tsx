import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import postService from "../services/postService";
import { RootState } from "../store";
import { IPost, IUser } from "../interfaces";
import { commentSlice } from "../interfaces";

const initialState: {
  posts: IPost[];
  post: IPost | null;
  error: string | null;
  success: boolean;
  loading: boolean;
  message: string | null;
  users?: IUser[];
} = {
  users: [],
  posts: [],
  post: null,
  error: null,
  success: false,
  loading: false,
  message: null,
};

interface IPostText {
  text: string;
}

export const addPost = createAsyncThunk(
  "post/add",
  async (post: IPostText, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.auth.user?.token;

    const data = await postService.addPost(post, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const getAllPosts = createAsyncThunk(
  "posts/get",
  async (_, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.auth.user?.token;

    const data = await postService.getAllPosts(token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const likePost = createAsyncThunk(
  "post/like",
  async (id: string, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.auth.user?.token;

    const data = await postService.likePost(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const getPostById = createAsyncThunk(
  "post/id",
  async (id: string, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.auth.user?.token;

    const data = await postService.getPostById(id, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const commentPost = createAsyncThunk(
  "add/comment",
  async (commentData: commentSlice, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.auth.user.token;
    const data = await postService.commentPost(
      {
        comment: commentData.comment,
      },
      commentData.id,
      token
    );

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const getUserPosts = createAsyncThunk(
  "posts/user",
  async (id: string, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.auth.user.token;
    const data = await postService.getUserPosts(id, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const searchPostsAndUsers = createAsyncThunk(
  "post/search",
  async (query: string, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.auth.user.token;
    const data = await postService.searchPostsAndUsers(query, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const getFollowingUsersPosts = createAsyncThunk(
  "posts/following",
  async (_, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;

    const token = state.auth.user.token;

    const data = await postService.getFollowingUsersPosts(token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const deletePost = createAsyncThunk(
  "post/delete",
  async (id: string, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;

    const token = state.auth.user.token;

    const data = await postService.deletePost(id, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    reset: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.post = action.payload;
        if (state.post) {
          state.posts.unshift(state.post);
        }
        state.message = "Post feito com sucesso";
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.posts = action.payload;
      })

      .addCase(likePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        const updatedPostIndex = state.posts.findIndex(
          (post) => post._id === action.payload.postId
        );

        if (updatedPostIndex !== -1) {
          state.posts[updatedPostIndex].likes = action.payload.likes;

          state.message = action.payload.message;
        } else {
          state.error = "Post não encontrado.";
        }
      })
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.post = action.payload;
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload as string;
      })

      .addCase(commentPost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload.message;
        state.post!.comments.push(action.payload.comment);
      })
      .addCase(commentPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.posts = action.payload;
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      .addCase(searchPostsAndUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchPostsAndUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.posts = action.payload;
      })
      .addCase(getFollowingUsersPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFollowingUsersPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.posts = state.posts.filter((post) => {
          return post._id !== action.payload.id;
        });
        state.message = "Postagem deletada com sucesso.";
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.post = null;
      });
  },
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;
