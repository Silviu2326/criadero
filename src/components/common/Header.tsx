import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  LogOut,
  User,
  Bell,
  Search,
  Menu,
  X,
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

// Mock notifications
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
  {
    id: '3',
    title: 'Cliente registrado',
    message: 'Ana Gómez se ha registrado como nueva cliente',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    type: 'success',
  },
];

export function Header() {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdowns on click outside
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
        return 'bg-[#E8EEEB] text-[#4A5D52]';
      case 'success':
        return 'bg-[#E3EDE8] text-[#5A7D6E]';
      case 'warning':
        return 'bg-[#FAEBE4] text-[#B87B5C]';
      default:
        return 'bg-[#E8E4DC] text-[#6B6560]';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-apple-gray-300/50 z-40">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-apple-gray transition-colors"
          >
            <Menu size={20} className="text-apple-gray-200" />
          </button>

          {/* Search bar */}
          <div className={cn(
            "flex items-center transition-all duration-300",
            showSearch ? 'w-96' : 'w-auto'
          )}>
            {showSearch ? (
              <div className="relative w-full animate-fade-in">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-gray-100" size={18} />
                <input
                  type="text"
                  placeholder="Buscar clientes, perros, reservas..."
                  className="input-apple pl-10 pr-10 w-full"
                  autoFocus
                />
                <button
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-apple-gray-100 hover:text-apple-black"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-apple-gray hover:bg-apple-gray-300/50 transition-colors text-apple-gray-100"
              >
                <Search size={18} />
                <span className="text-sm">Buscar...</span>
                <kbd className="hidden lg:inline-flex px-2 py-0.5 text-xs bg-[var(--apple-white)] rounded border border-apple-gray-300 ml-2">
                  ⌘K
                </kbd>
              </button>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user && (
            <>
              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg hover:bg-apple-gray transition-colors"
                >
                  <Bell size={20} className="text-apple-gray-200" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#A14E4E] text-[#FDFCFA] text-xs font-medium rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-96 bg-[var(--apple-gray)] rounded-2xl shadow-xl border border-apple-gray-300/50 overflow-hidden animate-fade-in-scale">
                    <div className="p-4 border-b border-apple-gray-300/50 flex items-center justify-between">
                      <h3 className="font-semibold text-[var(--apple-black)]">Notificaciones</h3>
                      <button
                        className="text-sm text-[var(--apple-link)] hover:text-[#5A7D6E]"
                        onClick={() => useUIStore.getState().addNotification({ type: 'info', message: 'Marcar todas como leídas disponible próximamente' })}
                      >
                        Marcar todas como leídas
                      </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 hover:bg-apple-gray/50 transition-colors cursor-pointer border-b border-apple-gray-300/30 last:border-0",
                            !notification.read && 'bg-[#F2F5F4]/50'
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
                              <p className="font-medium text-[var(--apple-black)] text-sm">
                                {notification.title}
                              </p>
                              <p className="text-sm text-apple-gray-100 mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-xs text-apple-gray-300 mt-1">
                                {formatDistanceToNow(notification.time, { addSuffix: true, locale: es })}
                              </p>
                            </div>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-[#4A5D52] rounded-full flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-apple-gray-300/50">
                      <Link
                        to="/messages"
                        className="block text-center text-sm text-[var(--apple-link)] hover:text-[#5A7D6E] font-medium"
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
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-apple-gray transition-colors"
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-[var(--apple-white)]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4A5D52] to-[#5A7D6E] flex items-center justify-center text-[#FDFCFA] font-medium text-sm">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-[var(--apple-black)] leading-tight">
                      {user.firstName}
                    </p>
                    <p className="text-xs text-apple-gray-100 leading-tight capitalize">
                      {user.role.toLowerCase()}
                    </p>
                  </div>
                  <ChevronDown size={16} className="text-apple-gray-100 hidden md:block" />
                </button>

                {/* Profile dropdown */}
                {showProfile && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[var(--apple-gray)] rounded-2xl shadow-xl border border-apple-gray-300/50 overflow-hidden animate-fade-in-scale">
                    <div className="p-4 border-b border-apple-gray-300/50">
                      <p className="font-medium text-[var(--apple-black)]">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-apple-gray-100">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/account"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-apple-gray transition-colors text-[var(--apple-black)]"
                      >
                        <User size={18} className="text-apple-gray-100" />
                        <span className="text-sm">Mi cuenta</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-apple-gray transition-colors text-[var(--apple-black)]"
                      >
                        <Settings size={18} className="text-apple-gray-100" />
                        <span className="text-sm">Configuración</span>
                      </Link>
                      <Link
                        to="/about"
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-apple-gray transition-colors text-[var(--apple-black)]"
                      >
                        <HelpCircle size={18} className="text-apple-gray-100" />
                        <span className="text-sm">Sobre nosotros</span>
                      </Link>
                    </div>
                    <div className="p-2 border-t border-apple-gray-300/50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F3E5E5] transition-colors text-[#A14E4E]"
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
      </div>
    </header>
  );
}
