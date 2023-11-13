import { forwardRef, MouseEvent } from 'react';
import { Button, ButtonProps, SxProps, Theme } from '@mui/material';

interface ButtonBaseProps extends ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  sx?: SxProps<Theme>;
}

export const ButtonBase = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ onClick, sx, children, ...props }, ref) => {
    return (
      <Button
        onClick={onClick}
        className=''
        ref={ref}
        variant='outlined'
        sx={{
          border: 'none',
          backgroundColor: 'none',
          color: 'black',
          textTransform: 'capitalize',
          fontFamily: 'PatrickHandSC, sans-serif',
          padding: '8px 36px',
          fontSize: '36px',
          borderRadius: '50px',
          '&:hover': {
            backgroundColor: '#aed1ca',
            border: 'none',
          },
          '&:focus': {
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          },
          ...sx,
        }}
        {...props}
      >
        <div>{children}</div>
      </Button>
    );
  },
);
