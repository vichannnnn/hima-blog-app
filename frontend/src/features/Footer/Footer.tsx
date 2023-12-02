import { Link as RouterLink } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  return (
    <div className='footer-container'>
      <RouterLink className='nav_logo' to='/'>
        <img src='https://image.himaa.me/hima-chan-sitting.png' alt='' />
      </RouterLink>
      <p>© 2023 Hima • Questions? Contact me at violet@himaa.me</p>
    </div>
  );
};
