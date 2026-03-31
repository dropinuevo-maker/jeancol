import React from 'react';
import { 
  Zap, 
  Flame, 
  Gift,
  CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { Helmet } from 'react-helmet-async';

import { useProducts } from '../context/ProductContext';

export const OffersScreen = () => {
  const navigate = useNavigate();
  const { products } = useProducts();

  const productsWithOffers = products.filter(p => {
    const offerPrice = Number(p.offerPrice);
    const discount = Number(p.discount);
    const hasOffer = (offerPrice > 0) || (discount > 0);
    return hasOffer;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 pb-20">
      <Helmet>
        <title>Ofertas | JEANCOL</title>
        <meta name="description" content="Aprovecha las mejores ofertas y descuentos en moda exclusiva." />
      </Helmet>

      {/* Header Hero */}
      <div className="relative bg-gradient-to-br from-primary to-orange-600 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/30 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{ opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-500/20 blur-[100px] rounded-full"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <span className="bg-white/20 backdrop-blur-xl text-white px-4 md:px-6 py-2 md:py-3 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em] border border-white/30 shadow-2xl flex items-center gap-2">
                <Zap className="w-4 h-4 fill-white" />
                Ofertas por Tiempo Limitado
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white uppercase tracking-tighter italic leading-[0.9] drop-shadow-2xl"
            >
              Liquidación <span className="text-zinc-950">Exclusiva</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-white/80 md:text-white/90 text-sm md:text-base lg:text-lg max-w-xl mx-auto font-medium"
            >
              Cada producto tiene su propio tiempo de oferta. ¡No te los pierdas!
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
            >
              <button 
                onClick={() => navigate('/categories')}
                className="px-6 md:px-8 py-3 md:py-4 bg-white text-primary rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-zinc-100 transition-all shadow-2xl"
              >
                Ver Categorías
              </button>
              <button 
                onClick={() => navigate('/products')}
                className="px-6 md:px-8 py-3 md:py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-white/30 transition-all"
              >
                Ver Novedades
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 -mb-px">
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[80px]">
            <path d="M0,50 C240,100 480,0 720,50 C960,100 1200,0 1440,50 L1440,100 L0,100 Z" fill="currentColor" className="text-zinc-50 dark:text-zinc-950" />
          </svg>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-6 md:py-10 bg-background/50">
        <div className="w-full px-4 lg:px-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <h2 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tight">Productos en Oferta</h2>
            </div>
            <span className="text-xs font-medium text-foreground-muted">{productsWithOffers.length} productos</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
            {productsWithOffers.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
                showCountdown={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-10 px-4 lg:px-8 w-full">
        <div className="relative rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-orange-500 p-6 md:p-10">
          <div className="absolute inset-0 opacity-20">
            <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1920&q=80" className="w-full h-full object-cover" alt="" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-2">
                <Gift className="w-4 h-4 text-white" />
                <span className="text-white text-xs font-black uppercase tracking-wider">Código Exclusivo</span>
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white uppercase tracking-tight mb-1">
                10% Extra con <span className="text-zinc-950">WELCOME10</span>
              </h2>
              <p className="text-white/80 text-sm">En tu primera compra</p>
            </div>
            <button className="bg-white text-primary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-zinc-950 hover:text-white transition-all shadow-lg whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4 inline mr-2" />
              Copiar Código
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
