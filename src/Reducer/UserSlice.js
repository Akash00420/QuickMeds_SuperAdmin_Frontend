import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

export const getAllUsers = createAsyncThunk(
  "user/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/superadmin/users", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  "user/toggleStatus",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/api/superadmin/users/${userId}/toggle-status`);
      return { res: res.data, userId };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle status");
    }
  }
);

const UserSlice = createSlice({
  name: "user",
  initialState: {
    users:   [],
    total:   0,
    loading: false,
    error:   null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users   = action.payload.data?.users || [];
        state.total   = action.payload.data?.total || 0;
      })
      .addCase(getAllUsers.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const { userId, res } = action.payload;
        const idx = state.users.findIndex((u) => u._id === userId);
        if (idx !== -1) state.users[idx].isActive = res.data?.isActive;
      });
  },
});

export const { clearError } = UserSlice.actions;
export default UserSlice.reducer;