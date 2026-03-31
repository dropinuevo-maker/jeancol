import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, DollarSign, 
  ShoppingBag, Users, Eye, ArrowUpRight, 
  ArrowDownRight, Calendar, Filter, 
  Download, PieChart as PieChartIcon, 
  BarChart as BarChartIcon, LineChart as LineChartIcon,
  Activity, Target, Zap, Globe, Smartphone, Laptop,
  Package, Clock, CheckCircle2, AlertCircle,
  ChevronRight, MoreVertical, Search, X, Truck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, 
  PieChart, Pie, Cell, Line, ComposedChart, Legend
} from 'recharts';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { useCategories } from '../../context/CategoryContext';
import { formatPriceCOP } from '../../lib/utils';

const COLORS = ['#FF6321', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export const AdminDashboardScreen = () => {
  const { orders, stats, updateOrderStatus, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const isLoading = ordersLoading || productsLoading || categoriesLoading;

  // Mock data for charts
  const salesData = useMemo(() => [
    { name: 'Lun', sales: 4000, orders: 24 },
    { name: 'Mar', sales: 3000, orders: 18 },
    { name: 'Mie', sales: 2000, orders: 12 },
    { name: 'Jue', sales: 2780, orders: 16 },
    { name: 'Vie', sales: 1890, orders: 11 },
    { name: 'Sab', sales: 2390, orders: 14 },
    { name: 'Dom', sales: 3490, orders: 21 },
  ], []);

  const categoryData = useMemo(() => categories.map((cat, i) => ({
    name: cat.name,
    value: Math.floor(Math.random() * 100) + 20,
    color: COLORS[i % COLORS.length]
  })), [categories]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Cargando datos...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-500/10';
      case 'processing': return 'text-blue-500 bg-blue-500/10';
      case 'shipped': return 'text-amber-500 bg-amber-500/10';
      case 'cancelled': return 'text-red-500 bg-red-500/10';
      default: return 'text-zinc-400 bg-zinc-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle2;
      case 'processing': return Clock;
      case 'shipped': return Truck;
      case 'cancelled': return AlertCircle;
      default: return Package;
    }
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-4">
            Panel de <span className="text-primary">Control</span>
          </h1>
          <p className="text-zinc-500 font-medium">Bienvenido de nuevo. Aquí tienes un resumen de lo que está pasando en tu tienda.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Hoy es</p>
              <p className="text-lg font-black text-zinc-900 dark:text-white">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Ventas Totales', value: `$${formatPriceCOP(stats.totalRevenue)}`, icon: DollarSign, trend: '+12.5%', isUp: true, color: 'text-green-500' },
          { label: 'Pedidos', value: stats.totalOrders, icon: ShoppingBag, trend: '+8.2%', isUp: true, color: 'text-blue-500' },
          { label: 'Productos', value: products.length, icon: Package, trend: '+2.4%', isUp: true, color: 'text-amber-500' },
          { label: 'Clientes', value: '1,284', icon: Users, trend: '-3.1%', isUp: false, color: 'text-red-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-zinc-900 p-8 rounded-[40px] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all group"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                stat.isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              }`}>
                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <LineChartIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Rendimiento de Ventas</h3>
            </div>
            <select className="px-6 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
            </select>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6321" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF6321" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#999' }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 900, fill: '#999' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: 'none', 
                    borderRadius: '20px',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '900'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#FF6321" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Pedidos Recientes</h3>
            </div>
            <button className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-2xl text-zinc-400 hover:text-primary transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            {recentOrders.map((order, i) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl group hover:bg-primary transition-all cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getStatusColor(order.status)} group-hover:bg-white group-hover:text-primary transition-all`}>
                    {React.createElement(getStatusIcon(order.status), { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight group-hover:text-white transition-colors">#{order.id}</h4>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-white/60 transition-colors">{order.customerName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-zinc-900 dark:text-white group-hover:text-white transition-colors">${formatPriceCOP(order.total)}</p>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest group-hover:text-white/60 transition-colors">{new Date(order.date || order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
            Ver Todos los Pedidos
          </button>
        </div>
      </div>

      {/* Categories & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Distribution */}
        <div className="bg-white dark:bg-zinc-900 p-10 rounded-[48px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <PieChartIcon className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Ventas por Categoría</h3>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-[10px] font-black text-zinc-900 dark:text-white uppercase tracking-widest">{cat.name}</span>
                </div>
                <span className="text-[10px] font-black text-zinc-400">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-zinc-900 p-10 rounded-[48px] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          
          <div className="flex items-center gap-3 mb-10 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Productos Estrella</h3>
          </div>

          <div className="space-y-6 relative z-10">
            {products.slice(0, 4).map((product, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-3xl group hover:bg-primary transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10">
                    <img src={product.images?.[0] || product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-tight group-hover:text-white transition-colors">{product.name}</h4>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover:text-white/60 transition-colors">{product.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black group-hover:text-white transition-colors">{Math.floor(Math.random() * 100) + 50} Ventas</p>
                  <p className="text-[10px] font-black text-green-500 group-hover:text-white transition-colors">+15%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-[60px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 lg:p-12 overflow-y-auto">
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${getStatusColor(selectedOrder.status)}`}>
                      {React.createElement(getStatusIcon(selectedOrder.status), { className: "w-8 h-8" })}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Pedido #{selectedOrder.id}</h2>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{new Date(selectedOrder.date).toLocaleString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-500 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">Información del Cliente</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                          <Users className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Nombre</p>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">{selectedOrder.customerName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center">
                          <Globe className="w-5 h-5 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Dirección de Envío</p>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white">
                            {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mt-12 mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">Método de Pago</h3>
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">{selectedOrder.paymentMethod}</span>
                        <span className="text-xs font-black text-green-500 uppercase tracking-widest">Pagado</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest mb-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">Productos</h3>
                    <div className="space-y-4 mb-8">
                      {selectedOrder.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-700 flex items-center justify-center font-black text-xs">
                              {item.quantity}x
                            </div>
                            <div>
                              <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{item.name}</p>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{item.variation}</p>
                            </div>
                          </div>
                          <p className="text-sm font-black text-zinc-900 dark:text-white">${formatPriceCOP(item.price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="bg-zinc-900 p-8 rounded-[40px] text-white">
                      <div className="flex justify-between mb-4">
                        <span className="text-xs font-black text-white/40 uppercase tracking-widest">Subtotal</span>
                        <span className="text-sm font-black">${formatPriceCOP(selectedOrder.total - 15000)}</span>
                      </div>
                      <div className="flex justify-between mb-6">
                        <span className="text-xs font-black text-white/40 uppercase tracking-widest">Envío</span>
                        <span className="text-sm font-black text-green-500">Gratis</span>
                      </div>
                      <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                        <span className="text-lg font-black uppercase tracking-tight">Total</span>
                        <span className="text-3xl font-black text-primary">${formatPriceCOP(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 lg:p-12 bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex items-center gap-4">
                  <select 
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as any)}
                    className="flex-1 px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/10"
                  >
                    <option value="processing">Procesando</option>
                    <option value="shipped">Enviado</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
                <button className="px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                  Imprimir Factura
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
