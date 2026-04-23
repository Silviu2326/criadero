import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { NotificationToast } from '@/components/common/NotificationToast';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/utils/cn';

export function DashboardLayout() {
  useUIStore();

  return (
    <div className="min-h-screen bg-apple-gray">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main
          className={cn(
            'flex-1 p-6 lg:p-8 transition-all duration-300 min-h-[calc(100vh-4rem)]'
          )}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      <NotificationToast />
    </div>
  );
}
