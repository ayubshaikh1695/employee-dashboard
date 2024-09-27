'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import { EmployeeListProps } from './EmployeeList.type';

const EmployeeList: FC<EmployeeListProps> = ({ employees, error, onDeleteEmployee }): JSX.Element => {
  const router = useRouter();
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Employee List</h2>
      {error ? (
        <ErrorMessage message={error} />
      ) : (
        <ul className="space-y-4">
          {employees.map((employee) => (
            <li
              key={employee._id}
              className="border p-4 rounded-lg transition-colors duration-200 cursor-pointer flex justify-between items-center bg-white hover:bg-gray-100"
              onClick={() => router.push(`/employees/${employee._id}`)}
            >
              <div>
                <div className="font-semibold">{employee.name}</div>
                <div>
                  {employee.position} ({employee.department}) - Status: {employee.status}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteEmployee(employee._id);
                }}
                className="bg-red-500 text-white rounded px-2 py-1 hover:bg-red-600 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeList;
