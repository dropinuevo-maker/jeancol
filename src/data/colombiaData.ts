import React from 'react';
import { DEPARTMENTS } from '@/constants';

export const COLOMBIAN_DEPARTMENTS = DEPARTMENTS;

export const getCitiesByDepartment = (department: string) => {
  return (COLOMBIA_DATA.cities as any)[department] || [];
};

export const COLOMBIA_DATA = {
  departments: DEPARTMENTS,
  cities: {
    'Antioquia': ['Medellín', 'Envigado', 'Itagüí', 'Bello', 'Rionegro'],
    'Atlántico': ['Barranquilla', 'Soledad', 'Puerto Colombia'],
    'Bogotá': ['Bogotá D.C.'],
    'Valle del Cauca': ['Cali', 'Palmira', 'Tuluá', 'Buenaventura'],
    // ... more cities
  },
  shippingRates: {
    'Bogotá': 8000,
    'Medellín': 12000,
    'Cali': 12000,
    'Barranquilla': 15000,
    'default': 15000
  }
};
