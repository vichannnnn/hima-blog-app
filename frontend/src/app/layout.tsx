import type { Metadata } from 'next';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: 'Hima&apos;s Blog',
  description: 'Random ramblings of Hima&apos;s engineerings~',
  openGraph: {
    title: 'Hima&apos;s Blog',
    description: 'Random ramblings of Hima&apos;s engineerings~',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Head>
        <meta charSet='UTF-8' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
        <link rel='manifest' href='/manifest.json' />
        <meta name='msapplication-TileColor' content='#ffffff' />
        <meta name='theme-color' content='#ffffff' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta property='og:title' content="Hima's Blog" />
        <meta property='og:description' content="Random ramblings of Hima's engineerings~" />
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://blog.himaa.me' />
        <meta property='og:image' content='https://image.himaa.me/hima-chan-original.png' />
        <title>Hima&apos;s Blog</title>
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
