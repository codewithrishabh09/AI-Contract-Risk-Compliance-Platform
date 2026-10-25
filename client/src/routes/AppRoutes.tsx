import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import DashboardPage from "../pages/Dashboard/DashboardPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/contracts"
          element={
            <div className="p-8 text-slate-300">
              Contracts
            </div>
          }
        />

        <Route
          path="/analysis"
          element={
            <div className="p-8 text-slate-300">
              AI Analysis
            </div>
          }
        />

        <Route
          path="/findings"
          element={
            <div className="p-8 text-slate-300">
              Risk Findings
            </div>
          }
        />

        <Route
          path="/risk-trends"
          element={
            <div className="p-8 text-slate-300">
              Risk Trends
            </div>
          }
        />

        <Route
          path="/compliance"
          element={
            <div className="p-8 text-slate-300">
              Compliance
            </div>
          }
        />

        <Route
          path="/audit"
          element={
            <div className="p-8 text-slate-300">
              Audit Logs
            </div>
          }
        />

        <Route
          path="/jobs"
          element={
            <div className="p-8 text-slate-300">
              Processing Jobs
            </div>
          }
        />

        <Route
          path="/settings"
          element={
            <div className="p-8 text-slate-300">
              Settings
            </div>
          }
        />
      </Route>

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;