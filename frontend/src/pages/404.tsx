import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { Button } from '@components';
import styles from '@styles/pages/404.module.css';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Hima&apos;s Blog</title>
        <meta name='description' content="Whoops! You shouldn't be here" />
      </Head>
      <div className={styles.notFoundContainer}>
        <h1>Whoopsie!</h1>
        <h1>404 - Page Not Found</h1>
        <div className={styles.notFoundTextContainer}>
          <p>
            You shouldn&apos;t be here! The blog post or whatever content you&apos;re trying to look
            for probably doesn&apos;t exist here.. yet.
          </p>
          <p>But I guess you can enjoy a picture of me posing here in the meantime!</p>
          <div className={styles.notFoundImageContainer}>
            <Image
              src='https://image.himaa.me/hima-chan-posing.png'
              alt='Hima!'
              width='512'
              height='512'
            />
          </div>
        </div>
        <Link href='/' passHref>
          <Button>Back to home</Button>
        </Link>
      </div>
    </>
  );
}
