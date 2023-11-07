import { ReactNode, useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserButton } from './UserButton';
import { AuthContext, MediaQueryContext } from '@providers';
import { useNavigation } from '@utils';
import HomeIcon from '@mui/icons-material/Home';
import ExitToApp from '@mui/icons-material/ExitToApp';
import VpnKey from '@mui/icons-material/VpnKey';
import './Header.css';

export const Header = () => {
  const { goToHome, goToLoginPage } = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const { isDesktop } = useContext(MediaQueryContext);

  const [UserButtonChildren, setUserButtonChildren] = useState<
    { label: string; icon?: ReactNode | null; callback: () => void }[]
  >([]);

  useEffect(() => {
    const children = [];

    if (!isDesktop) {
      children.push({
        label: 'Home',
        icon: <HomeIcon />,
        callback: () => {
          const homeElement = document.querySelector('#home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (homeElement) {
            homeElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            goToHome();
          }
        },
      });
    }

    if (user) {
      children.push({ label: 'Log Out', icon: <ExitToApp />, callback: handleLogout });
    } else {
      children.push({ label: 'Log In', icon: <VpnKey />, callback: () => goToLoginPage() });
    }
    setUserButtonChildren(children);
  }, [isDesktop, user]);

  const handleLogout = async () => {
    logout();
  };

  return (
    <header className='header'>
      <nav className='nav container grid'>
        <RouterLink className='nav_logo' to='/'>
          <img
            className='nav_logo_image'
            src='https://document.grail.moe/grail-chan-happy.png'
            alt=''
          />
        </RouterLink>
        {isDesktop ? (
          <div className='nav_menu'>
            <ul className='nav_list grid'>
              <li className='nav_item'></li>
            </ul>
          </div>
        ) : null}
        <div className='right-section' style={{ display: 'flex', gap: '30px' }}>
          <UserButton children={UserButtonChildren} />
        </div>
      </nav>
    </header>
  );
};
