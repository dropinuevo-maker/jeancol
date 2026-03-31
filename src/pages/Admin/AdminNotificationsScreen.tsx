import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Search, Filter, CheckCircle, Clock, 
  AlertCircle, ShoppingBag, UserPlus, Star,
  Trash2, MoreVertical, X, ArrowRight,
  Info, Settings, Mail, Smartphone, Zap,
  MessageSquare, Package, Truck, CreditCard
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'user' | 'system' | 'review' | 'inventory';
  status: 'unread' | 'read';
  createdAt: string;
  link?: string;
}

export const AdminNotificationsScreen = () => {
  const { theme } = useTheme();
  const { success, error, loading: toastLoading, dismiss } = useToast();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cargando notificaciones...</p>
        </div>
      </div>
    );
  }

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nuevo Pedido #1024',
      message: 'Juan Perez ha realizado un pedido de $120.000 COP',
      type: 'order',
      status: 'unread',
      createdAt: new Date().toISOString(),
      link: '/admin/orders'
    },
    {
      id: '2',
      title: 'Stock Bajo: Jeans Slim Fit',
      message: 'Quedan solo 2 unidades disponibles en inventario.',
      type: 'inventory',
      status: 'unread',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      link: '/admin/inventory'
    },
    {
      id: '3',
      title: 'Nueva Reseña de Producto',
      message: 'Andrés G. calificó con 5 estrellas el producto "Camisa Formal".',
      type: 'review',
      status: 'read',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      link: '/admin/reviews'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.status === filter;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: 'read' } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    success('Notificación eliminada');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
    success('Todas las notificaciones marcadas como leídas');
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order': return <ShoppingBag className="w-5 h-5 text-primary" />;
      case 'user': return <UserPlus className="w-5 h-5 text-blue-500" />;
      case 'inventory': return <Package className="w-5 h-5 text-amber-500" />;
      case 'review': return <Star className="w-5 h-5 text-emerald-500" />;
      case 'system': return <Settings className="w-5 h-5 text-zinc-500" />;
    }
  };

  const getBg = (type: Notification['type']) => {
    switch (type) {
      case 'order': return 'bg-primary/10';
      case 'user': return 'bg-blue-500/10';
      case 'inventory': return 'bg-amber-500/10';
      case 'review': return 'bg-emerald-500/10';
      case 'system': return 'bg-zinc-500/10';
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="flex items-center justify-between w-full">
            <div>
              <h1 className="text-lg lg:text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Notificaciones</h1>
              <p className="text-xs text-zinc-500 font-medium">Mantente al día con tu tienda</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={markAllAsRead}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[10px] font-black uppercase text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
              >
                Marcar todo como leído
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 lg:pb-0">
            {(['all', 'unread', 'read'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  filter === f
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {f === 'all' ? 'Todas' : f === 'unread' ? 'No leídas' : 'Leídas'}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredNotifications.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-zinc-900 p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 text-center"
                >
                  <Bell className="w-16 h-16 text-zinc-200 mx-auto mb-4" />
                  <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">Sin Notificaciones</h3>
                  <p className="text-sm text-zinc-500">Todo está al día por aquí.</p>
                </motion.div>
              ) : (
                filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group relative bg-white dark:bg-zinc-900 p-5 rounded-3xl border transition-all ${
                      notification.status === 'unread' 
                        ? 'border-primary/30 shadow-lg shadow-primary/5' 
                        : 'border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getBg(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm font-black uppercase tracking-tight ${
                            notification.status === 'unread' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'
                          }`}>
                            {notification.title}
                          </h3>
                          <span className="text-[10px] font-bold text-zinc-400">
                            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className={`text-sm mb-3 ${
                          notification.status === 'unread' ? 'text-zinc-600 dark:text-zinc-300' : 'text-zinc-500'
                        }`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3">
                          {notification.link && (
                            <button className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                              Ver Detalles <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                          {notification.status === 'unread' && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="text-[10px] font-black text-zinc-400 uppercase hover:text-primary transition-colors"
                            >
                              Marcar como leído
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {notification.status === 'unread' && (
                      <div className="absolute top-5 right-5 w-2 h-2 bg-primary rounded-full" />
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
    </div>
  </div>
  );
};
