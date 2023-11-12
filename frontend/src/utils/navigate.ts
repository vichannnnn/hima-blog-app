import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();

  const goToHome = (options = {}) => navigate('/', options);
  const goToLoginPage = (options = {}) => navigate('/login', options);
  const goToCreateBlogPost = (options = {}) => navigate('/create', options);
  const goToUpdateBlogPost = (options = {}) => navigate('/update', options);

  return {
    goToHome,
    goToLoginPage,
    goToCreateBlogPost,
    goToUpdateBlogPost,
  };
};
