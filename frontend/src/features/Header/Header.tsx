import { Link as RouterLink } from 'react-router-dom';
import { HeaderButton } from './Button/HeaderButton';
import './Header.css';

export const Header = () => {
  return (
    <header className='header'>
      <div className='header-container'>
        <RouterLink className='nav_logo' to='/'>
          <img
            src='https://document.grail.moe/grail-chan-happy.png'
            alt='Will change next week~ Placeholder!'
          />
        </RouterLink>
        <HeaderButton />
      </div>
    </header>
  );
};
