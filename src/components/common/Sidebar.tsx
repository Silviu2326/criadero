import { NavLink, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  LayoutDashboard,
  Building2,
  Dog,
  Users,
  CalendarDays,
  Baby,
  Stethoscope,
  BarChart3,
  UserCog,
  Menu,
  X,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Calendar,
  FolderOpen,
  User,
  FileText,
  PawPrint,
  Sparkles,
  MessageCircle,
  CheckSquare,
  Utensils,
  Truck,
  Trophy,
  Dna,
  Star,
  ClipboardCheck,
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

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Criaderos', path: '/kennels', icon: Building2, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN', 'CUSTOMER'], section: 'principal' },
  { label: 'Perros', path: '/dogs', icon: Dog, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Clientes', path: '/customers', icon: Users, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Reservas', path: '/reservations', icon: CalendarDays, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Tareas', path: '/tasks', icon: CheckSquare, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Nutrición', path: '/nutrition', icon: Utensils, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Camadas', path: '/litters', icon: Baby, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Inspecciones', path: '/inspections', icon: ClipboardCheck, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'principal' },
  { label: 'Logística', path: '/logistics', icon: Truck, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Exposiciones', path: '/shows', icon: Trophy, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Genética', path: '/genetics/pedigree', icon: Dna, roles: ['MANAGER', 'BREEDER'], section: 'principal' },
  { label: 'Documentos', path: '/documents', icon: FolderOpen, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'gestion' },
  { label: 'Calendario', path: '/calendar', icon: Calendar, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'gestion' },
  { label: 'Veterinario', path: '/vet', icon: Stethoscope, roles: ['VETERINARIAN'], section: 'gestion' },
  { label: 'Finanzas', path: '/finance', icon: Wallet, roles: ['MANAGER', 'BREEDER'], section: 'admin' },
  { label: 'Reportes', path: '/reports', icon: BarChart3, roles: ['MANAGER', 'BREEDER'], section: 'admin' },
  { label: 'Usuarios', path: '/users', icon: UserCog, roles: ['MANAGER'], section: 'admin' },
  { label: 'Staff', path: '/staff', icon: Users, roles: ['MANAGER', 'BREEDER'], section: 'admin' },
  { label: 'Reputación', path: '/reviews', icon: Star, roles: ['MANAGER', 'BREEDER'], section: 'admin' },
  { label: 'Mensajes', path: '/messages', icon: MessageCircle, roles: ['MANAGER', 'BREEDER', 'VETERINARIAN'], section: 'gestion' },
];

// Customer portal navigation
const customerNavItems: NavItem[] = [
  { label: 'Mi Cuenta', path: '/account', icon: User, roles: ['CUSTOMER'] },
  { label: 'Mis Perros', path: '/my-dogs', icon: PawPrint, roles: ['CUSTOMER'] },
  { label: 'Mis Documentos', path: '/my-documents', icon: FileText, roles: ['CUSTOMER'] },
  { label: 'Mensajes', path: '/messages', icon: MessageCircle, roles: ['CUSTOMER'] },
];

const sectionLabels: Record<string, string> = {
  principal: 'Principal',
  gestion: 'Gestión',
  admin: 'Administración',
};

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, isSidebarCollapsed, toggleSidebarCollapse } = useUIStore();
  const location = useLocation();

  const allNavItems = user?.role === 'CUSTOMER' ? customerNavItems : navItems;
  const filteredNavItems = allNavItems.filter(
    (item) => user?.role && item.roles.includes(user.role)
  );

  // Group items by section
  const groupedItems = filteredNavItems.reduce((acc, item) => {
    const section = item.section || 'other';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-[var(--apple-black)]/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Toggle button for mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 bg-[var(--apple-gray)]/90 backdrop-blur rounded-xl shadow-lg lg:hidden
          hover:bg-[var(--apple-gray)] hover:shadow-xl hover:scale-105 transition-all duration-200 border border-[var(--apple-gray-300)]"
      >
        {sidebarOpen ? <X size={20} className="text-apple-gray-200" /> : <Menu size={20} className="text-apple-gray-200" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky lg:top-16 inset-y-0 left-0 z-40 bg-[var(--apple-gray)] h-screen lg:h-[calc(100vh-4rem)]',
          'transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col',
          'shadow-[4px_0_24px_rgba(44,42,38,0.02)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          isSidebarCollapsed ? 'w-[72px]' : 'w-72'
        )}
      >
        {/* Logo area */}
        <div className="h-18 flex items-center justify-between px-5 py-5 border-b border-[var(--apple-gray-300)]">
          <div className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            isSidebarCollapsed ? 'w-0 opacity-0' : 'w-full opacity-100'
          )}>
            <div className="relative w-10 h-10 rounded-xl bg-[#4A5D52]
              flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="text-[#FDFCFA]/90" size={18} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[var(--apple-black)] whitespace-nowrap text-base tracking-tight">
                Petwellly
              </span>
              <span className="text-[10px] text-apple-gray-100 font-medium uppercase tracking-wider">
                ERP Criadores
              </span>
            </div>
          </div>

          {/* Collapse toggle (desktop only) */}
          <button
            onClick={toggleSidebarCollapse}
            className={cn(
              "hidden lg:flex p-2 rounded-lg transition-all duration-200",
              "hover:bg-[var(--apple-gray-400)] active:scale-95",
              isSidebarCollapsed && 'mx-auto'
            )}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={18} className="text-apple-gray-100" />
            ) : (
              <ChevronLeft size={18} className="text-apple-gray-100" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin min-h-0">
          {Object.entries(groupedItems).map(([section, items]) => (
            <div key={section} className="mb-6">
              {/* Section label */}
              {!isSidebarCollapsed && sectionLabels[section] && (
                <div className="px-3 mb-2">
                  <span className="text-[10px] font-semibold text-apple-gray-100 uppercase tracking-wider">
                    {sectionLabels[section]}
                  </span>
                </div>
              )}
              {/* Divider for collapsed state */}
              {isSidebarCollapsed && sectionLabels[section] && (
                <div className="mx-auto w-8 h-px bg-[var(--apple-gray-300)] mb-4" />
              )}

              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path ||
                    location.pathname.startsWith(`${item.path}/`);

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative',
                        'outline-none focus-visible:ring-2 focus-visible:ring-[#4A5D52]/30',
                        isActive
                          ? 'bg-[var(--apple-blue-light)] text-[var(--apple-black)] shadow-sm'
                          : 'text-apple-gray-200 hover:text-[var(--apple-black)] hover:bg-[var(--apple-gray-400)]'
                      )}
                    >
                      {/* Active indicator bar */}
                      <div className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all duration-200",
                        isActive
                          ? 'bg-[#4A5D52] opacity-100'
                          : 'opacity-0'
                      )} />

                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                        isActive
                          ? 'bg-[#4A5D52] shadow-md'
                          : 'bg-[var(--apple-gray-400)] group-hover:bg-[var(--apple-white)] group-hover:shadow-sm'
                      )}>
                        <Icon
                          size={18}
                          className={cn(
                            "transition-all duration-200",
                            isActive
                              ? 'text-[#FDFCFA]'
                              : 'text-apple-gray-200 group-hover:text-[var(--apple-black)]'
                          )}
                        />
                      </div>

                      <span className={cn(
                        "whitespace-nowrap transition-all duration-300",
                        isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                      )}>
                        {item.label}
                      </span>

                      {/* Badge */}
                      {item.badge && (
                        <span className={cn(
                          "ml-auto flex-shrink-0 min-w-[20px] h-5 px-1.5 text-[10px] font-bold rounded-full flex items-center justify-center",
                          isActive
                            ? 'bg-[#4A5D52] text-[#FDFCFA] shadow-sm'
                            : 'bg-[#D2DCD7] text-[#4A5D52]'
                        )}>
                          {item.badge > 99 ? '99+' : item.badge}
                        </span>
                      )}

                      {/* Tooltip for collapsed state */}
                      {isSidebarCollapsed && (
                        <div className="absolute left-full ml-3 px-3 py-2 bg-[var(--apple-black)] text-[var(--apple-gray)] text-xs font-medium
                          rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible
                          transition-all duration-200 z-50 shadow-xl shadow-[var(--apple-black)]/20">
                          {item.label}
                          {item.badge && (
                            <span className="ml-2 px-1.5 py-0.5 bg-[#4A5D52] rounded-full text-[10px]">
                              {item.badge}
                            </span>
                          )}
                          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2
                            border-4 border-transparent border-r-[var(--apple-black)]" />
                        </div>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-3 border-t border-[var(--apple-gray-300)] space-y-1 bg-[var(--apple-gray-400)]/40">
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              'outline-none focus-visible:ring-2 focus-visible:ring-[#4A5D52]/30',
              isActive
                ? 'bg-[var(--apple-blue-light)] text-[var(--apple-black)]'
                : 'text-apple-gray-200 hover:text-[var(--apple-black)] hover:bg-[var(--apple-gray-400)]'
            )}
          >
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
              location.pathname === '/settings'
                ? 'bg-[#4A5D52] shadow-md'
                : 'bg-[var(--apple-gray-400)]'
            )}>
              <Settings size={18} className={cn(
                location.pathname === '/settings' ? 'text-[#FDFCFA]' : 'text-apple-gray-200'
              )} />
            </div>
            <span className={cn(
              "whitespace-nowrap transition-all duration-300",
              isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            )}>
              Configuración
            </span>
          </NavLink>

          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              'text-apple-gray-200 hover:text-[#A14E4E] hover:bg-[#F3E5E5]',
              'outline-none focus-visible:ring-2 focus-visible:ring-[#A14E4E]/40'
            )}
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--apple-gray-400)] group-hover:bg-[#F3E5E5] transition-colors">
              <LogOut size={18} />
            </div>
            <span className={cn(
              "whitespace-nowrap transition-all duration-300",
              isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            )}>
              Cerrar sesión
            </span>
          </button>
        </div>

        {/* User info at bottom */}
        <div className="p-4 border-t border-[var(--apple-gray-300)] bg-[var(--apple-gray)]">
          <div className="flex items-center gap-3">
            {user?.avatarUrl ? (
              <div className="relative">
                <img
                  src={user.avatarUrl}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[var(--apple-white)] shadow-md"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#5A7D6E] rounded-full ring-2 ring-[var(--apple-white)]" />
              </div>
            ) : (
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#4A5D52]
                  flex items-center justify-center text-[#FDFCFA] font-semibold text-sm shadow-md">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#5A7D6E] rounded-full ring-2 ring-[var(--apple-white)]" />
              </div>
            )}
            <div className={cn(
              "overflow-hidden transition-all duration-300",
              isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            )}>
              <p className="text-sm font-semibold text-[var(--apple-black)] truncate leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-apple-gray-100 capitalize font-medium">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
