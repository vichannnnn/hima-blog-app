import { ReactNode } from 'react';
import './Description.css';

interface DescriptionProps {
  children: ReactNode;
}
export const Description = ({ children }: DescriptionProps) => {
  return <div className='description'>{children}</div>;
};
