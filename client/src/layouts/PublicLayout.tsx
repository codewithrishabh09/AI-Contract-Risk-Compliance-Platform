import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-[#f7f5ef] text-[#243027]">
      <Outlet />
    </div>
  );
}

export default PublicLayout;