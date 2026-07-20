import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

export const getAllAdmins = createAsyncThunk(
  "admin/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/superadmin/admins");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch admins");
    }
  }
);

export const createAdmin = createAsyncThunk(
  "admin/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await Api.post("/api/superadmin/admins", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create admin");
    }
  }
);

export const toggleAdminStatus = createAsyncThunk(
  "admin/toggleStatus",
  async ({ adminId, isActive }, { rejectWithValue }) => {
    try {
      const res = await Api.patch(`/api/superadmin/admins/${adminId}/status`, { isActive });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  "admin/delete",
  async (adminId, { rejectWithValue }) => {
    try {
      await Api.delete(`/api/superadmin/admins/${adminId}`);
      return adminId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete admin");
    }
  }
);

const AdminSlice = createSlice({
  name: "admin",
  initialState: {
    admins:            [],
    generatedPassword: null,
    loading:           false,
    error:             null,
  },
  reducers: {
    clearError:             (state) => { state.error = null; },
    clearGeneratedPassword: (state) => { state.generatedPassword = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAdmins.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(getAllAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins  = action.payload.data?.admins || [];
      })
      .addCase(getAllAdmins.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(createAdmin.pending,   (state) => { state.loading = true; state.error = null; })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading           = false;
        state.admins.unshift(action.payload.data?.admin);
        state.generatedPassword = action.payload.data?.generatedPassword;
      })
      .addCase(createAdmin.rejected,  (state, action) => { state.loading = false; state.error = action.payload; });

    builder
      .addCase(toggleAdminStatus.fulfilled, (state, action) => {
        const updated = action.payload.data?.admin;
        const idx = state.admins.findIndex((a) => a._id === updated?._id);
        if (idx !== -1) state.admins[idx] = updated;
      });

    builder
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter((a) => a._id !== action.payload);
      });
  },
});

export const { clearError, clearGeneratedPassword } = AdminSlice.actions;
export default AdminSlice.reducer;