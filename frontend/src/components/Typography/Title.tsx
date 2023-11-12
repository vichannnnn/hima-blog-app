import { ReactNode } from 'react';
import './Title.css';

interface TitleProps {
  children: ReactNode;
}
export const Title = ({ children }: TitleProps) => {
  return <div className='title'>{children}</div>;
};
