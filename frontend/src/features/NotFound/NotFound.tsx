import { Link as RouterLink } from 'react-router-dom';
import { Button } from '@components';
import FadeIn from 'react-fade-in';
import './NotFound.css';

export const NotFound = () => {
  return (
    <FadeIn>
      <div className='not-found-container'>
        <h1>Whoopsie!</h1>
        <h1>404 - Page Not Found</h1>
        <div className='not-found-text-container'>
          <p>
            You shouldn't be here! The blog post or whatever content you're trying to look for
            probably doesn't exist here.. yet.
          </p>
          <p>But I guess you can enjoy a picture of me posing here in the meantime!</p>
          <img src='https://image.himaa.me/hima-chan-posing.png' alt='Hima!' width='640' />
        </div>

        <RouterLink to='/'>
          <Button children='Back to home' />
        </RouterLink>
      </div>
    </FadeIn>
  );
};
