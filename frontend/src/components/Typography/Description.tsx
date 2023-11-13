import { HTMLAttributes, ReactNode } from 'react';
import './Description.css';

interface DescriptionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}
export const Description = ({ children, className, ...props }: DescriptionProps) => {
  const combinedClassName = `description ${className || ''}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};
