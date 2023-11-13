import { HTMLAttributes, ReactNode } from 'react';
import './ErrorText.css';

interface ErrorTextProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}
export const ErrorText = ({ children, className, ...props }: ErrorTextProps) => {
  const combinedClassName = `error-description ${className || ''}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};
