import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

export const getBillingOverview = createAsyncThunk(
  "billing/getOverview",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/superadmin/billing");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch billing");
    }
  }
);

export const updatePharmacyPlan = createAsyncThunk(
  "billing/updatePlan",
  async ({ pharmacyId, plan }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/api/superadmin/billing/${pharmacyId}/plan`, { plan });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update plan");
    }
  }
);

const BillingSlice = createSlice({
  name: "billing",
  initialState: {
    overview:      null,
    subscriptions: [],
    loading:       false,
    error:         null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBillingOverview.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(getBillingOverview.fulfilled, (state, action) => {
        state.loading       = false;
        state.overview      = action.payload.data?.overview;
        state.subscriptions = action.payload.data?.subscriptions || [];
      })
      .addCase(getBillingOverview.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(updatePharmacyPlan.fulfilled, (state, action) => {
        const updated = action.payload.data?.subscription;
        const idx = state.subscriptions.findIndex((s) => s.pharmacyId === updated?.pharmacyId);
        if (idx !== -1) state.subscriptions[idx] = updated;
      });
  },
});

export const { clearError } = BillingSlice.actions;
export default BillingSlice.reducer;