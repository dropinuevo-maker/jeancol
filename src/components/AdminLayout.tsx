import React, { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Tag, 
  Ticket, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Bell,
  Search,
  User,
  Star,
  Activity,
  Palette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { STORE_NAME } from '@/constants';

export const AdminLayout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // En un entorno real, verificaríamos si el usuario es admin
  // if (!user) return <Navigate to="/admin/login" />;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Inventario', path: '/admin/inventory' },
    { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders' },
    { icon: Tag, label: 'Categorías', path: '/admin/categories' },
    { icon: Ticket, label: 'Cupones', path: '/admin/coupons' },
    { icon: Star, label: 'Reseñas', path: '/admin/reviews' },
    { icon: Bell, label: 'Notificaciones', path: '/admin/notifications' },
    { icon: Activity, label: 'Analíticas', path: '/admin/analytics' },
    { icon: Palette, label: 'Tema', path: '/admin/theme' },
    { icon: User, label: 'Perfil', path: '/admin/profile' },
    { icon: Settings, label: 'Configuración', path: '/admin/settings' },
  ];

  const currentPath = location.pathname.split('/').pop() || 'Dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans selection:bg-primary/10 selection:text-primary">
      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-100 transition-all duration-500 ease-in-out z-50 flex flex-col sticky top-0 h-screen shadow-sm",
        isSidebarOpen ? "w-80" : "w-24"
      )}>
        <div className="h-24 flex items-center justify-between px-8">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tighter text-gray-900 block leading-none">
                    {STORE_NAME.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-black text-primary tracking-[0.2em] uppercase">Admin Panel</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="logo-collapsed"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="mx-auto w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20"
              >
                <ShoppingBag size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-grow px-6 space-y-2 overflow-y-auto custom-scrollbar pt-4">
          {isSidebarOpen && (
            <div className="mb-6 px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Menú Principal</div>
          )}
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center p-4 rounded-2xl transition-all group relative",
                  isActive 
                    ? "bg-primary text-white shadow-xl shadow-primary/20" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                )}
              >
                <item.icon size={22} className={cn("shrink-0 transition-transform group-hover:scale-110", !isSidebarOpen && "mx-auto")} />
                {isSidebarOpen && (
                  <span className="ml-4 font-black text-xs uppercase tracking-widest">{item.label}</span>
                )}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-4 py-2 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[60] shadow-xl">
                    {item.label}
                  </div>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-gray-50 space-y-4">
          {isSidebarOpen && (
            <Link 
              to="/" 
              target="_blank"
              className="flex items-center justify-between w-full px-4 py-4 text-gray-500 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest bg-gray-50 rounded-2xl group"
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Ver Tienda</span>
              </div>
            </Link>
          )}

          <div className={cn(
            "flex items-center gap-4 p-4 bg-gray-50 rounded-[1.5rem] transition-all",
            !isSidebarOpen && "justify-center p-2"
          )}>
            <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 font-black shrink-0 overflow-hidden">
              {profile?.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                profile?.name?.substring(0, 2).toUpperCase() || 'AD'
              )}
            </div>
            {isSidebarOpen && (
              <div className="flex-grow min-w-0">
                <p className="text-xs font-black text-gray-900 truncate uppercase tracking-tight">
                  {profile?.name} {profile?.lastName}
                </p>
                <p className="text-[10px] font-bold text-gray-400 truncate">{profile?.email}</p>
              </div>
            )}
            <button 
              onClick={() => signOut()}
              className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 hover:bg-gray-100 rounded-2xl text-gray-500 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span className="hover:text-primary cursor-pointer transition-colors">ADMIN</span>
              <ChevronRight size={14} className="mx-3 text-gray-300" />
              <span className="text-gray-900">
                {currentPath.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="BUSCAR..."
                className="pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none w-64 transition-all"
              />
            </div>
            <button className="p-3 hover:bg-gray-100 rounded-2xl text-gray-500 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-px bg-gray-100"></div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-black text-gray-900 uppercase tracking-tight">{profile?.name}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{profile?.role === 'admin' ? 'Super Admin' : 'Admin'}</div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500 font-black border-2 border-white shadow-sm hover:scale-105 transition-transform cursor-pointer overflow-hidden">
                {profile?.avatar ? (
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                ) : (
                  profile?.name?.substring(0, 2).toUpperCase() || 'AD'
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-[1600px] mx-auto w-full flex-grow">
          <Outlet />
        </div>

        <footer className="p-10 border-t border-gray-100 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            &copy; {new Date().getFullYear()} {STORE_NAME.toUpperCase()} &bull; PANEL DE CONTROL v2.0
          </p>
        </footer>
      </main>
    </div>
  );
};
