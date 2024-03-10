import { forwardRef, MouseEvent } from 'react';
import { Button as ButtonBase, ButtonProps, SxProps, Theme } from '@mui/material';

interface ButtonBaseProps extends ButtonProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  sx?: SxProps<Theme>;
  href?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonBaseProps>(
  ({ onClick, sx, href, children, ...props }, ref) => {
    return (
      <ButtonBase
        onClick={onClick}
        className=''
        ref={ref}
        href={href}
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
            backgroundColor: '#b8e9f7',
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
      </ButtonBase>
    );
  },
);

Button.displayName = 'Button';
