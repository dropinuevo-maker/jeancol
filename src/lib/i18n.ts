import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        translation: {
          'welcome': 'Bienvenido a JeanCol',
          'shop_now': 'Comprar ahora',
          'featured_products': 'Productos destacados',
          'categories': 'Categorías',
          'cart': 'Carrito',
          'checkout': 'Finalizar compra',
          'admin_panel': 'Panel de Administración',
          'search_placeholder': 'Buscar productos...',
          'free_shipping': 'Envío gratis por compras superiores a {{amount}}',
        }
      },
      en: {
        translation: {
          'welcome': 'Welcome to JeanCol',
          'shop_now': 'Shop Now',
          'featured_products': 'Featured Products',
          'categories': 'Categories',
          'cart': 'Cart',
          'checkout': 'Checkout',
          'admin_panel': 'Admin Panel',
          'search_placeholder': 'Search products...',
          'free_shipping': 'Free shipping on orders over {{amount}}',
        }
      }
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
