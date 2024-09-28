import { useState } from 'react';
import axios from 'axios';
import { CreateEmployeeProps } from './CreateEmployee.type';
import { EMPLOYEE_API_URL } from '@/constants/endpoints';
import { toast } from 'react-hot-toast';

const CreateEmployee: React.FC<CreateEmployeeProps> = ({ onEmployeeCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    salary: '',
    joiningDate: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'salary' && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { salary, ...rest } = formData;
    const numericSalary = parseFloat(salary);

    if (numericSalary < 0) {
      toast.error('Salary cannot be negative.');
      return;
    }

    setLoading(true);

    try {
      await axios.post(EMPLOYEE_API_URL, { ...rest, salary: numericSalary });

      toast.success('Employee created successfully.');
      setFormData({ name: '', position: '', department: '', salary: '', joiningDate: '' });
      onEmployeeCreated();
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error('Error creating employee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto p-4 bg-white rounded-lg shadow-md my-6">
      <h2 className="text-xl font-semibold mb-4 text-left">Create Employee</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[120px]">
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
        <div className="flex-1 min-w-[120px]">
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
        <div className="flex-1 min-w-[120px]">
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
        <div className="flex-1 min-w-[120px]">
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
        <div className="flex-1 min-w-[120px]">
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
        <div className="flex justify-end w-full mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition sm:w-auto w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
