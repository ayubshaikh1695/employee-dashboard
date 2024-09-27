import { Request, Response } from 'express';
import Employee from '../models/employee';
import axios from 'axios';
import { EMPLOYEE_STATUS } from '../constants';

export const updateEmployeeStatus = async (req: Request, res: Response) => {
  const { id, callbackUrl } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    if (employee.status === EMPLOYEE_STATUS.action_completed) {
      return res
        .status(400)
        .json({ message: 'Employee status is already completed' });
    }

    if (employee.status === EMPLOYEE_STATUS.action_in_progress) {
      return res
        .status(400)
        .json({ message: 'Employee status update is in progress' });
    }

    if (employee.status === EMPLOYEE_STATUS.pending) {
      employee.status = EMPLOYEE_STATUS.action_in_progress;
      await employee.save();

      const progressMessage = `${employee.name}'s status was updated to "Action in Progress".`;

      res.json({ message: progressMessage });

      setTimeout(async () => {
        employee.status = EMPLOYEE_STATUS.action_completed;
        await employee.save();

        const resultMessage = `${employee.name}'s status was updated to "Action Completed".`;

        if (callbackUrl) {
          await triggerCallback(callbackUrl, {
            success: true,
            message: resultMessage,
            employeeId: employee._id,
          });
        }
      }, 5000);
    } else {
      return res.status(400).json({
        message: 'Employee status must be pending to start the action.',
      });
    }
  } catch (error) {
    console.error('Error updating employee status:', error);
    res.status(500).json({ message: 'Error updating employee status' });

    if (callbackUrl) {
      setTimeout(async () => {
        await triggerCallback(callbackUrl, {
          success: false,
          message: 'Error updating employee status',
          employeeId: id,
        });
      }, 5000);
    }
  }
};

const triggerCallback = async (callbackUrl: string, data: object) => {
  try {
    const response = await axios.post(callbackUrl, data);
    console.log('Callback response:', response.data);
  } catch (error: any) {
    console.error('Error triggering callback:', error.message);
  }
};
