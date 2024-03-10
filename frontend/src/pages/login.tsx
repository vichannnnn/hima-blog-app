import { useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Description, ErrorText, Title } from '@components';
import { AuthContext, LogInDetails } from '@providers';
import { SignInValidation } from '@utils';
import { FormControl, Stack, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import styles from '../styles/pages/login.module.css';

const Login = () => {
  const { user, isLoading, login } = useContext(AuthContext);
  const [loginError, setLoginError] = useState(' ');
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignInValidation),
  });

  if (user) {
    router.push('/');
  }

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/');
      }
    }
  }, [isLoading, user]);

  const handleLogin = async (formData: LogInDetails) => {
    try {
      await login(formData);
      router.push('/');
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        if (axiosError.response.status === 401) {
          setLoginError('Invalid username or password. Please try again.');
        } else if (axiosError.response.status === 422) {
          setLoginError('Invalid username or password. Please try again.');
        } else {
          setLoginError('An unexpected error occurred. Please try again later.');
        }
      }
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <Title>Log in</Title>
        <Description>Enter your credentials to access your account.</Description>
        <form className={styles.loginFormContainer} onSubmit={handleSubmit(handleLogin)}>
          <Stack direction='column' spacing={2} sx={{ width: '100%' }}>
            <FormControl id='username'>
              <TextField
                label='Username'
                type='text'
                error={Boolean(errors.username)}
                helperText={errors.username?.message as unknown as ReactNode}
                {...register('username')}
                required
                fullWidth
              />
            </FormControl>
            <FormControl id='password'>
              <TextField
                label='Password'
                type='password'
                error={Boolean(errors.password)}
                helperText={errors.username?.message as unknown as ReactNode}
                {...register('password')}
                required
              />
            </FormControl>
            {loginError && <ErrorText>{loginError}</ErrorText>}
            <div className={styles.loginButtonContainer}>
              <Button type='submit'>Log In</Button>
            </div>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default Login;
