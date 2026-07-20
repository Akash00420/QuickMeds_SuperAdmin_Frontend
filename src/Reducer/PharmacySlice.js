import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

export const getAllPharmacies = createAsyncThunk(
  "pharmacy/getAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/pharmacies", { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch pharmacies");
    }
  }
);

export const verifyPharmacy = createAsyncThunk(
  "pharmacy/verify",
  async ({ pharmacyId, approve }, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/api/pharmacies/${pharmacyId}/verify`, { approve });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to verify pharmacy");
    }
  }
);

export const deactivatePharmacy = createAsyncThunk(
  "pharmacy/deactivate",
  async (pharmacyId, { rejectWithValue }) => {
    try {
      const res = await Api.put(`/api/pharmacies/${pharmacyId}/deactivate`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to deactivate pharmacy");
    }
  }
);

const PharmacySlice = createSlice({
  name: "pharmacy",
  initialState: {
    pharmacies: [],
    total:      0,
    loading:    false,
    error:      null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllPharmacies.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(getAllPharmacies.fulfilled, (state, action) => {
        state.loading    = false;
        state.pharmacies = action.payload.data?.pharmacies || [];
        state.total      = action.payload.data?.total      || 0;
      })
      .addCase(getAllPharmacies.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(verifyPharmacy.fulfilled, (state, action) => {
        const updated = action.payload.data?.pharmacy;
        const idx = state.pharmacies.findIndex((p) => p._id === updated?._id);
        if (idx !== -1) state.pharmacies[idx] = updated;
      });

    builder
      .addCase(deactivatePharmacy.fulfilled, (state, action) => {
        const updated = action.payload.data?.pharmacy;
        const idx = state.pharmacies.findIndex((p) => p._id === updated?._id);
        if (idx !== -1) state.pharmacies[idx] = updated;
      });
  },
});

export const { clearError } = PharmacySlice.actions;
export default PharmacySlice.reducer;