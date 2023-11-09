import { useContext } from 'react';
import { ButtonBase } from '@components';
import { AuthContext, MediaQueryContext } from '@providers';
import { useNavigation } from '@utils';
import './UserButton.css';

export const UserButton = () => {
  const { goToLoginPage } = useNavigation();
  const { isDesktop } = useContext(MediaQueryContext);
  const { user } = useContext(AuthContext);

  const handleClick = () => {
    console.log('Button clicked!');
    if (!user) {
      goToLoginPage();
    }
  };

  return (
    <>
      {isDesktop ? (
        <ButtonBase className='user-button' onClick={handleClick}>
          Log in
        </ButtonBase>
      ) : null}
    </>
  );
};
