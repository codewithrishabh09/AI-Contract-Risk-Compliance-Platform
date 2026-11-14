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
import FindingsPage from "../pages/Findings/FindingsPage";
import RiskTrendsPage from "../pages/RiskTrends/RiskTrendsPage";
import CompliancePage from "../pages/Compliance/CompliancePage";
import AuditPage from "../pages/Audit/AuditPage";

import ProcessingJobsPage from "../pages/Jobs/ProcessingJobsPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route element={<PublicOnlyRoute />}>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />
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

          <Route
            path="/analysis"
            element={<AnalysisPage />}
          />

          <Route
            path="/findings"
            element={<FindingsPage />}
          />

          <Route
            path="/risk-trends"
            element={<RiskTrendsPage />}
          />

          <Route
            path="/compliance"
            element={<CompliancePage />}
          />

          <Route
            path="/audit"
            element={<AuditPage />}
          />

          <Route
            path="/jobs"
            element={<ProcessingJobsPage />}
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
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}