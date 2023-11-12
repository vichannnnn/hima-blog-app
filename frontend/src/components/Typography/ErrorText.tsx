import { ReactNode } from 'react';
import './ErrorText.css';

interface ErrorTextProps {
  children: ReactNode;
}
export const ErrorText = ({ children }: ErrorTextProps) => {
  return <div className='error-description'>{children}</div>;
};
