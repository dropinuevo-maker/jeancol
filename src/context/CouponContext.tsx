import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import { Coupon, CouponContextType } from '@/types';

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('validUntil', { ascending: true });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Error al cargar cupones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const addCoupon = async (coupon: Omit<Coupon, 'id' | 'usedCount'>) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([{ ...coupon, usedCount: 0 }])
        .select();

      if (error) throw error;
      setCoupons(prev => [...prev, data[0]]);
    } catch (error) {
      console.error('Error adding coupon:', error);
      toast.error('Error al añadir cupón');
    }
  };

  const updateCoupon = async (id: string, coupon: Partial<Coupon>) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update(coupon)
        .eq('id', id);

      if (error) throw error;
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...coupon } : c));
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error('Error al actualizar cupón');
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Error al eliminar cupón');
    }
  };

  const toggleCouponStatus = async (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return;
    await updateCoupon(id, { isActive: !coupon.isActive });
  };

  const validateCoupon = async (code: string, subtotal: number) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) return null;

    const now = new Date();
    if (coupon.validFrom && new Date(coupon.validFrom) > now) return null;
    if (coupon.validUntil && new Date(coupon.validUntil) < now) return null;
    if (coupon.minPurchase && subtotal < coupon.minPurchase) return null;
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return null;

    return coupon;
  };

  return (
    <CouponContext.Provider value={{ coupons, addCoupon, updateCoupon, deleteCoupon, toggleCouponStatus, validateCoupon, loading: isLoading, fetchCoupons }}>
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (context === undefined) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
};
