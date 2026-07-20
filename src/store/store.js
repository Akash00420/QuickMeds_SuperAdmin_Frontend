import { configureStore } from "@reduxjs/toolkit";

import authReducer         from "../Reducer/AuthSlice";
import adminReducer        from "../Reducer/AdminSlice";
import pharmacyReducer     from "../Reducer/PharmacySlice";
import userReducer         from "../Reducer/UserSlice";
import analyticsReducer    from "../Reducer/AnalyticsSlice";
import billingReducer      from "../Reducer/BillingSlice";
import featureFlagReducer  from "../Reducer/FeatureFlagSlice";
import systemReducer       from "../Reducer/SystemSlice";
import notificationReducer from "../Reducer/NotificationSlice";

const store = configureStore({
  reducer: {
    auth:        authReducer,
    admin:       adminReducer,
    pharmacy:    pharmacyReducer,
    user:        userReducer,
    analytics:   analyticsReducer,
    billing:     billingReducer,
    featureFlag: featureFlagReducer,
    system:      systemReducer,
    notification: notificationReducer,
  },
});

export default store;