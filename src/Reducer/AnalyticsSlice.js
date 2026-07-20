import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

export const getOutbreakData = createAsyncThunk(
  "analytics/getOutbreak",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/superadmin/analytics/outbreak");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch outbreak data");
    }
  }
);

export const getDemandSpikes = createAsyncThunk(
  "analytics/getDemandSpikes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/superadmin/analytics/demand-spikes");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch demand spikes");
    }
  }
);

export const getPlatformStats = createAsyncThunk(
  "analytics/getPlatformStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/superadmin/analytics/stats");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const sendRestockAlert = createAsyncThunk(
  "analytics/sendRestockAlert",
  async (data, { rejectWithValue }) => {
    try {
      const res = await Api.post("/api/superadmin/analytics/restock-alert", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send alert");
    }
  }
);

const AnalyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    outbreakAlerts: [],
    demandSpikes:   [],
    platformStats:  null,
    loading:        false,
    error:          null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOutbreakData.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(getOutbreakData.fulfilled, (state, action) => {
        state.loading        = false;
        state.outbreakAlerts = action.payload.data?.alerts || [];
      })
      .addCase(getOutbreakData.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(getDemandSpikes.fulfilled, (state, action) => {
        state.demandSpikes = action.payload.data?.spikes || [];
      });

    builder
      .addCase(getPlatformStats.fulfilled, (state, action) => {
        state.platformStats = action.payload.data?.stats;
      });
  },
});

export const { clearError } = AnalyticsSlice.actions;
export default AnalyticsSlice.reducer;