import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

export const getFeatureFlags = createAsyncThunk(
  "featureFlag/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/superadmin/flags");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch flags");
    }
  }
);

export const toggleFeatureFlag = createAsyncThunk(
  "featureFlag/toggle",
  async ({ key, enabled }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/api/superadmin/flags/${key}`, { enabled });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to toggle flag");
    }
  }
);

const FeatureFlagSlice = createSlice({
  name: "featureFlag",
  initialState: {
    flags:   [],
    loading: false,
    error:   null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureFlags.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(getFeatureFlags.fulfilled, (state, action) => {
        state.loading = false;
        state.flags   = action.payload.data?.flags || [];
      })
      .addCase(getFeatureFlags.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(toggleFeatureFlag.fulfilled, (state, action) => {
        const updated = action.payload.data?.flag;
        const idx = state.flags.findIndex((f) => f.key === updated?.key);
        if (idx !== -1) state.flags[idx] = updated;
      });
  },
});

export const { clearError } = FeatureFlagSlice.actions;
export default FeatureFlagSlice.reducer;