import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { CategoryProvider } from './context/CategoryContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';
import { StoreProvider } from './context/StoreContext';
import { CouponProvider } from './context/CouponContext';
import { LoadingProvider } from './context/LoadingContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import '@/lib/i18n';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <ToastProvider>
            <LoadingProvider>
              <AuthProvider>
                <StoreProvider>
                  <CategoryProvider>
                    <ProductProvider>
                      <CartProvider>
                        <OrderProvider>
                          <ReviewProvider>
                            <CouponProvider>
                              {children}
                            </CouponProvider>
                          </ReviewProvider>
                        </OrderProvider>
                      </CartProvider>
                    </ProductProvider>
                  </CategoryProvider>
                </StoreProvider>
              </AuthProvider>
            </LoadingProvider>
          </ToastProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  );
};
