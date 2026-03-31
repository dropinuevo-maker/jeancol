import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  List, 
  ShoppingBag, 
  Users, 
  BarChart2, 
  Bell, 
  Settings, 
  Palette, 
  Star, 
  Ticket, 
  Home,
  LogOut,
  ChevronLeft,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: BarChart2, label: 'Analíticas', path: '/admin/analytics' },
  { icon: ShoppingBag, label: 'Pedidos', path: '/admin/orders' },
  { icon: Package, label: 'Inventario', path: '/admin/inventory' },
  { icon: List, label: 'Categorías', path: '/admin/categories' },
  { icon: Ticket, label: 'Cupones', path: '/admin/coupons' },
  { icon: Star, label: 'Reseñas', path: '/admin/reviews' },
  { icon: Bell, label: 'Notificaciones', path: '/admin/notifications' },
  { icon: Home, label: 'Editor Inicio', path: '/admin/home-editor' },
  { icon: Palette, label: 'Tema', path: '/admin/theme' },
  { icon: UserPlus, label: 'Crear Usuario', path: '/admin/create-user' },
  { icon: Settings, label: 'Configuración', path: '/admin/settings' },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const { signOut, user } = useAuth();

  return (
    <div className="hidden lg:flex w-72 min-h-screen bg-zinc-950 border-r border-zinc-800 flex-col sticky top-0 z-50">
      {/* Logo */}
      <div className="p-8 border-b border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)]">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-tighter">JEANCOL <span className="text-primary">Admin</span></h2>
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Professional v2.0</p>
            </div>
          </div>
          <NavLink
            to="/"
            className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all group relative"
            title="Volver a la tienda"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </NavLink>
        </div>
        <NavLink
          to="/"
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs font-bold uppercase tracking-wider"
        >
          <ChevronLeft className="w-3 h-3" />
          Volver a la tienda
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group relative ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-primary transition-colors'}`} />
              <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
        <div className="flex items-center gap-3 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 mb-4">
          <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <Users className="w-5 h-5 text-zinc-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-white uppercase tracking-widest truncate">Administrador</p>
            <p className="text-[8px] font-bold text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-4 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};
