import { useState, MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components';
import { User } from '@providers';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import LogoutIcon from '@mui/icons-material/ExitToApp';

interface UserButtonProps {
  user: User | null;
  logout: () => void;
}

export const UserButton = ({ user, logout }: UserButtonProps) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleGoToCreateBlogPost = () => {
    router.push('/create');
  };

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
      <Button
        id='user-button'
        className='user-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {user ? user.username : 'Account'}
      </Button>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-button',
        }}
      >
        <MenuItem onClick={handleGoToCreateBlogPost}>
          <ListItemIcon>
            <CreateIcon fontSize='small' />
          </ListItemIcon>
          New blog post
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize='small' />
          </ListItemIcon>
          Log Out
        </MenuItem>
      </Menu>
    </div>
  );
};
