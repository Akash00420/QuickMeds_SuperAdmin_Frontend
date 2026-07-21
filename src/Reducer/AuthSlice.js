import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../store/Api";

// ✅ Safely read persisted session (guards against "undefined" string / corrupted JSON)
const getStoredSession = () => {
  try {
    const raw = sessionStorage.getItem("quickmeds_superadmin_token");
    if (!raw || raw === "undefined") return { token: null, role: null };
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem("quickmeds_superadmin_token");
    return { token: null, role: null };
  }
};

const stored = getStoredSession();

export const loginSuperAdmin = createAsyncThunk(
  "auth/loginSuperAdmin",
  async (data, { rejectWithValue }) => {
    try {
      const res = await Api.post("/api/logins/create-login", data);
      const { token, user } = res.data;

      if (user.role !== "superadmin") {
        return rejectWithValue("Access denied. SuperAdmin account required.");
      }

      sessionStorage.setItem(
        "quickmeds_superadmin_token",
        JSON.stringify({ token, role: user.role })
      );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const getSuperAdminProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get("/api/users/profile");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch profile");
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    user:            null,
    token:           stored.token,           // ✅ rehydrated
    isAuthenticated: !!stored.token,          // ✅ rehydrated
    loading:         false,
    error:           null,
  },
  reducers: {
    logout: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem("quickmeds_superadmin_token");
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginSuperAdmin.pending,   (state) => { state.loading = true;  state.error = null; })
      .addCase(loginSuperAdmin.fulfilled, (state, action) => {
        state.loading         = false;
        state.token           = action.payload.token;
        state.user            = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginSuperAdmin.rejected,  (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(getSuperAdminProfile.fulfilled, (state, action) => {
        state.user = action.payload.data?.user;
      });
  },
});

export const { logout, clearError } = AuthSlice.actions;
export default AuthSlice.reducer;