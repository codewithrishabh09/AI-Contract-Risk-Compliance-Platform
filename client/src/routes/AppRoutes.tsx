import { Navigate, Route, Routes } from "react-router-dom";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="/dashboard"
        element={
          <div className="min-h-screen bg-[#020817] p-10 text-slate-100">
            <h1 className="text-3xl font-semibold">
              LexMind
            </h1>

            <p className="mt-2 text-slate-400">
              Smarter Contracts. Lower Risks.
            </p>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRoutes;