import { useContext, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AuthContext, MediaQueryContext } from '@providers';
import { useNavigation } from '@utils';
import HomeIcon from '@mui/icons-material/Home';
import { UserButton } from './UserButton';
import './Header.css';

export const Header = () => {
  const { goToHome, goToLoginPage } = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const { isDesktop } = useContext(MediaQueryContext);

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
  });

  return (
    <header className='header'>
      <div className='header-container'>
        <RouterLink className='nav_logo' to='/'>
          <img src='https://document.grail.moe/grail-chan-happy.png' alt='Placeholder Logo' />
        </RouterLink>
        {/*{isDesktop ? (*/}
        {/*  <div className='nav_menu'>*/}
        {/*    <ul className='nav_list grid'>*/}
        {/*      <li className='nav_item'></li>*/}
        {/*    </ul>*/}
        {/*  </div>*/}
        {/*) : null}*/}
        <div>
          <UserButton />
        </div>
      </div>
    </header>
  );
};
