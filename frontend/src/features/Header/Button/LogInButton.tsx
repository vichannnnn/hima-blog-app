import { ButtonBase } from '@components';
import { User } from '@providers';
import { useNavigation } from '@utils';

interface LogInButtonProps {
  user: User | null;
}

export const LogInButton = ({ user }: LogInButtonProps) => {
  const { goToLoginPage } = useNavigation();

  const handleLoginRedirect = () => {
    if (!user) {
      goToLoginPage();
    }
  };

  return (
    <>
      <ButtonBase className='user-button' onClick={handleLoginRedirect}>
        Hima
      </ButtonBase>
    </>
  );
};
