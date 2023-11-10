import { useContext, useState, MouseEvent } from 'react';
import { ButtonBase } from '@components';
import { AuthContext, User } from '@providers';
import { useNavigation } from '@utils';
import { Menu, MenuItem } from '@mui/material';
import './UserButton.css';

interface LogInButtonProps {
  user: User | null;
}

interface UserButtonProps {
  user: User | null;
  logout: () => void;
}

const LogInButton = ({ user }: LogInButtonProps) => {
  const { goToLoginPage } = useNavigation();

  const handleLoginRedirect = () => {
    if (!user) {
      goToLoginPage();
    }
  };

  return (
    <>
      <ButtonBase className='user-button' onClick={handleLoginRedirect}>
        Log in
      </ButtonBase>
    </>
  );
};

const UserButton = ({ user, logout }: UserButtonProps) => {
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
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>
    </div>
  );
};

export const HeaderButton = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      {!user && <LogInButton user={user} />}
      {user && <UserButton user={user} logout={logout} />}
    </>
  );
};
