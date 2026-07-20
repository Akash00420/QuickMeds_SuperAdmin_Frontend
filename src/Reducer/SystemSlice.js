import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

export const getSystemHealth = createAsyncThunk(
  "system/getHealth",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/superadmin/system-health");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch system health");
    }
  }
);

export const getAuditLogs = createAsyncThunk(
  "system/getAuditLogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/superadmin/audit-logs", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch audit logs");
    }
  }
);

const SystemSlice = createSlice({
  name: "system",
  initialState: {
    health:    null,
    auditLogs: [],
    loading:   false,
    error:     null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSystemHealth.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(getSystemHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.health  = action.payload.data?.health;
      })
      .addCase(getSystemHealth.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(getAuditLogs.fulfilled, (state, action) => {
        state.auditLogs = action.payload.data?.logs || [];
      });
  },
});

export const { clearError } = SystemSlice.actions;
export default SystemSlice.reducer;