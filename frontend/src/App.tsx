import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { Footer, Header, LandingPage } from './features/LoginPage';
import { AuthProvider, MediaQueryProvider } from '@providers';
import { createTheme, ThemeProvider } from '@mui/material';
import { LoginPage } from './features/LoginPage/LoginPage';
import { CreateBlogPostPage } from './features/CreateBlogPostPage/CreateBlogPostPage';

const posts = [
  {
    title: 'CI/CD Pipeline, what are they?',
    date: '22 May 2023',
    summary:
      'You might have heard about the term "CI/CD Pipeline" everywhere. What does it do and what does it mean?',
    imageUrl:
      'https://image.fumi.moe/images//c79d447516a44e66bd5b923358932669-813ac9977e6436215c4d45cd7d7b4521.png',
  },
  {
    title: 'CI/CD Pipeline, what are they?',
    date: '22 May 2023',
    summary:
      'You might have heard about the term "CI/CD Pipeline" everywhere. What does it do and what does it mean?',
    imageUrl:
      'https://image.fumi.moe/images//c79d447516a44e66bd5b923358932669-813ac9977e6436215c4d45cd7d7b4521.png',
  },
  {
    title: 'CI/CD Pipeline, what are they?',
    date: '22 May 2023',
    summary:
      'You might have heard about the term "CI/CD Pipeline" everywhere. What does it do and what does it mean?',
    imageUrl:
      'https://image.fumi.moe/images//c79d447516a44e66bd5b923358932669-813ac9977e6436215c4d45cd7d7b4521.png',
  },
  {
    title: 'CI/CD Pipeline, what are they?',
    date: '22 May 2023',
    summary:
      'You might have heard about the term "CI/CD Pipeline" everywhere. What does it do and what does it mean?',
    imageUrl:
      'https://image.fumi.moe/images//c79d447516a44e66bd5b923358932669-813ac9977e6436215c4d45cd7d7b4521.png',
  },
  {
    title: 'CI/CD Pipeline, what are they?',
    date: '22 May 2023',
    summary:
      'You might have heard about the term "CI/CD Pipeline" everywhere. What does it do and what does it mean?',
    imageUrl:
      'https://image.fumi.moe/images//c79d447516a44e66bd5b923358932669-813ac9977e6436215c4d45cd7d7b4521.png',
  },
  {
    title: 'CI/CD Pipeline, what are they?',
    date: '22 May 2023',
    summary:
      'You might have heard about the term "CI/CD Pipeline" everywhere. What does it do and what does it mean?',
    imageUrl:
      'https://image.fumi.moe/images//c79d447516a44e66bd5b923358932669-813ac9977e6436215c4d45cd7d7b4521.png',
  },
  {
    title: 'CI/CD Pipeline, what are they?',
    date: '22 May 2023',
    summary:
      'You might have heard about the term "CI/CD Pipeline" everywhere. What does it do and what does it mean?',
    imageUrl:
      'https://image.fumi.moe/images//c79d447516a44e66bd5b923358932669-813ac9977e6436215c4d45cd7d7b4521.png',
  },
  {
    title: 'CI/CD Pipeline, what are they?',
    date: '22 May 2023',
    summary:
      'You might have heard about the term "CI/CD Pipeline" everywhere. What does it do and what does it mean?',
    imageUrl:
      'https://image.fumi.moe/images//c79d447516a44e66bd5b923358932669-813ac9977e6436215c4d45cd7d7b4521.png',
  },
];

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
  },
};

export function App() {
  const muiTheme = createTheme(customMuiTheme);

  return (
    <BrowserRouter>
      <ThemeProvider theme={muiTheme}>
        <MediaQueryProvider>
          <AuthProvider>
            <Header />
            <Routes>
              <Route path='/' element={<LandingPage posts={posts} />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/create' element={<CreateBlogPostPage />} />
              {/*<Route path='*' element={<NotFound />} />*/}
            </Routes>
            <Footer />
          </AuthProvider>
        </MediaQueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
