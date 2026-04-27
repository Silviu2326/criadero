import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  LayoutDashboard,
  Dog,
  Users,
  CalendarDays,
  CheckSquare,
  Utensils,
  Baby,
  ClipboardList,
  Truck,
  Trophy,
  Dna,
  FolderOpen,
  Calendar,
  MessageSquare,
  Wallet,
  BarChart3,
  UserCog,
  Briefcase,
  Star,
  LogOut,
  Settings,
  ChevronLeft,
  PawPrint,
  Sun,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
  badge?: number;
  section?: string;
}

const principalNavItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Perros', path: '/dogs', icon: Dog, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Clientes', path: '/customers', icon: Users, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Reservas', path: '/reservations', icon: CalendarDays, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Tareas', path: '/tasks', icon: CheckSquare, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Nutrición', path: '/nutrition', icon: Utensils, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Camadas', path: '/litters', icon: Baby, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Inspecciones', path: '/inspections', icon: ClipboardList, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Logística', path: '/logistics', icon: Truck, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Exposiciones', path: '/shows', icon: Trophy, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Genética', path: '/genetics/pedigree', icon: Dna, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Documentos', path: '/documents', icon: FolderOpen, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Calendario', path: '/calendar', icon: Calendar, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Mensajes', path: '/messages', icon: MessageSquare, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
];

const adminNavItems: NavItem[] = [
  { label: 'Finanzas', path: '/finance', icon: Wallet, roles: ['MANAGER', 'BREEDER'], section: 'admin' },
  { label: 'Reportes', path: '/reports', icon: BarChart3, roles: ['MANAGER', 'BREEDER'], section: 'admin' },
  { label: 'Usuarios', path: '/users', icon: UserCog, roles: ['MANAGER'], section: 'admin' },
  { label: 'Staff', path: '/staff', icon: Briefcase, roles: ['MANAGER', 'BREEDER'], section: 'admin' },
  { label: 'Reputación', path: '/reputation', icon: Star, roles: ['MANAGER', 'BREEDER'], section: 'admin' },
];

const settingsNavItems: NavItem[] = [
  { label: 'Configuración', path: '/settings', icon: Settings, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'ajustes' },
  { label: 'Cerrar sesión', path: '#logout', icon: LogOut, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'ajustes' },
];

const sectionLabels: Record<string, string> = {
  principal: 'Principal',
  admin: 'Administración',
  ajustes: 'Ajustes',
};

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const userRole = user?.role || '';

  const filterByRole = (items: NavItem[]) => {
    return items.filter((item) => item.roles.includes(userRole));
  };

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path ||
      (item.path !== '#' && location.pathname.startsWith(`${item.path}/`));
    const isLogout = item.path === '#logout';

    if (isLogout) {
      return (
        <button
          key={item.path}
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 w-full',
            'text-white/60 hover:text-white hover:bg-white/10'
          )}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10">
            <Icon size={18} className="text-white/70" />
          </div>
          <span className="whitespace-nowrap">{item.label}</span>
        </button>
      );
    }

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
        className={cn(
          'flex items-center gap-3.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group',
          isActive
            ? 'bg-white/10 text-white'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        )}
      >
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 flex-shrink-0",
          isActive
            ? 'bg-accent-green shadow-md'
            : 'bg-white/10 group-hover:bg-white/15'
        )}>
          <Icon
            size={18}
            className={cn(
              "transition-all duration-200",
              isActive ? 'text-white' : 'text-white/70 group-hover:text-white'
            )}
          />
        </div>

        <span className="whitespace-nowrap">{item.label}</span>

        {item.badge && (
          <span className={cn(
            "ml-auto flex-shrink-0 min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full flex items-center justify-center",
            isActive
              ? 'bg-accent-green text-white'
              : 'bg-white/20 text-white'
          )}>
            {item.badge > 99 ? '99+' : item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  const renderSection = (items: NavItem[], sectionKey: string) => {
    const filtered = filterByRole(items);
    if (filtered.length === 0) return null;

    return (
      <div className="mb-5">
        <div className="px-3 mb-2">
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
            {sectionLabels[sectionKey]}
          </span>
        </div>
        <div className="space-y-1">
          {filtered.map(renderNavItem)}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2.5 rounded-xl shadow-lg lg:hidden hover:bg-[#094a3b] transition-colors"
        style={{ backgroundColor: '#0A4D3D' }}
      >
        {sidebarOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
      </button>

      {/* Sidebar */}
      <aside
        style={{ backgroundColor: '#0A4D3D' }}
        className={cn(
          'fixed left-0 top-0 bottom-0 w-[260px] z-40 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.12)]',
          'transition-transform duration-300 ease-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} className="text-white/70" />
          </button>
          <div className="relative w-9 h-9 rounded-xl bg-accent-green flex items-center justify-center flex-shrink-0 shadow-md">
            <PawPrint className="text-white" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white whitespace-nowrap text-sm tracking-tight">
              Petwelly
            </span>
            <span className="text-[9px] text-white/50 font-medium uppercase tracking-wider">
              ERP CRIADORES
            </span>
          </div>
          <button className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden lg:flex items-center justify-center">
            <ChevronLeft size={16} className="text-white/50" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-thin min-h-0">
          {renderSection(principalNavItems, 'principal')}
          {renderSection(adminNavItems, 'admin')}
          {renderSection(settingsNavItems, 'ajustes')}
        </nav>

        {/* User info at bottom */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            {user?.avatarUrl ? (
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-green rounded-full ring-2 ring-[#0A4D3D]" />
              </div>
            ) : (
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white font-semibold text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-accent-green rounded-full ring-2 ring-[#0A4D3D]" />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-white/50 capitalize font-medium">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Weather widget */}
          <div className="flex items-center gap-2 pt-3 border-t border-white/10">
            <Sun size={18} className="text-amber-400" />
            <span className="text-sm text-white/80 font-medium">18°C</span>
            <span className="text-xs text-white/50">Soleado</span>
          </div>
        </div>
      </aside>
    </>
  );
}
