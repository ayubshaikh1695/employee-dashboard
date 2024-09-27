'use client';

import { Employee } from '@/types/Employee';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type EmployeeContextType = {
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const EmployeeProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  return <EmployeeContext.Provider value={{ employees, setEmployees }}>{children}</EmployeeContext.Provider>;
};

export const useEmployeeContext = (): EmployeeContextType => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error('useEmployeeContext must be used within an EmployeeProvider');
  }
  return context;
};
