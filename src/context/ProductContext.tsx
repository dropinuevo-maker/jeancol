import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { slugify } from '../lib/utils';

import { Product, ProductContextType } from '@/types';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async (retries = 3) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) {
        console.error('Supabase error fetching products:', error);
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      if (retries > 0) {
        setTimeout(() => fetchProducts(retries - 1), 2000);
      } else {
        toast.error('Error al cargar productos');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      // Strip non-database fields
      const { reviews, ...dbProduct } = product as any;
      
      // Ensure slug is present
      if (!dbProduct.slug && dbProduct.name) {
        dbProduct.slug = slugify(dbProduct.name);
      }
      
      const { data, error } = await supabase
        .from('products')
        .insert([dbProduct])
        .select();

      if (error) throw error;
      setProducts(prev => [data[0], ...prev]);
      return data[0];
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Error al añadir producto');
      throw error;
    }
  };

  const updateProduct = async (id: string, product: Partial<Product>) => {
    try {
      // Strip non-database fields
      const { reviews, id: _, ...dbProduct } = product as any;

      // Ensure slug is updated if name changes
      if (dbProduct.name && !dbProduct.slug) {
        dbProduct.slug = slugify(dbProduct.name);
      }

      const { error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...product } : p));
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error al actualizar producto');
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error al eliminar producto');
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading: isLoading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
