import Link from 'next/link';
import Image from 'next/image';
import { HeaderButton } from './Button/HeaderButton';
import styles from '../../styles/components/Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link className={styles.navLogo} href='/'>
          <Image
            src='https://image.himaa.me/hima-chan-original.png'
            alt='Hima!'
            height='128'
            width='128'
          />
        </Link>
        <HeaderButton />
      </div>
    </header>
  );
};
