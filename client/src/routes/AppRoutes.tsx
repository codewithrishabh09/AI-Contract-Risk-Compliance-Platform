import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicOnlyRoute from "../components/auth/PublicOnlyRoute";

import DashboardLayout from "../layouts/DashboardLayout";
import PublicLayout from "../layouts/PublicLayout";

import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";

import DashboardPage from "../pages/Dashboard/DashboardPage";
import ContractsPage from "../pages/Contracts/ContractsPage";
import ContractDetailPage from "../pages/Contracts/ContractDetailPage";
import UploadPage from "../pages/Upload/UploadPage";

function AppRoutes() {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* Login / Register only for logged-out users */}
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

export default AppRoutes;