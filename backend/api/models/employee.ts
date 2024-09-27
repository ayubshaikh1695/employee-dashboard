import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: 'Pending', // Pending, Action in Progress, Action Completed
  },
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
