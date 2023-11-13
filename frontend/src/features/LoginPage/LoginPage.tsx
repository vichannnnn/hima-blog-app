import { useContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ButtonBase, Description, ErrorText, Title } from '@components';
import { AuthContext, LogInDetails } from '@providers';
import { useNavigation, SignInValidation } from '@utils';
import { FormControl, Stack, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import './LoginPage.css';

export const LoginPage = () => {
  const { goToHome } = useNavigation();
  const { user, isLoading, login } = useContext(AuthContext);
  const [loginError, setLoginError] = useState(' ');
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignInValidation),
  });

  if (user) {
    goToHome();
  }

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        navigate('/');
      }
    }
  }, [isLoading, user]);

  const handleLogin = async (formData: LogInDetails) => {
    try {
      await login(formData);
      goToHome();
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
    <div className='login-page'>
      <div className='login-container'>
        <Title>Log in</Title>
        <Description>Enter your credentials to access your account.</Description>
        <form className='login-form-container' onSubmit={handleSubmit(handleLogin)}>
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
            <div className='login-button-container'>
              <ButtonBase type='submit'>Log In</ButtonBase>
            </div>
          </Stack>
        </form>
      </div>
    </div>
  );
};
