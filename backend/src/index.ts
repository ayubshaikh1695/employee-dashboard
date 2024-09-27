import express from 'express';
import cors from 'cors'; // Import the cors middleware
import connectDB from './database';
import employeeRoutes from './routes/employeeRoutes';
import { updateEmployeeStatus } from './controller/employeeController';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount the employee routes
app.use('/api/employees', employeeRoutes);

// Action trigger route
app.use('/api/action', updateEmployeeStatus);

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
