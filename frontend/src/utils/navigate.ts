import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();

  const goToHome = (options = {}) => navigate('/', options);
  const goToLoginPage = (options = {}) => navigate('/login', options);

  return {
    goToHome,
    goToLoginPage,
  };
};
