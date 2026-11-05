import { Navigate, Route, Routes } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicOnlyRoute from "../components/auth/PublicOnlyRoute";

import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProfilePage from "../pages/Profile/ProfilePage";

import ContractsPage from "../pages/Contracts/ContractsPage";
import ContractDetailPage from "../pages/Contracts/ContractDetailPage";

import UploadPage from "../pages/Upload/UploadPage";
import AnalysisPage from "../pages/Analysis/AnalysisPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected application */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route
            path="/contracts"
            element={<ContractsPage />}
          />

          <Route
            path="/contracts/:contractId"
            element={<ContractDetailPage />}
          />

          <Route
            path="/upload"
            element={<UploadPage />}
          />

          {/* AI Analysis Workspace */}
          <Route
            path="/analysis"
            element={<AnalysisPage />}
          />

          {/* Remaining workspaces */}
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
      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}