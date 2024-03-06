import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className = '', style }) => {
  return (
    <button
      onClick={onClick}
      style={style}
      className={`py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;