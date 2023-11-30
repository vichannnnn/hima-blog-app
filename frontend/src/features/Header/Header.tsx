import { Link as RouterLink } from 'react-router-dom';
import { HeaderButton } from './Button/HeaderButton';
import './Header.css';

export const Header = () => {
  return (
    <header className='header'>
      <div className='header-container'>
        <RouterLink className='nav_logo' to='/'>
          <img src='https://image.himaa.me/hima-chan-original.png' alt='Hima!' />
        </RouterLink>
        <HeaderButton />
      </div>
    </header>
  );
};
