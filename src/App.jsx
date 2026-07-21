import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminManager from "./pages/AdminManager";
import AuditLogs from "./pages/AuditLogs";
import BillingPanel from "./pages/BillingPanel";
import FeatureFlags from "./pages/FeatureFlags";
import Notifications from "./pages/Notifications";
import OutbreakMonitor from "./pages/OutbreakMonitor";
import PharmacyControl from "./pages/PharmacyControl";
import SystemHealth from "./pages/SystemHealth";
import UserControl from "./pages/UserControl";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Everything below requires the superadmin to be logged in */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-manager" element={<AdminManager />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/billing" element={<BillingPanel />} />
        <Route path="/feature-flags" element={<FeatureFlags />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/outbreak-monitor" element={<OutbreakMonitor />} />
        <Route path="/pharmacy-control" element={<PharmacyControl />} />
        <Route path="/system-health" element={<SystemHealth />} />
        <Route path="/user-control" element={<UserControl />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;