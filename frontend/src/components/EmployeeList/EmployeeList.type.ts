import { Employee } from '@/types/Employee';

export interface EmployeeListProps {
  employees: Employee[];
  error: string | null;
  onDeleteEmployee: (id: string) => void;
}
