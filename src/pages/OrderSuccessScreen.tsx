import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, ShoppingBag, ArrowRight, 
  Package, Truck, Mail, Sparkles, 
  Zap, Heart, Star, Share2, Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const OrderSuccessScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.order;

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-zinc-300" />
        </div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-4">No se encontró el pedido</h1>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Header />

      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          {/* Success Message */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/20"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl lg:text-7xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-none mb-6">
                ¡Pedido <span className="text-green-500">Confirmado!</span>
              </h1>
              <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Gracias por confiar en nosotros. Tu pedido <span className="text-zinc-900 dark:text-white font-black">#{orderData.id}</span> ha sido recibido con éxito y está siendo procesado.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Order Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-zinc-50 dark:bg-zinc-900 rounded-[40px] p-10 border border-zinc-200 dark:border-zinc-800"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">Resumen del Pedido</h3>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-bottom border-zinc-200 dark:border-zinc-800">
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Fecha</span>
                  <span className="text-sm font-black text-zinc-900 dark:text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-bottom border-zinc-200 dark:border-zinc-800">
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Método de Pago</span>
                  <span className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-widest">{orderData.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-bottom border-zinc-200 dark:border-zinc-800">
                  <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Estado</span>
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest rounded-full">Procesando</span>
                </div>
                <div className="flex justify-between items-center pt-4">
                  <span className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tight">Total Pagado</span>
                  <span className="text-2xl font-black text-primary">${orderData.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-10 p-6 bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                <div className="flex items-center gap-3 mb-4">
                  <Truck className="w-5 h-5 text-zinc-400" />
                  <h4 className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Dirección de Envío</h4>
                </div>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  {orderData.shippingAddress.address}<br />
                  {orderData.shippingAddress.city}, {orderData.shippingAddress.state}<br />
                  {orderData.shippingAddress.zipCode}
                </p>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-primary rounded-[40px] p-10 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4 leading-none">Te hemos enviado <br /> un correo</h3>
                  <p className="text-white/80 text-sm font-medium mb-8 leading-relaxed">
                    Revisa tu bandeja de entrada para ver los detalles de tu pedido y el recibo de compra.
                  </p>
                  <button className="w-full py-4 bg-white text-primary rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Descargar Factura
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900 rounded-[40px] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Programa de Lealtad</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-4 leading-none">Has ganado <br /> <span className="text-primary">500 Puntos</span></h3>
                  <p className="text-white/60 text-sm font-medium mb-8 leading-relaxed">
                    ¡Felicidades! Por esta compra has acumulado puntos que podrás canjear en tu próximo pedido.
                  </p>
                  <Link to="/profile" className="flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:text-primary transition-colors">
                    Ver mis puntos <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/"
              className="w-full sm:w-auto px-12 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl text-sm font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              Seguir Comprando
            </Link>
            <button className="w-full sm:w-auto px-12 py-5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" /> Compartir Compra
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
