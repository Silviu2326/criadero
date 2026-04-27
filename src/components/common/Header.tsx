import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  LogOut,
  User,
  Bell,
  Search,
  ChevronDown,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'reservation';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Nueva reserva',
    message: 'Juan Pérez ha solicitado reservar a Max',
    time: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    type: 'reservation',
  },
  {
    id: '2',
    title: 'Vacuna próxima',
    message: 'Luna tiene vacuna programada para mañana',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    type: 'warning',
  },
];

export function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return 'bg-accent-green-bg text-accent-green';
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-dashboard-border flex items-center justify-between px-4 lg:px-6 pl-16 lg:pl-6 sticky top-0 z-30">
      {/* Left side - Search */}
      <div className="flex items-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dashboard-bg border border-dashboard-border text-dashboard-text-secondary hover:border-gray-300 transition-colors cursor-text min-w-[280px]">
          <Search size={18} className="text-gray-400" />
          <span className="text-sm text-gray-400 flex-1">Buscar...</span>
          <kbd className="hidden lg:inline-flex px-2 py-0.5 text-[11px] bg-white rounded-md border border-dashboard-border text-gray-400 font-mono">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl hover:bg-dashboard-bg transition-colors"
              >
                <Bell size={20} className="text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-xl border border-dashboard-border overflow-hidden animate-fade-in-scale z-50">
                  <div className="p-4 border-b border-dashboard-border flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                    <button
                      className="text-sm text-accent-green hover:text-green-700 font-medium"
                    >
                      Marcar todas
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {mockNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-dashboard-border/50 last:border-0",
                          !notification.read && 'bg-green-50/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                            getNotificationIcon(notification.type)
                          )}>
                            <Bell size={18} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(notification.time, { addSuffix: true, locale: es })}
                            </p>
                          </div>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-accent-green rounded-full flex-shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-dashboard-border">
                    <Link
                      to="/messages"
                      className="block text-center text-sm text-accent-green hover:text-green-700 font-medium"
                    >
                      Ver mensajes
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-xl hover:bg-dashboard-bg transition-colors"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sidebar to-sidebar-dark flex items-center justify-center text-white font-medium text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                )}
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {user.firstName}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight capitalize">
                    {user.role.toLowerCase()}
                  </p>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </button>

              {/* Profile dropdown */}
              {showProfile && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-dashboard-border overflow-hidden animate-fade-in-scale z-50">
                  <div className="p-4 border-b border-dashboard-border">
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/account"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-900"
                    >
                      <User size={18} className="text-gray-400" />
                      <span className="text-sm">Mi cuenta</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-900"
                    >
                      <Settings size={18} className="text-gray-400" />
                      <span className="text-sm">Configuración</span>
                    </Link>
                    <Link
                      to="/about"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-900"
                    >
                      <HelpCircle size={18} className="text-gray-400" />
                      <span className="text-sm">Sobre nosotros</span>
                    </Link>
                  </div>
                  <div className="p-2 border-t border-dashboard-border">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
