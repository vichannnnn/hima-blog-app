import { ButtonBase as Button } from '@components';
import { ButtonProps } from '@mui/material';
import { forwardRef, MouseEvent } from 'react';

interface HeaderRightButtonProps extends ButtonProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}
export const RightButton = forwardRef<HTMLButtonElement, HeaderRightButtonProps>(
  ({ onClick, children, ...props }, ref) => {
    return (
      <Button ref={ref} variant='outlined' onClick={onClick} {...props}>
        <div className='button-text'>{children}</div>
      </Button>
    );
  },
);
