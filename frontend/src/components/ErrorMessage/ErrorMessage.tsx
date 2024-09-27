import { FC } from 'react';
import { ErrorMessageProps } from './ErrorMessage.type';

const ErrorMessage: FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="flex items-center p-4 mb-4 text-red-700 bg-red-100 rounded-lg" role="alert">
      <svg
        className="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
        />
      </svg>
      <span className="font-medium">{message}</span>
    </div>
  );
};

export default ErrorMessage;
