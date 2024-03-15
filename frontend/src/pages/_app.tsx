import Head from 'next/head';
import { AppProps } from 'next/app';
import { DefaultSeo, NextSeo } from 'next-seo';
import { AuthProvider, MediaQueryProvider } from '@providers';
import { createTheme, ThemeProvider } from '@mui/material';
import { Header } from '@components/Header';
import { Footer } from '@components/Footer';
import '../app/globals.css';

const customMuiTheme = {
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          cursor: 'pointer',
          ':hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'PatrickHandSC, sans-serif',
          fontSize: '24px',
          backgroundColor: '#fcfbf8',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#fcfbf8',
          borderRadius: '24px',
        },
      },
    },
  },
};

function MyApp({ Component, pageProps }: AppProps) {
  const muiTheme = createTheme(customMuiTheme);

  return (
    <ThemeProvider theme={muiTheme}>
      <MediaQueryProvider>
        <AuthProvider>
          <Header />
          <DefaultSeo
            openGraph={{
              type: 'website',
              locale: 'en_IE',
              url: 'https://blog.himaa.me/',
              siteName: "Hima's Blog",
              title: "Hima's Blog",
              description: "Random ramblings of Hima's engineerings~",
            }}
          />
          {/*<Head>*/}
          {/*  <meta charSet='UTF-8' />*/}
          {/*  <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />*/}
          {/*  <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />*/}
          {/*  <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />*/}
          {/*  <link rel='manifest' href='/manifest.json' />*/}
          {/*  <meta name='msapplication-TileColor' content='#ffffff' />*/}
          {/*  <meta name='theme-color' content='#ffffff' />*/}
          {/*  <meta name='viewport' content='width=device-width, initial-scale=1.0' />*/}
          {/*  <meta property='og:title' content="Hima's Blog" />*/}
          {/*  <meta property='og:description' content="Random ramblings of Hima's engineerings~" />*/}
          {/*  <meta property='og:type' content='website' />*/}
          {/*  <meta property='og:url' content='https://blog.himaa.me' />*/}
          {/*  <meta property='og:image' content='https://image.himaa.me/hima-chan-original.png' />*/}
          {/*  <title>Hima&apos;s Engineering Blog</title>*/}
          {/*</Head>*/}
          <Component {...pageProps} />
          <Footer />
        </AuthProvider>
      </MediaQueryProvider>
    </ThemeProvider>
  );
}

export default MyApp;
