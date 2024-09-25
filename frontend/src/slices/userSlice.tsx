import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";
import { RootState } from "../store";
import { IUser } from "../interfaces";

const initialState: {
  user: IUser;
  error: string | null;
  success: boolean;
  loading: boolean;
  message: string | null;
} = {
  user: {},
  error: null as null,
  success: false,
  loading: false,
  message: null,
};

export const profile = createAsyncThunk(
  "user/profile",
  async (user, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.auth.user?.token;
    const data = await userService.profile(user, token);
    return data;
  }
);

export const getUserById = createAsyncThunk(
  "user/get",
  async (id: any, thunkAPI) => {
    const data = await userService.getUserById(id);

    return data;
  }
);

export const updateProfileThunk = createAsyncThunk(
  "user/update",
  async (userData: FormData, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.auth.user.token;
    const data = await userService.updateProfile(userData, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

export const followUser = createAsyncThunk(
  "user/follow",
  async (id: string, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState;
    const token = state.auth.user.token;
    const data = await userService.followUser(id, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(updateProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = "Foto atualizada com sucesso";
        state.user = action.payload;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.user = {};
      })

      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload.message;

        // Atualiza a lista de seguindo com base na resposta do backend
        state.user.followers = action.payload.followers;
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        state.message = null;
      });
  },
});

export const { resetMessage } = userSlice.actions;
export default userSlice.reducer;
