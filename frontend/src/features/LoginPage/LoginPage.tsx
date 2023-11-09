import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ButtonBase } from '@components';
import { AuthContext, LogInDetails } from '@providers';
import { useNavigation, SignInValidation } from '@utils';
import { Button, FormControl, Stack, TextField } from '@mui/material';

import './LoginPage.css';

export const LoginPage = () => {
  const { goToHome } = useNavigation();
  const { user, isLoading, login } = useContext(AuthContext);
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
      console.log(error);
    }
  };

  return (
    <div className='login-page'>
      <div className='login-container'>
        <div className='login-title'>Log in</div>
        <div className='login-description'>Enter your credentials to access your account.</div>
        <form className='login-form-container' onSubmit={handleSubmit(handleLogin)}>
          <Stack direction='column' spacing={2} sx={{ width: '100%' }}>
            <FormControl id='username'>
              <TextField
                label='Username'
                type='text'
                error={Boolean(errors.username)}
                helperText={errors.username?.message as unknown as React.ReactNode}
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
                helperText={errors.username?.message as unknown as React.ReactNode}
                {...register('password')}
                required
              />
            </FormControl>
            <div className='login-button-container'>
              <ButtonBase type='submit' variant='contained'>
                Log In
              </ButtonBase>
            </div>
          </Stack>
        </form>
      </div>
    </div>
  );
};
