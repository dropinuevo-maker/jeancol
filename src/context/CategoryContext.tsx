import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

import { Category, CategoryContextType } from '@/types';

export type { Category };

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async (retries = 3) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      if (retries > 0) {
        setTimeout(() => fetchCategories(retries - 1), 2000);
      } else {
        toast.error('Error al cargar categorías');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select();

      if (error) throw error;
      setCategories(prev => [...prev, data[0]]);
      return data[0];
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error al añadir categoría');
      throw error;
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...category } : c));
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error al actualizar categoría');
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error al eliminar categoría');
      throw error;
    }
  };

  const getCategoryByName = (name: string) => {
    return categories.find(c => c.name.toLowerCase() === name.toLowerCase() || c.slug.toLowerCase() === name.toLowerCase());
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory, loading: isLoading, getCategoryByName }}>
      {children}
    </CategoryContext.Provider>
  );
};

import { useProducts } from './ProductContext';

export const useCategoryCount = (categoryName: string) => {
  const { products } = useProducts();
  return products.filter(p => p.category === categoryName).length;
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
