import Image from 'next/image';
import { Counter } from '../Counter';
import styles from '../../styles/components/Hero.module.css';

export const Hero = () => {
  return (
    <div className={styles.heroContainer}>
      <Image
        src='https://image.himaa.me/hima-chan-posing.png'
        alt='Hima!'
        width='225'
        height='225'
      />
      <div>
        <h1>Welcome to Hima&apos;s Blog</h1>
        <p className={styles.heroSubtitle}>
          This is where the ramblings and yapping of engineering lies. It could be about work,
          personal projects, or anything really. I would ideally like to update the blog with new
          post every week to document down my engineering journey but we shall see how it goes!
        </p>
        {/*<Counter />*/}
      </div>
    </div>
  );
};
