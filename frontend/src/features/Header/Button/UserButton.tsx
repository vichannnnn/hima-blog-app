import { useState, MouseEvent } from 'react';
import { ButtonBase } from '@components';
import { User } from '@providers';
import { useNavigation } from '@utils';
import { Menu, MenuItem } from '@mui/material';

interface UserButtonProps {
  user: User | null;
  logout: () => void;
}

export const UserButton = ({ user, logout }: UserButtonProps) => {
  const { goToCreateBlogPost } = useNavigation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className='user-button-container'>
      <ButtonBase
        id='user-button'
        className='user-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {user ? user.username : 'Account'}
      </ButtonBase>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-button',
        }}
      >
        <MenuItem onClick={goToCreateBlogPost}>Create a new blog post</MenuItem>
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>
    </div>
  );
};
