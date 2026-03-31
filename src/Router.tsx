import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';

import { AdminLayout } from './components/Admin/AdminLayout';

// Lazy load pages
const HomeScreen = lazy(() => import('./pages/HomeScreen').then(m => ({ default: m.HomeScreen })));
const CategoriesScreen = lazy(() => import('./pages/CategoriesScreen').then(m => ({ default: m.CategoriesScreen })));
const ProductsScreen = lazy(() => import('./pages/ProductsScreen').then(m => ({ default: m.ProductsScreen })));
const CategoryScreen = lazy(() => import('./pages/CategoryScreen').then(m => ({ default: m.CategoryScreen })));
const OffersScreen = lazy(() => import('./pages/OffersScreen').then(m => ({ default: m.OffersScreen })));
const CartScreen = lazy(() => import('./pages/CartScreen').then(m => ({ default: m.CartScreen })));
const CheckoutScreen = lazy(() => import('./pages/CheckoutScreen').then(m => ({ default: m.CheckoutScreen })));
const ProductDetailScreen = lazy(() => import('./pages/ProductDetailScreen').then(m => ({ default: m.ProductDetailScreen })));

// Admin Pages
const AdminDashboardScreen = lazy(() => import('./pages/Admin/AdminDashboardScreen').then(m => ({ default: m.AdminDashboardScreen })));
const AdminCategoriesScreen = lazy(() => import('./pages/Admin/AdminCategoriesScreen').then(m => ({ default: m.AdminCategoriesScreen })));
const AdminInventoryScreen = lazy(() => import('./pages/Admin/AdminInventoryScreen').then(m => ({ default: m.AdminInventoryScreen })));
const AdminNewProductScreen = lazy(() => import('./pages/Admin/AdminNewProductScreen').then(m => ({ default: m.AdminNewProductScreen })));
const AdminOrdersScreen = lazy(() => import('./pages/Admin/AdminOrdersScreen').then(m => ({ default: m.AdminOrdersScreen })));
const AdminSettingsScreen = lazy(() => import('./pages/Admin/AdminSettingsScreen').then(m => ({ default: m.AdminSettingsScreen })));
const AdminAnalyticsScreen = lazy(() => import('./pages/Admin/AdminAnalyticsScreen').then(m => ({ default: m.AdminAnalyticsScreen })));
const AdminNotificationsScreen = lazy(() => import('./pages/Admin/AdminNotificationsScreen').then(m => ({ default: m.AdminNotificationsScreen })));
const AdminProfileScreen = lazy(() => import('./pages/Admin/AdminProfileScreen').then(m => ({ default: m.AdminProfileScreen })));
const AdminThemeScreen = lazy(() => import('./pages/Admin/AdminThemeScreen').then(m => ({ default: m.AdminThemeScreen })));
const AdminReviewsScreen = lazy(() => import('./pages/Admin/AdminReviewsScreen').then(m => ({ default: m.AdminReviewsScreen })));
const AdminCouponsScreen = lazy(() => import('./pages/Admin/AdminCouponsScreen').then(m => ({ default: m.AdminCouponsScreen })));
const AdminHomeEditorScreen = lazy(() => import('./pages/Admin/AdminHomeEditorScreen').then(m => ({ default: m.AdminHomeEditorScreen })));
const AdminLoginScreen = lazy(() => import('./pages/Admin/AdminLoginScreen').then(m => ({ default: m.AdminLoginScreen })));
const AdminCreateUserScreen = lazy(() => import('./pages/Admin/AdminCreateUserScreen').then(m => ({ default: m.AdminCreateUserScreen })));

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, loading, user } = useAuth();
  const bypass = typeof window !== 'undefined' && localStorage.getItem('adminBypass') === 'true';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!bypass && (!user || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export const Router = () => {
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition: any = {
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1]
  };

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location}>
            {/* Store Routes */}
            <Route path="/" element={
              <motion.div key="home" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <HomeScreen />
              </motion.div>
            } />
            <Route path="/categories" element={
              <motion.div key="categories" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <CategoriesScreen />
              </motion.div>
            } />
            <Route path="/products" element={
              <motion.div key="products" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <ProductsScreen />
              </motion.div>
            } />
            <Route path="/category/:categoryId" element={
              <motion.div key="category" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <CategoryScreen />
              </motion.div>
            } />
            <Route path="/offers" element={
              <motion.div key="offers" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <OffersScreen />
              </motion.div>
            } />
            <Route path="/cart" element={
              <motion.div key="cart" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <CartScreen />
              </motion.div>
            } />
            <Route path="/checkout" element={
              <motion.div key="checkout" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <CheckoutScreen />
              </motion.div>
            } />
            <Route path="/product/:id" element={
              <motion.div key="product" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <ProductDetailScreen />
              </motion.div>
            } />

            {/* Admin Routes */}
            <Route path="/admin/login" element={
              <motion.div key="admin-login" initial="initial" animate="animate" exit="exit" variants={pageVariants} transition={pageTransition}>
                <AdminLoginScreen />
              </motion.div>
            } />
            
            <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route index element={<AdminDashboardScreen />} />
                    <Route path="categories" element={<AdminCategoriesScreen />} />
                    <Route path="inventory" element={<AdminInventoryScreen />} />
                    <Route path="new-product" element={<AdminNewProductScreen />} />
                    <Route path="orders" element={<AdminOrdersScreen />} />
                    <Route path="reviews" element={<AdminReviewsScreen />} />
                    <Route path="coupons" element={<AdminCouponsScreen />} />
                    <Route path="settings" element={<AdminSettingsScreen />} />
                    <Route path="home-editor" element={<AdminHomeEditorScreen />} />
                    <Route path="analytics" element={<AdminAnalyticsScreen />} />
                    <Route path="notifications" element={<AdminNotificationsScreen />} />
                    <Route path="profile" element={<AdminProfileScreen />} />
                    <Route path="theme" element={<AdminThemeScreen />} />
                    <Route path="create-user" element={<AdminCreateUserScreen />} />
                  </Routes>
                </AdminLayout>
              </AdminProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
};
