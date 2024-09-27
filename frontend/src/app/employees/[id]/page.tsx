'use client';

import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Spinner from '@/components/Spinner/Spinner';
import { Employee } from '@/types/Employee';

const EmployeeDetails: FC = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    salary: '',
    joiningDate: '',
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get<Employee>(`http://localhost:5000/api/employees/${id}`);
        setEmployee(response.data);
        setFormData({
          name: response.data.name,
          position: response.data.position,
          department: response.data.department,
          salary: response.data.salary.toString(),
          joiningDate: new Date(response.data.joiningDate).toISOString().split('T')[0],
        });
      } catch (err) {
        setError('Error fetching employee details');
        console.error('Error fetching employee details:', err);
      }
    };

    if (id) fetchEmployee();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'salary' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const triggerAction = async () => {
    try {
      await axios.post('http://localhost:5000/api/action', {
        id,
        callbackURL: 'http://localhost:3000/api/callback',
      });
      alert('Action triggered, waiting for callback...');
    } catch (error) {
      console.error('Error triggering action', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedEmployee: Employee = {
        ...formData,
        _id: employee?._id || '',
        salary: parseFloat(formData.salary),
        joiningDate: new Date(formData.joiningDate),
        status: employee?.status || '',
      };

      const response = await axios.put(`http://localhost:5000/api/employees/${id}`, updatedEmployee);

      setEmployee(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Error updating employee details');
      console.error('Error updating employee details:', err);
    }
  };

  const handleCancel = () => {
    if (employee) {
      setFormData({
        name: employee.name,
        position: employee.position,
        department: employee.department,
        salary: employee.salary.toString(),
        joiningDate: new Date(employee.joiningDate).toISOString().split('T')[0],
      });
    }
    setIsEditing(false);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md my-6 w-full">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
            {employee.name[0]}
          </div>
          <h2 className="text-2xl font-semibold ml-4">{employee.name}</h2>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Position:</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Department:</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Salary:</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Joining Date:</label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <div>
              <strong>Position:</strong> {employee.position}
            </div>
            <div>
              <strong>Department:</strong> {employee.department}
            </div>
            <div>
              <strong>Salary:</strong> {employee.salary}
            </div>
            <div>
              <strong>Joining Date:</strong> {new Date(employee.joiningDate).toLocaleDateString()}
            </div>
            <div>
              <strong>Status:</strong> {employee.status}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={triggerAction}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
              >
                Trigger Action
              </button>
              <button
                onClick={handleEditToggle}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
