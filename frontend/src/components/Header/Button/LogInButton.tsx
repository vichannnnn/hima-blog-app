import { useRouter } from 'next/navigation';
import { Button } from '@components';
import { User } from '@providers';

interface LogInButtonProps {
  user: User | null;
}

export const LogInButton = ({ user }: LogInButtonProps) => {
  const router = useRouter();
  const handleLoginRedirect = () => {
    if (!user) {
      router.push('/login');
    }
  };

  return (
    <>
      <Button className='user-button' onClick={handleLoginRedirect}>
        Hima
      </Button>
    </>
  );
};
