import { HTMLAttributes, ReactNode } from 'react';
import './Title.css';

interface TitleProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}
export const Title = ({ children, className, ...props }: TitleProps) => {
  const combinedClassName = `title ${className || ''}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};
