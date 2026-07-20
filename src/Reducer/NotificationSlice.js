import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

export const getMyNotifications = createAsyncThunk(
  "notification/getMine",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/notifications");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notification/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await Api.patch("/api/notifications/read-all");
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to mark all as read");
    }
  }
);

const NotificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount:   0,
    loading:       false,
    error:         null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    addLive: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyNotifications.pending,   (state) => { state.loading = true; })
      .addCase(getMyNotifications.fulfilled, (state, action) => {
        state.loading       = false;
        state.notifications = action.payload.data?.notifications || [];
        state.unreadCount   = action.payload.data?.unreadCount   || 0;
      })
      .addCase(getMyNotifications.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
        state.unreadCount   = 0;
      });
  },
});

export const { clearError, addLive } = NotificationSlice.actions;
export default NotificationSlice.reducer;