import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, CartContextType, Coupon } from '@/types';
import toast from 'react-hot-toast';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('jeancol_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('jeancol_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    setCart(prev => {
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedSize === size && 
        item.colors?.find((c: { name: string }) => c.name === color)
      );
      
      if (existing) {
        toast.success(`Añadido otro ${product.name}`);
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size)
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      toast.success(`${product.name} añadido al carrito`);
      return [...prev, { ...product, quantity, selectedSize: size }];
    });
  };

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart(prev => prev.filter(item => 
      !(item.id === productId && item.selectedSize === size)
    ));
  };

  const removeItem = removeFromCart;

  const updateQuantity = (productId: string, size: string | undefined, color: string | undefined, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      (item.id === productId && item.selectedSize === size) ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setCart([]);

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const FREE_SHIPPING_THRESHOLD = 200000;
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const getDiscount = () => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent' || appliedCoupon.type === 'percentage') {
      return subtotal * (appliedCoupon.discount / 100);
    }
    return appliedCoupon.discount;
  };

  const discount = getDiscount();
  const finalTotal = subtotal - discount;

  const getSubtotal = () => subtotal;
  const getTotal = () => finalTotal;

  return (
    <CartContext.Provider value={{ 
      cart, items: cart, addToCart, removeFromCart, removeItem, updateQuantity, clearCart, 
      totalItems, subtotal, totalPrice: subtotal, isOpen, setIsOpen, getSubtotal, getTotal,
      freeShippingProgress, remainingForFreeShipping, freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      appliedCoupon, setAppliedCoupon,
      discount, finalTotal, addItem: addToCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
