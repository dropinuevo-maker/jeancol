import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageLoading = () => {
  const location = useLocation();

  useEffect(() => {
    // Simulate page loading or handle scroll
    window.scrollTo(0, 0);
  }, [location.pathname]);
};
