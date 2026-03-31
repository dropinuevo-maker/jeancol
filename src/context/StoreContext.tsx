import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import { StoreConfig, StoreContextType } from '../types';

const defaultConfig: StoreConfig = {
  name: 'JEANCOL Professional',
  logo: 'https://picsum.photos/seed/jeancol/200/200',
  favicon: 'https://picsum.photos/seed/jeancol/32/32',
  primaryColor: '#8b5cf6',
  contactEmail: 'contacto@jeancol.com',
  contactPhone: '+57 300 000 0000',
  address: 'Calle 123 #45-67, Bogotá, Colombia',
  socialLinks: {
    instagram: 'https://instagram.com/jeancol',
    facebook: 'https://facebook.com/jeancol',
    whatsapp: 'https://wa.me/573000000000',
  },
  isMaintenanceMode: false,
  heroTitle: 'JEANCOL PROFESSIONAL',
  heroSubtitle: 'La mejor calidad en moda profesional',
  description: 'Tienda oficial de JEANCOL Professional',
  banners: [
    {
      id: '1',
      image: 'https://picsum.photos/seed/banner1/1920/1080',
      title: 'Nueva Colección 2026',
      subtitle: 'Descubre lo último en tendencia profesional',
      buttonText: 'Comprar Ahora',
      buttonLink: '/category/all',
      order: 0
    },
    {
      id: '2',
      image: 'https://picsum.photos/seed/banner2/1920/1080',
      title: 'Ofertas de Temporada',
      subtitle: 'Hasta 50% de descuento en productos seleccionados',
      buttonText: 'Ver Ofertas',
      buttonLink: '/offers',
      order: 1
    }
  ],
  sections: [
    { id: '1', name: 'Categorías Populares', type: 'categories', active: true, order: 0 },
    { id: '2', name: 'Productos en Oferta', type: 'products', active: true, order: 1 },
    { id: '3', name: 'Nuevos Arribos', type: 'new_arrivals', active: true, order: 2 },
    { id: '4', name: 'Testimonios', type: 'testimonials', active: true, order: 3 },
    { id: '5', name: 'Blog', type: 'blog', active: false, order: 4 }
  ],
  trustItems: [
    { icon: 'Truck', title: 'Envío Express', description: 'Gratis en pedidos +$150' },
    { icon: 'ShieldCheck', title: 'Pago Seguro', description: 'Encriptación SSL 256-bit' },
    { icon: 'RotateCcw', title: 'Devolución Fácil', description: '30 días de garantía' },
    { icon: 'Headphones', title: 'Soporte 24/7', description: 'Atención personalizada' },
  ],
  testimonials: [
    {
      id: 1,
      name: 'Elena Rodríguez',
      role: 'Fashion Blogger',
      content: 'La calidad de las prendas es simplemente excepcional. El corte sastre y la atención al detalle superan cualquier expectativa.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: 5
    },
    {
      id: 2,
      name: 'Marco Vales',
      role: 'Arquitecto',
      content: 'Buscaba algo minimalista pero con carácter. Esta tienda se ha convertido en mi referente para el día a día profesional.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5
    },
    {
      id: 3,
      name: 'Sofía Martínez',
      role: 'Diseñadora UX',
      content: 'La experiencia de compra es tan fluida como sus diseños. El envío fue rapidísimo y el empaque es puro lujo.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      rating: 5
    }
  ],
  testimonialsTitle: 'Voces de Excelencia',
  testimonialsSubtitle: 'Comunidad',
  collectionsTitle: 'Colecciones Maestras',
  collectionsSubtitle: 'Explora los estilos que están definiendo la escena global este año.',
  featuredTitle: 'Lo Más Buscado',
  featuredSubtitle: 'Productos que definen tendencias.'
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);

  const setIsMaintenanceMode = (value: boolean) => {
    setConfig(prev => ({ ...prev, isMaintenanceMode: value }));
  };

  const getStoreName = () => config.name;
  const getLogo = () => config.logo;
  const getMaintenanceTimeLeft = () => {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_config')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setConfig({ ...defaultConfig, ...data });
    } catch (error) {
      console.error('Error fetching store config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateConfig = async (newConfig: Partial<StoreConfig>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('store_config')
        .upsert({ id: 1, ...config, ...newConfig });

      if (error) throw error;
      setConfig(prev => ({ ...prev, ...newConfig }));
      toast.success('Configuración actualizada');
      return true;
    } catch (error) {
      console.error('Error updating store config:', error);
      toast.error('Error al actualizar configuración. Intente de nuevo.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<StoreConfig>) => {
    return await updateConfig(newSettings);
  };

  return (
    <StoreContext.Provider value={{ 
      config, updateConfig, updateSettings, isLoading, loading: isLoading, 
      fetchConfig, setIsMaintenanceMode, getStoreName, getLogo, 
      getMaintenanceTimeLeft, settings: config 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
