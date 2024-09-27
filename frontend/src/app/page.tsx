'use client';

import { useEffect, useState } from 'react';
import { useEmployeeContext } from '@/context/EmployeeContext';
import axios from 'axios';
import CreateEmployee from '@/components/CreateEmployee/CreateEmployee';
import EmployeeList from '@/components/EmployeeList/EmployeeList';
import { Employee } from '@/types/Employee';
import Spinner from '@/components/Spinner/Spinner';
import { EMPLOYEE_API_URL } from '@/constants/endpoints';

export default function Home(): JSX.Element {
  const { employees, setEmployees } = useEmployeeContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Employee[]>(EMPLOYEE_API_URL);
        if (response.data.length === 0) {
          setError('No employees found');
        } else {
          setEmployees(response.data);
        }
      } catch (err) {
        setError('Error fetching employees');
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [setEmployees]);

  const refreshEmployeeList = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Employee[]>(EMPLOYEE_API_URL);
      if (response.data.length === 0) {
        setError('No employees found');
      } else {
        setError(null);
        setEmployees(response.data);
      }
    } catch (err) {
      setError('Error fetching employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeCreated = () => {
    refreshEmployeeList();
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await axios.delete(`${EMPLOYEE_API_URL}/${id}`);
      refreshEmployeeList();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  return (
    <div className="h-screen grid grid-rows-[auto,1fr] bg-gray-50 overflow-hidden">
      <div className="shadow-md bg-white p-4 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-center">Welcome to the Employee Dashboard</h1>
      </div>
      <div className="mx-auto px-4 pb-4 overflow-y-auto md:grid md:grid-rows-[auto,1fr] md:overflow-hidden">
        <CreateEmployee onEmployeeCreated={handleEmployeeCreated} />
        <div className="md:overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center">
              <Spinner />
            </div>
          ) : (
            <EmployeeList employees={employees} error={error} onDeleteEmployee={handleDeleteEmployee} />
          )}
        </div>
      </div>
    </div>
  );
}
