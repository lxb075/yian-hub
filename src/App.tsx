import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ElderlyList from "@/pages/ElderlyList";
import ElderlyDetail from "@/pages/ElderlyDetail";
import Monitor from "@/pages/Monitor";
import Alerts from "@/pages/Alerts";
import Devices from "@/pages/Devices";
import Care from "@/pages/Care";
import Family from "@/pages/Family";
import Analytics from "@/pages/Analytics";
import SettingsPage from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { useHub } from "@/store/hub";
import { startRealtimeSimulation, stopRealtimeSimulation } from "@/services/realtime";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const session = useHub((s) => s.session);
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  const session = useHub((s) => s.session);
  useEffect(() => {
    if (session) {
      startRealtimeSimulation();
    } else {
      stopRealtimeSimulation();
    }
    return () => stopRealtimeSimulation();
  }, [session]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="elderly" element={<ElderlyList />} />
          <Route path="elderly/:id" element={<ElderlyDetail />} />
          <Route path="monitor" element={<Monitor />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="devices" element={<Devices />} />
          <Route path="care" element={<Care />} />
          <Route path="family" element={<Family />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
