import { forwardRef, MouseEvent } from 'react';
import { Button, ButtonProps } from '@mui/material';

interface ButtonBaseProps extends ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ onClick, children, ...props }, ref) => {
    return (
      <Button
        onClick={onClick}
        className=''
        ref={ref}
        variant='outlined'
        sx={{
          border: 'none',
          backgroundColor: '#BEADFA',
          color: 'black',
          paddingX: '30px',
          textTransform: 'capitalize',
          fontFamily: "font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          borderRadius: '10px',
          '&:hover': {
            backgroundColor: '#D0BFFF',
            border: 'none',
          },
          '&:focus': {
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          },
        }}
        {...props}
      >
        <div>{children}</div>
      </Button>
    );
  },
);
