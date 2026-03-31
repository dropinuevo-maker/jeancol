import React from 'react';
import { LayoutDashboard, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const DevAdminButtons = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    localStorage.setItem('adminBypass', 'true');
    navigate(path);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] flex flex-col gap-3">
    </div>
  );
};
