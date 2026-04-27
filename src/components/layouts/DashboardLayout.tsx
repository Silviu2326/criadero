import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { NotificationToast } from '@/components/common/NotificationToast';

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main content area with left margin for sidebar on desktop */}
      <div className="lg:ml-[260px] min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <NotificationToast />
    </div>
  );
}
