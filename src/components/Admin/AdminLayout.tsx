import React from 'react';
import { AdminSidebar } from './AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, BarChart2, ShoppingBag, Package, Bell, Settings, MoreHorizontal, X, Star, Tag, Users, Home } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { id: 'adminDashboard', label: 'Inicio', icon: LayoutDashboard, path: '/admin' },
  { id: 'adminInventory', label: 'Stock', icon: Package, path: '/admin/inventory' },
  { id: 'adminOrders', label: 'Pedidos', icon: ShoppingBag, path: '/admin/orders' },
];

const moreItems = [
  { id: 'adminAnalytics', label: 'Análisis', icon: BarChart2, path: '/admin/analytics' },
  { id: 'adminReviews', label: 'Reseñas', icon: Star, path: '/admin/reviews' },
  { id: 'adminCoupons', label: 'Cupones', icon: Tag, path: '/admin/coupons' },
  { id: 'adminCustomers', label: 'Clientes', icon: Users, path: '/admin/customers' },
  { id: 'adminHomeEditor', label: 'Editor Inicio', icon: Home, path: '/admin/home-editor' },
  { id: 'adminSettings', label: 'Ajustes', icon: Settings, path: '/admin/settings' },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const isHomeEditor = location.pathname === '/admin/home-editor';

  return (
    <div className="flex h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden">
      {/* Sidebar */}
      {!isHomeEditor && <AdminSidebar />}

      {/* Main Content */}
      <main className={`flex-1 h-full overflow-y-auto overflow-x-hidden relative ${!isHomeEditor ? 'pb-20 lg:pb-0' : ''}`}>
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full animate-pulse delay-1000" />
        </div>

        <div className="relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      {!isHomeEditor && (
        <>
          <AnimatePresence>
            {isMoreMenuOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-[2.5rem] z-[60] lg:hidden p-8 shadow-2xl border-t border-zinc-100 dark:border-zinc-800"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Más Opciones</h3>
                    <button 
                      onClick={() => setIsMoreMenuOpen(false)}
                      className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {moreItems.map((item) => (
                      <Link
                        key={item.id}
                        to={item.path}
                        onClick={() => setIsMoreMenuOpen(false)}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all ${
                          isActive(item.path) 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-zinc-50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        <item.icon className="w-6 h-6" />
                        <span className="text-[9px] font-bold uppercase tracking-tighter text-center leading-tight">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <nav className={`lg:hidden fixed bottom-4 left-4 right-4 h-16 flex justify-around items-center z-50 rounded-2xl border shadow-2xl backdrop-blur-xl ${
            isDark 
              ? 'bg-zinc-900/90 border-white/10' 
              : 'bg-white/90 border-zinc-200'
          }`}>
            <div className="flex items-center justify-around w-full px-2">
              <Link
                to="/"
                className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-all ${
                  isDark ? 'text-zinc-500' : 'text-zinc-400'
                }`}
              >
                <Home className="w-5 h-5" />
                <span className="text-[7px] font-black uppercase tracking-tighter leading-none">Tienda</span>
              </Link>
              <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-1" />
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-all ${
                    isActive(item.path) 
                      ? 'text-primary bg-primary/10' 
                      : isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'scale-110' : ''}`} />
                  <span className="text-[7px] font-black uppercase tracking-tighter leading-none">{item.label}</span>
                </Link>
              ))}
              <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-800 mx-1" />
              <button
                onClick={() => setIsMoreMenuOpen(true)}
                className={`flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-xl transition-all ${
                  isMoreMenuOpen 
                    ? 'text-primary bg-primary/10' 
                    : isDark ? 'text-zinc-500' : 'text-zinc-400'
                }`}
              >
                <MoreHorizontal className={`w-5 h-5 ${isMoreMenuOpen ? 'scale-110' : ''}`} />
                <span className="text-[7px] font-black uppercase tracking-tighter leading-none">Más</span>
              </button>
            </div>
          </nav>
        </>
      )}
    </div>
  );
};
